from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
import redis.asyncio as redis
from auth.deps import get_session
from models.madoo import SecurityLogTable
import datetime

router = APIRouter(prefix="/api/v1/MADOO/admin/security", tags=["Security Infrastructure"])

r = redis.from_url("redis://localhost:6379", encoding="utf-8", decode_responses=True)

@router.get("/logs-telemetry")
async def pull_live_security_matrix(session: Session = Depends(get_session)):
    alerts = []
    

    try:
        stream_logs = await r.xread({"STK:security:stream": "0"}, count=10)
        
        if stream_logs:
            for stream_key, messages in stream_logs:
                for msg_id, payload in messages:
                    alerts.append({
                        "type": payload.get("type", "UNKNOWN_THREAT"),
                        "source": payload.get("source", "UNKNOWN_IP"),
                        "details": payload.get("details", "Rate limit capacity overflow"),
                        "timestamp": "LIVE STREAM",
                        "kill_type": payload.get("kill_type", "IP")
                    })
    except Exception as redis_fault:
        print(f"SECURITY CRITICAL: Redis stream intercept error -> {redis_fault}")

   
    statement = (
        select(SecurityLogTable)
        .order_by(SecurityLogTable.created_at.desc())
        .limit(15)
    )
    db_logs = session.exec(statement).all()
    
    for db_log in db_logs:
        alerts.append({
            "type": db_log.violation_type,      
            "source": db_log.offending_vector,  
            "details": db_log.narrative,         
            "timestamp": db_log.created_at.strftime("%H:%M:%S EAT"),
            "kill_type": db_log.mitigation_mode  
        })

  
    return {"alerts": alerts}