from datetime import datetime
import ipaddress
from fastapi import APIRouter, Depends, HTTPException, Request, status, BackgroundTasks
from sqlmodel import Session, select
from auth.database import get_session
from models.madoo import MadooInteraction, Invoice
from service.madoo import MpesaService
from service.notifications import send_receipt_email  
from config import settings

router = APIRouter()
mpesa_service = MpesaService()

def verify_safaricom_origin(ip_string: str) -> bool:
    if ip_string in ["127.0.0.1", "localhost"]:
        return True
    try:
        client_ip = ipaddress.ip_address(ip_string)
        for subnet_str in settings.safaricom_subnets:
            if client_ip in ipaddress.ip_network(subnet_str, strict=False):
                return True
        return False
    except ValueError:
        return False

@router.post("/push", status_code=status.HTTP_202_ACCEPTED)
async def trigger_payment_push(
    invoice_id: str,
    invoice_number: str,
    phone_number: str,
    amount: int,
    session: Session = Depends(get_session)
):
   
    db_invoice = session.exec(select(Invoice).where(Invoice.id == invoice_id)).first()
    
    if not db_invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice with ID '{invoice_id}' does not exist. Please create the invoice before initiating payment."
        )

  
    response_data = mpesa_service.send_stk_push(
        phone_number=phone_number, 
        amount=amount, 
        invoice_num=invoice_number
    )

    merchant_id = response_data.get("MerchantRequestID")
    checkout_id = response_data.get("CheckoutRequestID")
    response_code = response_data.get("ResponseCode")

    if response_code != "0":
        raise HTTPException(status_code=400, detail="Safaricom rejected the push initiation configuration.")

    
    txn = MadooInteraction(
        invoice_id=db_invoice.id,
        phone_number=phone_number,
        amount=amount,
        merchant_request_id=merchant_id,
        checkout_request_id=checkout_id,
        status="PENDING"
    )
    session.add(txn)
    session.commit()

    return {
        "status": "PUSH_INITIATED",
        "merchant_request_id": merchant_id,
        "checkout_request_id": checkout_id
    }

@router.post("/callback")
async def mpesa_async_callback(
    request: Request, 
    background_tasks: BackgroundTasks,  
    session: Session = Depends(get_session)
):
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
    else:
        client_ip = request.headers.get("X-Real-IP") or (request.client.host if request.client else "UNKNOWN_IP")

    if not verify_safaricom_origin(client_ip):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Callback origin untrusted.")

    payload = await request.json()
    
    stk_callback = payload.get("Body", {}).get("stkCallback", {})
    result_code = stk_callback.get("ResultCode")
    result_desc = stk_callback.get("ResultDesc")
    checkout_id = stk_callback.get("CheckoutRequestID")

    statement = select(MadooInteraction).where(MadooInteraction.checkout_request_id == checkout_id)
    txn = session.exec(statement).first()

    if not txn:
        return {"Status": "Handshake signature mismatch, event ignored"}

    txn.result_code = result_code
    txn.result_desc = result_desc
    txn.updated_at = datetime.utcnow()

    if result_code == 0:
        meta_items = stk_callback.get("CallbackMetadata", {}).get("Item", [])
        receipt = next((item.get("Value") for item in meta_items if item.get("Name") == "MpesaReceiptNumber"), None)
        
        txn.status = "SUCCESS"
        txn.mpesa_receipt = receipt
        
        invoice = session.exec(select(Invoice).where(Invoice.id == txn.invoice_id)).first()
        if invoice:
            invoice.status = "PAID"
            invoice.updated_at = datetime.utcnow()
            session.add(invoice)
            
            if hasattr(invoice, 'owner_email') and invoice.owner_email:
                background_tasks.add_task(
                    send_receipt_email,
                    recipient_email=invoice.owner_email,
                    invoice_num=invoice.invoice_number,
                    amount=txn.amount,
                    receipt_num=receipt
                )
    else:
        txn.status = "FAILED"

    session.add(txn)
    session.commit()
    
    return {"ResultCode": 0, "ResultDesc": "Callback processed smoothly"}