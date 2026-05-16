from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select
from auth.database import get_session
from auth.deps import get_current_user 
from models.audit import AuditLog
from schema.audit import AuditLogCreate, AuditLogRead
from typing import List

router = APIRouter()

@router.post("/log", status_code=201)
async def create_log(
    *,
    request: Request,
    log_in: AuditLogCreate,
    session: Session = Depends(get_session),
    current_admin: str = Depends(get_current_user) # Securely gets email from Token
):
    new_log = AuditLog(
        admin_email=current_admin.email.capitalize(), # Store email in capitalized form for consistency
        action=log_in.action,
        module=log_in.module,
        details=log_in.details,
        ip_address=request.client.host,
        user_agent=request.headers.get("User-Agent")
    )
    
    session.add(new_log)
    session.commit()
    session.refresh(new_log)
    return {"status": "recorded", "trace_id": new_log.id}

@router.get("/logs", response_model=List[AuditLogRead])
async def get_all_logs(
    session: Session = Depends(get_session),
    current_admin: str = Depends(get_current_user)
):
    """Fetches full history for the Personnel Feed."""
    statement = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100)
    results = session.exec(statement).all()
    return results