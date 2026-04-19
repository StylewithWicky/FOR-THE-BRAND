from typing import Union , Any
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from dotenv import load_dotenv,find_dotenv
import os

pwd=CryptContext(schemes=["bcrypt"], deprecated="auto")
load_dotenv(find_dotenv())

def hash_password(password: str) -> str:
    return pwd.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=int(os.getenv("Access_token_expire_minutes")))
    to_encode.update({"exp": expire})
    secret_key = os.getenv("Secret_key")
    algorithm = os.getenv("Algorithm")
    return jwt.encode(to_encode, secret_key, algorithm=algorithm)