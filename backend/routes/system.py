import json
import logging
import os
from datetime import datetime, timezone
from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi_limiter.depends import RateLimiter 
from sqlmodel import Session, select
from auth.database import get_session
from auth.deps import get_current_user
from models.system import SecurityAudit, SystemConfig
from models.msee import Mzee
from typing import List, Set

router = APIRouter()

load_dotenv(find_dotenv())

def get_admin_emails() -> Set[str]:
   
    try:
        raw_emails = json.loads(os.getenv("ADMIN_EMAIL", "[]"))
        return {str(email).strip().lower() for email in raw_emails}
    except Exception:
        return set()


def log_action(session: Session, action: str, user_email: str, run_status: str, request: Request) -> None:
    client_ip = request.headers.get("X-Forwarded-For")
    if not client_ip and request.client:
        client_ip = request.client.host
    elif not client_ip:
        client_ip = "Unknown"

    audit = SecurityAudit(
        action=action,
        user_email=user_email,  
        ip_address=client_ip,
        status=run_status,
        timestamp=datetime.now(timezone.utc)
    )
    session.add(audit)

audit_limiter = RateLimiter(10, 60)
async def secure_audit_limiter(request: Request):
    if isinstance(audit_limiter.identifier, int) or audit_limiter.identifier is None:
        from fastapi_limiter import default_identifier
        audit_limiter.identifier = default_identifier
        
    return await audit_limiter(request)


@router.get("/audit-logs", dependencies=[Depends(secure_audit_limiter)])
def get_logs(
    request: Request,
    session: Session = Depends(get_session), 
    current_user: Mzee = Depends(get_current_user)
):
    email_clean = current_user.email.strip().lower()
    
    if not current_user.is_admin and email_clean not in get_admin_emails():
        log_action(session, "ILLEGAL_LOG_ACCESS_ATTEMPT", email_clean, "FAILED", request)
        session.commit() 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="CRITICAL_AUTH_FAILURE: This incident will be reported."
        )
        
    statement = select(SecurityAudit).order_by(SecurityAudit.timestamp.desc()).limit(100)
    return session.exec(statement).all()


@router.post("/maintenance/toggle", status_code=status.HTTP_200_OK)
def toggle_maintenance(
    request: Request,
    enabled: bool,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    email_clean = current_user.email.strip().lower()
    
    if not current_user.is_admin and email_clean not in get_admin_emails():
         raise HTTPException(
             status_code=status.HTTP_403_FORBIDDEN, 
             detail="UNAUTHORIZED_ACTION"
         )

    try:
        config = session.exec(select(SystemConfig).where(SystemConfig.key == "maintenance_mode")).first()
        
        if not config:
            config = SystemConfig(key="maintenance_mode", value="false", description="Global system maintenance lock")
            session.add(config)
            
        config.value = "true" if enabled else "false"
        config.updated_at = datetime.now(timezone.utc)
        session.add(config)
        
        
        status_label = "ENABLED" if enabled else "DISABLED"
        log_action(session, f"MAINTENANCE_MODE_{status_label}", email_clean, "SUCCESS", request)
        
        session.commit()
        
    except Exception as e:
        session.rollback()
        logging.error(f"Failed to process system state mutation transition: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update global database configurations."
        )

    return {"status": "System State Updated", "mode": status_label}