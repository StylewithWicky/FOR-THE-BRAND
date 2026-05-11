from __future__ import annotations
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager # 1. Import this
import time
import logging
from sqlmodel import SQLModel 
from auth.database import engine 
from models.archive import FinanceArchive, TripArchive, VenueArchive
from models.msee import Mzee
from models.events import Sherehe
from models.shop import Merch
from models.trips import Matrip
from models.collaboraters import Mamorio
from models.audit import AuditLog
from models.logbook import LogEntry
from routes import msee, events, shops, trips, collaborater, audit ,logbook , archive

# Setup lifespan to create tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    yield
    logging.info("Shutting down...")

for model in [Mzee, Sherehe, Merch, Matrip, Mamorio, AuditLog, LogEntry, FinanceArchive, TripArchive, VenueArchive]:
    model.model_rebuild()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("API_SECURITY")

app = FastAPI(
    title="FOR-THE-BRAND API",
    description="Secure backend for luxury car hire, events, and merch management.",
    version="1.0.0",
    lifespan=lifespan # 4. Link the lifespan here
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    
    # Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    process_time = time.time() - start_time
    logger.info(f"Path: {request.url.path} | Duration: {process_time:.4f}s")
    return response

# Routes
app.include_router(msee.router, prefix="/api/v1/msee", tags=["Mkubwa"])
app.include_router(events.router, prefix="/api/v1/sherehe", tags=["Masherehe(Events)"])
app.include_router(shops.router, prefix="/api/v1/merch", tags=["Merch(Shop)"])
app.include_router(trips.router, prefix="/api/v1/trips", tags=["Matrip"])
app.include_router(collaborater.router, prefix="/api/v1/mamorio", tags=["Mamorio(Collaborations)"])
app.include_router(audit.router, prefix="/api/v1/trace", tags=["Security_Audit"])
app.include_router(logbook.router, prefix="/api/v1/logbook", tags=["Logbook"])
app.include_router(archive.router, prefix="/api/v1/archive", tags=["Archive"])

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error caught: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred.", "type": type(exc).__name__},
    )

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "timestamp": time.ctime(),
        "project": "FOR-THE-BRAND"
    }