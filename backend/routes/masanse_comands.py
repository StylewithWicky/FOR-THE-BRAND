from datetime import datetime, timezone
import redis.asyncio as redis
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from auth.database import get_session  # Standardized db engine session context import
from auth.deps import get_current_user
from models.msee import Mzee
from models.madoo import SecurityLogTable
from config import settings
from typing import List, Dict, Any

router = APIRouter()
redis_client = redis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)

class TerminationRequest(BaseModel):
    type: str  # "IP" or "PHONE"
    target: str


@router.get("/logs-telemetry")
async def pull_live_security_matrix(
    session: Session = Depends(get_session),
    current_admin: Mzee = Depends(get_current_user)
):
    # Secure edge authorization block
    if not current_admin.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    alerts: List[Dict[str, Any]] = []
    
    try:
        # Use "$" to grab only new real-time alerts that arrived AFTER the client established the request connection
        stream_logs = await redis_client.xread({"STK:security:stream": "$"}, count=10, block=500)
        if stream_logs:
            for _, messages in stream_logs:
                for _, payload in messages:
                    alerts.append({
                        "type": payload.get("type", "RATE_LIMIT_OVERFLOW"),
                        "source": payload.get("source", "UNKNOWN_IP"),
                        "details": payload.get("details", "Brute force stream vector"),
                        "timestamp": datetime.now(timezone.utc).strftime("%H:%M:%S UTC"),
                        "kill_type": payload.get("kill_type", "IP")
                    })
    except Exception as e:
        # Graceful fallback logging for non-critical monitoring failure
        import logging
        logging.error(f"Non-blocking Redis telemetry stream logging bypass: {e}")

    # Relational Database Fallbacks Audit Trail Lookups
    db_statement = select(SecurityLogTable).order_by(SecurityLogTable.created_at.desc()).limit(15)
    db_logs = session.exec(db_statement).all()
    
    for log in db_logs:
        # Safe timezone formatting handling guard
        formatted_time = log.created_at.strftime("%H:%M:%S EAT") if log.created_at else "HISTORICAL"
        alerts.append({
            "type": log.violation_type,
            "source": log.offending_vector,
            "details": log.narrative,
            "timestamp": formatted_time,
            "kill_type": log.mitigation_mode
        })

    # Fetch live memory pools concurrently 
    blocked_ips = await redis_client.smembers("blacklist:ips")
    blocked_phones = await redis_client.smembers("blacklist:phones")

    return {
        "alerts": alerts,
        "blocked_ips": list(blocked_ips),
        "blocked_phones": list(blocked_phones)
    }


@router.post("/terminate", status_code=status.HTTP_201_CREATED)
async def execute_remote_kill_switch(
    payload: TerminationRequest, 
    session: Session = Depends(get_session),
    current_admin: Mzee = Depends(get_current_user)
):
    if not current_admin.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    vector_type = payload.type.upper()
    
    # Executing localized mitigation vector matching
    if vector_type == "IP":
        await redis_client.sadd("blacklist:ips", payload.target)
    elif vector_type == "PHONE":
        await redis_client.sadd("blacklist:phones", payload.target)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid mitigation vector specified. Must be 'IP' or 'PHONE'."
        )

    execution_entry = SecurityLogTable(
        violation_type="MANUAL_TERMINATION_OVERRIDE",
        offending_vector=payload.target,
        narrative=f"Privileges manually revoked by Admin: {current_admin.email.lower()}.",
        mitigation_mode=vector_type,
        created_at=datetime.now(timezone.utc)
    )
    
    try:
        session.add(execution_entry)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to record execution trace locally: {str(e)}"
        )
        
    return {
        "status": "TERMINATED", 
        "target": payload.target, 
        "vector": vector_type
    }