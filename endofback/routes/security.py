from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
import redis.asyncio as redis
from auth.deps import get_session
from models.madoo import SecurityLogTable 

router = APIRouter()

redis_client = redis.from_url("redis://localhost:6379", encoding="utf-8", decode_responses=True)

class TerminationRequest(BaseModel):
    type: str 
    target: str

@router.get("/logs-telemetry")
async def pull_live_security_matrix(session: Session = Depends(get_session)):
    alerts = []
 
    try:
        stream_logs = await redis_client.xread({"STK:security:stream": "0"}, count=10)
        if stream_logs:
            for _, messages in stream_logs:
                for _, payload in messages:
                    alerts.append({
                        "type": payload.get("type", "RATE_LIMIT_OVERFLOW"),
                        "source": payload.get("source", "UNKNOWN_IP"),
                        "details": payload.get("details", "Brute force stream vector"),
                        "timestamp": "LIVE METRIC",
                        "kill_type": payload.get("kill_type", "IP")
                    })
    except Exception as e:
        print(f"Non-blocking Redis telemetry log bypass: {e}")

    db_statement = select(SecurityLogTable).order_by(SecurityLogTable.created_at.desc()).limit(15)
    db_logs = session.exec(db_statement).all()
    
    for log in db_logs:
        alerts.append({
            "type": log.violation_type,
            "source": log.offending_vector,
            "details": log.narrative,
            "timestamp": log.created_at.strftime("%H:%M:%S EAT"),
            "kill_type": log.mitigation_mode
        })

    blocked_ips = await redis_client.smembers("blacklist:ips")
    blocked_phones = await redis_client.smembers("blacklist:phones")

    return {
        "alerts": alerts,
        "blocked": list(blocked_ips) + list(blocked_phones)
    }

@router.post("/terminate")
async def execute_remote_kill_switch(payload: TerminationRequest, session: Session = Depends(get_session)):
    if payload.type == "IP":
        await redis_client.sadd("blacklist:ips", payload.target)
    elif payload.type == "PHONE":
        await redis_client.sadd("blacklist:phones", payload.target)
    else:
        raise HTTPException(status_code=400, detail="Invalid mitigation vector")

    execution_entry = SecurityLogTable(
        violation_type="MANUAL_TERMINATION_OVERRIDE",
        offending_vector=payload.target,
        narrative=f"Admin command authorization revoked privileges.",
        mitigation_mode=payload.type
    )
    session.add(execution_entry)
    session.commit()
    
    return {"status": "TERMINATED", "message": f"Global firewall drop applied onto: {payload.target}"}