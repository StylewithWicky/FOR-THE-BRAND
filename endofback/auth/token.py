from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

SECRET_KEY=os.getenv("MASTEROFSECRETS")
ALGORITHM=os.getenv("RANDOMNUMBER")
ACCESS_TOKEN_EXPIRE_MINUTES=30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt 

