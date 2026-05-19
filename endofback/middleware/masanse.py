import time
from fastapi import Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware
import redis.asyncio as redis
from sqlmodel import Session
from auth.database import get_session
from models.madoo import SecurityLogTable
from config import settings

class AutomatedFirewallMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.redis_client = redis.from_url(
            settings.redis_url, encoding="utf-8", decode_responses=True
        )

    async def dispatch(self, request: Request, call_next):
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.headers.get("X-Real-IP") or (
                request.client.host if request.client else "UNKNOWN_IP"
            )
        
        path = str(request.url.path)
        
        is_blocked = await self.redis_client.get(f"blacklist:ip:{client_ip}")
        if is_blocked:
            return Response(
                content="ACCESS_DENIED_GLOBAL_BLOCK_ACTIVE", 
                status_code=status.HTTP_403_FORBIDDEN
            )

        if path == "/finance/mpesa/push":
            current_time = int(time.time())
            rate_key = f"rate:{client_ip}:{current_time // 60}"
            
            async with self.redis_client.pipeline(transaction=True) as pipe:
                pipe.incr(rate_key)
                pipe.expire(rate_key, 60)
                request_count, _ = await pipe.execute()
                
            if request_count > 3:
                await self.log_and_ban_vector(
                    ip_address=client_ip,
                    phone_number=None,
                    violation="RATE_LIMIT_OVERFLOW",
                    narrative=f"Client exceeded maximum threshold of 3 STK requests per minute. Total hit count: {request_count}"
                )
                return Response(
                    content="RATE_LIMIT_EXCEEDED_IP_BANNED",
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS
                )

        return await call_next(request)

    async def log_and_ban_vector(self, ip_address: str, phone_number: str, violation: str, narrative: str):
    
        if ip_address and ip_address != "UNKNOWN_IP":
            await self.redis_client.set(f"blacklist:ip:{ip_address}", "banned", ex=86400)
            
        if phone_number:
            await self.redis_client.set(f"blacklist:phone:{phone_number}", "banned", ex=86400)
            
      
        await self.redis_client.xadd(
            "STK:security:stream",
            {
                "type": violation,
                "source": ip_address if ip_address else phone_number,
                "details": narrative,
                "kill_type": "IP" if ip_address else "PHONE"
            },
            maxlen=1000
        )

        session_generator = get_session()
        try:
            session: Session = next(session_generator)
            log = SecurityLogTable(
                violation_type=violation,
                offending_vector=ip_address if ip_address else phone_number,
                narrative=narrative,
                mitigation_mode="IP" if ip_address else "PHONE"
            )
            session.add(log)
            session.commit()
            
            
            try:
                next(session_generator)
            except StopIteration:
                pass
        except Exception as db_err:
            raise db_err