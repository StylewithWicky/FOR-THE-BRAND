import os
from datetime import datetime
from dotenv import load_dotenv, find_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi_limiter.depends import RateLimiter 
from sqlmodel import Session, select, desc
from auth.database import get_session
from auth.deps import get_current_user
from models.system import SecurityAudit, SystemConfig

router = APIRouter()

load_dotenv(find_dotenv())
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

async def log_action(session: Session, action: str, user_email: str, status: str, request: Request):
    audit = SecurityAudit(
        action=action,
        user_email=user_email,  
        ip_address=request.client.host,
        status=status,
        timestamp=datetime.utcnow()
    )
    session.add(audit)
    session.commit()

@router.get("/audit-logs", 
    dependencies=[Depends(RateLimiter(10 , 60))]
)
async def get_logs(
    request: Request,
    session: Session = Depends(get_session), 
    user_data: any = Depends(get_current_user)
):
    if isinstance(user_data, dict):
        user_email = user_data.get("email")
    else:
        user_email = getattr(user_data, "email", None)
    
    if not user_email or user_email != ADMIN_EMAIL:
        failed_email = user_email or str(user_data)
        await log_action(session, "ILLEGAL_LOG_ACCESS_ATTEMPT", failed_email, "FAILED", request)
        raise HTTPException(
            status_code=403, 
            detail="CRITICAL_AUTH_FAILURE: This incident will be reported."
        )
        
    statement = select(SecurityAudit).order_by(desc(SecurityAudit.timestamp)).limit(100)
    return session.exec(statement).all()

@router.post("/maintenance/toggle")
async def toggle_maintenance(
    request: Request,
    enabled: bool,
    session: Session = Depends(get_session),
    user_data: any = Depends(get_current_user)
):
    if isinstance(user_data, dict):
        user_email = user_data.get("email")
    else:
        user_email = getattr(user_data, "email", None)
    
    if not user_email or user_email != ADMIN_EMAIL:
         raise HTTPException(status_code=403, detail="UNAUTHORIZED_ACTION")

    config = session.exec(select(SystemConfig).where(SystemConfig.key == "maintenance_mode")).first()
    
    if not config:
        config = SystemConfig(key="maintenance_mode", value="false", description="Global system maintenance lock")
        session.add(config)
        
    config.value = "true" if enabled else "false"
    config.updated_at = datetime.utcnow()
    session.add(config)
    session.commit()

    status = "ENABLED" if enabled else "DISABLED"
    await log_action(session, f"MAINTENANCE_MODE_{status}", user_email, "SUCCESS", request)
    return {"status": "System State Updated", "mode": status}