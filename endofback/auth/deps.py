from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from models.msee import Mzee
from auth.database import get_session 
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/msee/login") 
SECRET_KEY = os.getenv("KEYOFSECRETS")
ALGORITHM = os.getenv("RANDOMNUMBER")

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
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception

    # Query the user
    user = db.exec(select(Mzee).where(Mzee.email == user_id)).first()
    
    if user is None:
        raise credentials_exception
        
    return user