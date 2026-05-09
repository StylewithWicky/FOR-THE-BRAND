from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from datetime import timedelta
from models.msee import Mzee
from auth.security import hash_password, verify_password, create_access_token
from auth.database import get_session
from schema.msee import MzeeCreate, MzeeSchema
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

router = APIRouter()

@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register_mzee(user_in: MzeeCreate, session: Session = Depends(get_session)):
   
    db_user = session.exec(select(Mzee).where(Mzee.email == user_in.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Mzee already exists")

    # 2. This now uses the NEW bcrypt logic, not passlib!
    new_user = Mzee(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hash_password(user_in.password), # Calls new bcrypt logic
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
    # Search by email since OAuth2PasswordRequestForm.username stores the email/identifier
    statement = select(Mzee).where(Mzee.email == form_data.username)
    user_record = session.exec(statement).first() # Renamed variable to avoid class collision
    
    if not user_record or not verify_password(form_data.password, user_record.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user_record.email}, # Use email as the subject
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

