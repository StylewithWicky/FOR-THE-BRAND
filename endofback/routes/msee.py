from datetime import datetime, timedelta, timezone
import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlmodel import Session, select
from jose import JWTError, jwt
from dotenv import load_dotenv, find_dotenv
from pydantic import BaseModel, EmailStr
from typing import List, Set
from models.trips import Matrip

from auth.deps import get_current_user
from models.msee import Mzee
from auth.security import hash_password, verify_password, create_access_token
from auth.database import get_session
from schema.msee import MzeeBase

load_dotenv(find_dotenv())

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/msee/login")

# --- Helper Utilities ---
def get_admin_emails() -> Set[str]:
    """Helper to parse admin emails cleanly from system environment settings."""
    try:
        raw_emails = json.loads(os.getenv("ADMIN_EMAIL", "[]"))
        return {str(email).strip().lower() for email in raw_emails}
    except Exception:
        return set()

# --- Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    is_admin: bool
    email: str 

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: str



@router.post("/signup", status_code=status.HTTP_201_CREATED)
def register_mzee(user_in: SignupRequest, session: Session = Depends(get_session)):
    email_clean = user_in.email.strip().lower()
    
    db_user = session.exec(select(Mzee).where(Mzee.email == email_clean)).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Mzee coordinates already registered."
        )

    new_user = Mzee(
        name=user_in.full_name,
        email=email_clean,
        phone=user_in.phone_number,
        hashed_password=hash_password(user_in.password),
        age=0,
        sku="",
        is_admin=False
    )
    
    # Check if this signing-up email is a designated bootstrap admin
    if email_clean in get_admin_emails():
        new_user.is_admin = True

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "Mzee registered successfully"}


@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    username_clean = form_data.username.strip().lower()
    user_record = session.exec(select(Mzee).where(Mzee.email == username_clean)).first() 

    if not user_record or not verify_password(form_data.password, user_record.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    admin_emails = get_admin_emails()
    is_admin_in_db = getattr(user_record, "is_admin", False)
    is_admin_in_env = username_clean in admin_emails
    
    is_admin = is_admin_in_db or is_admin_in_env
    if is_admin_in_env and not is_admin_in_db:
        user_record.is_admin = True
        session.add(user_record)
        session.commit()
        session.refresh(user_record)

    user_role = "admin" if is_admin else "user"
    access_token_expires = timedelta(minutes=30)
    
    access_token = create_access_token(
        data={"sub": user_record.email, "role": user_role}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user_role,
        "is_admin": is_admin,
        "email": user_record.email
    }


@router.get("/verify-token")
def verify_token_endpoint(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    SECRET_KEY = os.getenv("JWT_SECRET_KEY") or os.getenv("SECRET_KEY") or "MISSING_SIGNING_KEY"
    ALGORITHM = "HS256"
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token mapping payload."
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session signature invalid or expired."
        )
        
    email_clean = email.strip().lower()
    user_record = session.exec(select(Mzee).where(Mzee.email == email_clean)).first()
    
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Identity context missing from records."
        )
        
    is_admin = getattr(user_record, "is_admin", False) or email_clean in get_admin_emails()

    return {
        "valid": True,
        "email": user_record.email,
        "is_admin": is_admin
    }

@router.get("/dashboard-stats")
def get_dashboard_stats(session: Session = Depends(get_session), current_user: Mzee = Depends(get_current_user)):

    trips = session.exec(select(Matrip).where(Matrip.mzee_id == current_user.id)).all()
    
    current_points = current_user.points
    
    if len(trips) > 1:
        sorted_trips = sorted(trips, key=lambda x: x.created_at)
        points_before_last_trip = current_points - sorted_trips[-1].points_awarded
        growth_raw = ((current_points - points_before_last_trip) / points_before_last_trip) * 100
    else:
        growth_raw = 0.0

    return {
        "points": current_points,
        "growth_percent": f"+{round(growth_raw, 1)}%", 
        "tier": current_user.tier,
        "metrics": {
            "trips": len(trips),
            "posts": len(current_user.posts) if hasattr(current_user, 'posts') else 0,
            "blogs": len(current_user.blogs) if hasattr(current_user, 'blogs') else 0
        }
    }