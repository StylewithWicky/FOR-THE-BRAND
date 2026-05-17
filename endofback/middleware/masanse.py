import redis.asyncio as redis
from fastapi import Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware
from sqlmodel import Session
from auth.database import get_session
from models.madoo import SecurityLogTable
from config import settings
import time

class AutomatedFirewallMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.redis_client = redis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)

    async def dispatch(self, request: Request, call_next):
        client_ip = str(request.client.host) if request.client else "UNKNOWN_IP"
        path = str(request.url.path)
        
        is_blocked = await self.redis_client.sismember("blacklist:ips", client_ip)
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

        try:
            response = await call_next(request)
            return response
        except Exception as e:
            raise e

    async def log_and_ban_vector(self, ip_address: str, phone_number: str, violation: str, narrative: str):
        if ip_address and ip_address != "UNKNOWN_IP":
            await self.redis_client.sadd("blacklist:ips", ip_address)
            await self.redis_client.expire(f"blacklist:ips:{ip_address}", 86400)
            
        if phone_number:
            await self.redis_client.sadd("blacklist:phones", phone_number)
            
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
        session: Session = next(session_generator)
        try:
            log = SecurityLogTable(
                violation_type=violation,
                offending_vector=ip_address if ip_address else phone_number,
                narrative=narrative,
                mitigation_mode="IP" if ip_address else "PHONE"
            )
            session.add(log)
            session.commit()
        finally:
            session.close()