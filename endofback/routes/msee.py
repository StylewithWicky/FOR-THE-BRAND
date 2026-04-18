from fastapi import APIRouter, Depends,HTTPException,status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session ,select
from datetime import timedelta
from models.msee import Mzee
from databases.deps import get_session
from auth.security import hashed_password,verify_password
from ..database import get_session
from ..models.token import Token
from ..auth.security import verify_password, hash_password
from ..auth.tokens import create_access_token


router=APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data:Mzee , session:Session=Depends(get_session)):
    statement=select(Mzee).where(Mzee.email==user_data.email)
    existing_data=session.exec(statement.first())
    if existing_data:
        raise HTTPException (status_code=400 , detail="User already exists")
    user_data.hashed_password=(hashed_password(user_data.hashed_password))
    
    session.add(user_data)
    session.commit()
    session.refresh(user_data)
    return{"message":"User registered successfully"}


@router.post("/login",response_model=Token)
def login_for_access_token(form.data:OAuth2PasswordRequestForm= Depends(),
                           session :Session =Depends(get_session)):
    statement=select(Mzee).where(Mzee.username ==form_data.username)
    Mzee=session.exec(statement.first())
    
    if not Mzee or not verify_password(form_data.password, Mzee.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate":"Bearer"}
        )
    
