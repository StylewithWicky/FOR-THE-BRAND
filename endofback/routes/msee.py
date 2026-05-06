from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from datetime import timedelta
from models.msee import Mzee
from auth.security import hash_password, verify_password, create_access_token
from auth.database import get_session
from schema.msee import MzeeCreate, MzeeSchema, MzeeUpdate


from pydantic import BaseModel
class Token(BaseModel):
    access_token: str
    token_type: str

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=MzeeOut)
def register_mzee(user_in: MzeeCreate, session: Session = Depends(get_session)):
    if session.exec(select(Mzee).where(Mzee.email == user_in.email)).first():
        raise HTTPException(status_code=400, detail="Mzee already exists")
    
    new_mzee = Mzee(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hash_password(user_in.password), 
        is_admin=False
    )
    
    session.add(new_mzee)
    session.commit()
    session.refresh(new_mzee)
    return new_mzee


@router.post("/login",response_model=Token)
def login_for_access_token(form.data:OAuth2PasswordRequestForm= Depends(),session :Session =Depends(get_session)):
    statement=select(Mzee).where(Mzee.username ==form_data.username)
    Mzee=session.exec(statement.first())
    
    if not Mzee or not verify_password(form_data.password, Mzee.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
