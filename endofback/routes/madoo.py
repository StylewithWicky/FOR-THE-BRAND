from datetime import datetime, timezone
import ipaddress
from fastapi import APIRouter, Depends, HTTPException, Request, status, BackgroundTasks
from sqlmodel import Session, select
from auth.database import get_session
from auth.deps import get_current_user
from models.msee import Mzee
from models.madoo import Invoice, MadooInteraction, InvoiceSchema, FinanceRecord
from service.madoo import MpesaService
from service.notifications import send_receipt_email
from config import settings
from typing import List

router = APIRouter()
mpesa_service = MpesaService()


@router.get("/invoices", response_model=List[InvoiceSchema])
def list_invoices(
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return session.exec(select(Invoice)).all()


@router.post("/push", status_code=status.HTTP_202_ACCEPTED)
async def trigger_payment_push(
    invoice_id: int,
    invoice_number: str,
    phone_number: str,
    amount: float, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    db_invoice = session.get(Invoice, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

    response_data = mpesa_service.send_stk_push(phone_number, amount, invoice_number)
    if response_data.get("ResponseCode") != "0":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Safaricom rejected the request."
        )

    txn = MadooInteraction(
        invoice_id=db_invoice.id,
        phone_number=phone_number,
        amount=amount,
        merchant_request_id=response_data.get("MerchantRequestID"),
        checkout_request_id=response_data.get("CheckoutRequestID"),
        status="PENDING"
    )
    session.add(txn)
    session.commit()
    return {"status": "PUSH_INITIATED", "checkout_request_id": txn.checkout_request_id}


@router.post("/callback")
async def mpesa_async_callback(
    request: Request, 
    background_tasks: BackgroundTasks,  
    session: Session = Depends(get_session)
):
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    client_ip = forwarded_for.split(",")[0].strip() if forwarded_for else (request.client.host if request.client else "127.0.0.1")
    
    if not verify_safaricom_origin(client_ip):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Untrusted origin.")

    payload = await request.json()
    stk_callback = payload.get("Body", {}).get("stkCallback", {})
    result_code = stk_callback.get("ResultCode")
    checkout_id = stk_callback.get("CheckoutRequestID")

    txn = session.exec(select(MadooInteraction).where(MadooInteraction.checkout_request_id == checkout_id)).first()
    if not txn:
        return {"Status": "Handshake mismatch"}
    if txn.status != "PENDING":
        return {"ResultCode": 0, "ResultDesc": "Already processed"}

    try:
        txn.result_code = result_code
        txn.result_desc = stk_callback.get("ResultDesc")
        txn.updated_at = datetime.now(timezone.utc)

        if result_code == 0:
            meta_items = stk_callback.get("CallbackMetadata", {}).get("Item", [])
            receipt = next((i.get("Value") for i in meta_items if i.get("Name") == "MpesaReceiptNumber"), None)
            
            txn.status = "SUCCESS"
            txn.mpesa_receipt = receipt
            
            invoice = session.get(Invoice, txn.invoice_id)
            if invoice:
                invoice.status = "PAID"
                revenue = FinanceRecord(
                    event_id=invoice.event_id,
                    category="CLIENT_PAYMENT",
                    transaction_type="REVENUE",
                    amount=txn.amount,
                    invoice_id=invoice.id
                )
                session.add(revenue)
                session.add(invoice)

                if invoice.owner_email:
                    background_tasks.add_task(
                        send_receipt_email, 
                        invoice.owner_email, 
                        invoice.invoice_number, 
                        txn.amount, 
                        receipt
                    )
        else:
            txn.status = "FAILED"

        session.add(txn)
        session.commit()
        
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Callback processing crash sequence: {str(e)}"
        )
        
    return {"ResultCode": 0, "ResultDesc": "Success"}


def verify_safaricom_origin(ip_string: str) -> bool:
    if ip_string in ["127.0.0.1", "localhost"]: 
        return True
    try:
        client_ip = ipaddress.ip_address(ip_string)
        subnets = getattr(settings, "safaricom_subnets", [])
        for subnet_str in subnets:
            if client_ip in ipaddress.ip_network(subnet_str, strict=False): 
                return True
        return False
    except ValueError: 
        return False