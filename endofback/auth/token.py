from datetime import datetime, timedelta, UTC
from jose import jwt
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

SECRET_KEY = os.getenv("MASTEROFSECRETS")
ALGORITHM = os.getenv("RANDOMNUMBER")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Using | None instead of Optional
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
