from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from datetime import timedelta, datetime
import os
from dotenv import load_dotenv, find_dotenv

from models.msee import Mzee
from auth.security import hash_password, verify_password, create_access_token
from auth.database import get_session
from schema.msee import MzeeCreate
from pydantic import BaseModel

# 1. Initialize logic
load_dotenv(find_dotenv())
router = APIRouter()

# 2. Get Admin Emails from .env
# Using .get() with a default empty string avoids crashes if the key is missing
ADMIN_EMAILS = os.getenv("ADMIN_EMAIL", "").split(",") 

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    email: str 

@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register_mzee(user_in: MzeeCreate, session: Session = Depends(get_session)):
    db_user = session.exec(select(Mzee).where(Mzee.email == user_in.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Mzee already exists")

    new_user = Mzee(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hash_password(user_in.password),
        age=user_in.age,
        sku=user_in.sku
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "Mzee registered successfully"}


@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    # 1. Look for the user
    statement = select(Mzee).where(Mzee.email == form_data.username)
    user_record = session.exec(statement).first() 
    
    # 2. Check credentials
    if not user_record or not verify_password(form_data.password, user_record.hashed_password):
        print(f"SECURITY_ALERT: Failed login attempt for {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
   
    is_admin = user_record.email in ADMIN_EMAILS
    user_role = "admin" if is_admin else "user"

    # LOGGING THE ENTRY (Believe !!)
    print(f"--- TERMINAL_ENTRY_LOG ---")
    print(f"IDENT: {user_record.email}")
    print(f"TIME:  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"ROLE:  {user_role}")
    print(f"--------------------------")

    # 4. Create the security token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user_record.email, "role": user_role}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user_role,
        "email": user_record.email
    }