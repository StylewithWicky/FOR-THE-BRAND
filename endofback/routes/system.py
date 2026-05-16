from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi_limiter.depends import RateLimiter 
from sqlmodel import Session, select, desc
from auth.database import get_session
from auth.deps import get_current_user
from models.system import SecurityAudit, SystemConfig
from dotenv import load_dotenv ,find_dotenv
import os

router = APIRouter()
load_dotenv(find_dotenv())
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")



@router.get("/audit-logs", 
    dependencies=[Depends(RateLimiter(times=10, seconds=60))]
)
async def get_logs(
    request: Request,
    session: Session = Depends(get_session), 
    user_data: dict = Depends(get_current_user)
):
    user_email = user_data.get("email")
    
    if user_email != ADMIN_EMAIL:
        await log_action(session, "ILLEGAL_LOG_ACCESS_ATTEMPT", user_email, "FAILED", request)
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
    user_data: dict = Depends(get_current_user)
):
    user_email = user_data.get("email")
    
    if user_email != ADMIN_EMAIL:
         raise HTTPException(status_code=403, detail="UNAUTHORIZED_ACTION")

    config = session.exec(select(SystemConfig).where(SystemConfig.key == "maintenance_mode")).first()
    if config:
        config.value = "true" if enabled else "false"
        session.add(config)
        session.commit()

    status = "ENABLED" if enabled else "DISABLED"
    await log_action(session, f"MAINTENANCE_MODE_{status}", user_email, "SUCCESS", request)
    return {"status": "System State Updated", "mode": status}