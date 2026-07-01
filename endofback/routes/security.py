from datetime import datetime, timezone
import logging
import redis.asyncio as redis
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from auth.database import get_session  # Standardized database connector mapping
from auth.deps import get_current_user
from models.msee import Mzee
from models.madoo import SecurityLogTable
from config import settings  # Leveraged for environment variables
from typing import List, Dict, Any

router = APIRouter()

# Dynamically loaded from configuration configurations to protect scaling environments
redis_client = redis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)

class TerminationRequest(BaseModel):
    type: str  # "IP" or "PHONE"
    target: str


@router.get("/logs-telemetry")
async def pull_live_security_matrix(
    session: Session = Depends(get_session),
    current_admin: Mzee = Depends(get_current_user)
):
    # Enforce strict RBAC validation gates
    if not current_admin.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Admin credentials required."
        )

    alerts: List[Dict[str, Any]] = []
    
    try:
        # Use "$" to exclusively consume messages generated AFTER this polling call
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
        logging.error(f"Non-blocking Redis telemetry stream bypass: {e}")

    # Query relational historical trail logs
    db_statement = select(SecurityLogTable).order_by(SecurityLogTable.created_at.desc()).limit(15)
    db_logs = session.exec(db_statement).all()
    
    for log in db_logs:
        # Safe protective fallback against NoneType values in date timestamps
        formatted_time = log.created_at.strftime("%H:%M:%S EAT") if log.created_at else "HISTORICAL"
        alerts.append({
            "type": log.violation_type,
            "source": log.offending_vector,
            "details": log.narrative,
            "timestamp": formatted_time,
            "kill_type": log.mitigation_mode
        })

    # Pull in distinct memory sets
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
    # Enforce strict RBAC validation gates
    if not current_admin.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Admin credentials required."
        )

    vector_type = payload.type.upper()
    
    if vector_type == "IP":
        await redis_client.sadd("blacklist:ips", payload.target)
    elif vector_type == "PHONE":
        await redis_client.sadd("blacklist:phones", payload.target)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid mitigation vector. Choose 'IP' or 'PHONE'."
        )

    # Log execution history along with the identity email that initiated the drop
    execution_entry = SecurityLogTable(
        violation_type="MANUAL_TERMINATION_OVERRIDE",
        offending_vector=payload.target,
        narrative=f"Privileges revoked by administrator: {current_admin.email.lower()}.",
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
            detail=f"Failed to commit system execution trace: {str(e)}"
        )
    
    return {
        "status": "TERMINATED", 
        "target": payload.target, 
        "vector": vector_type
    }