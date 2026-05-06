from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging
from routes import msee, events, shops, trips, collaborater 


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("API_SECURITY")

app = FastAPI(
    title="FOR-THE-BRAND API",
    description="Secure backend for luxury car hire, events, and merch management.",
    version="1.0.0"
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
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    process_time = time.time() - start_time
    logger.info(f"Path: {request.url.path} | Duration: {process_time:.4f}s")
    return response

app.include_router(msee.router, prefix="/api/v1/msee", tags=["User Management"])
app.include_router(events.router, prefix="/api/v1/sherehe", tags=["Events"])
app.include_router(shops.router, prefix="/api/v1/merch", tags=["Store"])
app.include_router(trips.router, prefix="/api/v1/trips", tags=["Logistics"])
app.include_router(collaborater.router, prefix="/api/v1/mamorio", tags=["Collaborations"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error caught: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An internal security or server error occurred."},
    )

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "timestamp": time.time(),
        "project": "FOR-THE-BRAND"
    }