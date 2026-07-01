from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from models.msee import Mzee
from auth.database import get_session 
import os

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/msee/login") 

SECRET_KEY = os.getenv("KEYOFSECRETS")
ALGORITHM = os.getenv("RANDOMNUMBER", "HS256")

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_session) 
) -> Mzee:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        
        if not user_email:
            raise credentials_exception
            
    except JWTError:
       raise credentials_exception

    user = db.exec(select(Mzee).where(Mzee.email == user_email)).first()
    
    if user is None:
        raise credentials_exception
        
    return user

def get_current_admin(
    current_user:Mzee = Depends(get_current_user)) -> Mzee:
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ACCESS_DENIED: Admin privileges required."
        )
    return current_user

@router.get("/verify-token")
def verify_token(current_user: Mzee = Depends(get_current_user)):
  
    return {
        "status": "authenticated", 
         "email": current_user.email,
        "is_admin": current_user.is_admin
            
            }