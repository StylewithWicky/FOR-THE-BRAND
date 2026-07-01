from fastapi import APIRouter, Depends, HTTPException, Request, status
from requests import request, session
from sqlmodel import Session, select
from auth.database import get_session
from auth.deps import get_current_user 
from models.audit import AuditLog
from schema.audit import AuditLogCreate, AuditLogRead
from models.msee import Mzee
from typing import List

router = APIRouter()

@router.post("/log", status_code=status.HTTP_201_CREATED)
async def create_log(
    *,
    request: Request,
    log_in: AuditLogCreate,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):

    try:
        client_ip = request.headers.get("X-Forwarded-For") or (request.client.host if request.client else "Unknown")

        new_log = AuditLog(
            admin_email=current_user.email.lower(),
            action=log_in.action,
            module=log_in.module,
            details=log_in.details,
            ip_address=client_ip,
            user_agent=request.headers.get("User-Agent", "Unknown")
        )
        
        session.add(new_log)
        session.commit() # This saves it
        session.refresh(new_log)
        return {"status": "recorded", "trace_id": new_log.id}
        
    except Exception as e:
        session.rollback() 
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/logs", response_model=List[AuditLogRead])
async def get_all_logs(
    session: Session = Depends(get_session),
    current_admin: Mzee = Depends(get_current_user)
):
    if not current_admin.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    statement = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100)
    results = session.exec(statement).all()
    return results
