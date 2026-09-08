from __future__ import annotations
import os
import time
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from auth.deps import get_current_admin


env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)


if not os.getenv("KEYOFSECRETS"):
    logging.warning("⚠️ SECRET_KEY not detected in the environment. Setting a runtime development fallback.")
    os.environ["KEYOFSECRETS"] 
if not os.getenv("ALGORITHM"):
    os.environ["ALGORITHM"] = "HS256"
    
from fastapi import Depends, FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel, Session, text 
from auth.database import engine, get_session 
from models.archive import FinanceArchive, TripArchive, VenueArchive
from models.msee import Mzee
from models.events import Sherehe, TripLogistics
from models.shop import Merch
from models.trips import Matrip
from models.collaboraters import Mamorio
from models.audit import AuditLog
from models.logbook import LogEntry
from models.system import SystemConfig, SecurityAudit
from models.madoo import Invoice, MadooInteraction
from models.MasterBooking import MasterBooking, ChatHistory
from models.content import Post, Blog as BlogModel
from models.Kubook import Kubook as KubookModel

from routes import (
    msee, events, shops, trips, collaborater, 
    audit, logbook, archive, system, madoo, 
    security, masanse_comands, Brandy ,Blog as BlogRouter,Kubook 
)
from middleware.masanse import AutomatedFirewallMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("API_SECURITY")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    yield
    logger.info("Shutting down...")

for model in [
    Mzee, Sherehe, Merch, Matrip, Mamorio, AuditLog, LogEntry, 
    FinanceArchive, TripArchive, VenueArchive, SystemConfig, 
    SecurityAudit, Invoice, MadooInteraction, MasterBooking, ChatHistory, TripLogistics,
    Post, BlogModel ,KubookModel
]:
    model.model_rebuild()

app = FastAPI(
    title="FOR-THE-BRAND API",
    description="Secure backend for logistics, events, and merch management.",
    version="1.0.0",
    lifespan=lifespan 
)


app.add_middleware(AutomatedFirewallMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    process_time = time.time() - start_time
    logger.info(f"Path: {request.url.path} | Duration: {process_time:.4f}s")
    return response


app.include_router(msee.router, prefix="/api/v1/msee", tags=["Mkubwa"])
app.include_router(events.router, prefix="/api/v1/sherehe", tags=["Masherehe(Events)"])
app.include_router(shops.router, prefix="/api/v1/merch", tags=["Merch(Shop)"])
app.include_router(trips.router, prefix="/api/v1/trips", tags=["Matrip"])
app.include_router(collaborater.router, prefix="/api/v1/mamorio", tags=["Mamorio(Collaborations)"])
app.include_router(audit.router, prefix="/api/v1/trace", tags=["Security_Audit"])
app.include_router(logbook.router, prefix="/api/v1/logbook", tags=["Logbook"],dependencies=[Depends(get_current_admin)])
app.include_router(archive.router, prefix="/api/v1/archive", tags=["Archive"],dependencies=[Depends(get_current_admin)])
app.include_router(system.router, prefix="/api/v1/system", tags=["System & Security"],dependencies=[Depends(get_current_admin)])
app.include_router(madoo.router, prefix="/api/v1/madoo", tags=["M-Pesa Automation Layer"],dependencies=[Depends(get_current_admin)])
app.include_router(security.router, prefix="/api/v1/security", tags=["Security"])
app.include_router(masanse_comands.router, prefix="/api/v1/masanse", tags=["Masanse Commands"],dependencies=[Depends(get_current_admin)])
app.include_router(Brandy.router, prefix="/api/v1/Brandy", tags=["Brandy AI"])
app.include_router(events.router, prefix="/api/v1/logistics", tags=["Logistics"],dependencies=[Depends(get_current_admin)])
app.include_router(BlogRouter.router, prefix="/api/v1/blog", tags=["Blog"])
app.include_router(Kubook.router, prefix="/api/v1/bookings", tags=["Bookings"])
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error caught: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred.", "type": type(exc).__name__},
    )

@app.get("/health", tags=["Health"])
async def health_check(session: Session = Depends(get_session)):
    try:
        session.exec(text("SELECT 1"))
        db_status = "online"
    except Exception:
        db_status = "offline"
        
    return {
        "status": "online",
        "database": db_status,
        "brandy_ai": "online",
        "timestamp": time.ctime()
    }