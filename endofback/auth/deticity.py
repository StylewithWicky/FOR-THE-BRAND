from passlib.context import CryptContext
from passlib.hash import bcrypt
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv, find_dotenv
import os


crpt=CryptContext(schemes=["bcrypt"], deprecated="auto")
load_dotenv(find_dotenv())

SECRET_KEY=os.getenv("KEYOFSECRETS")
ALGORITHM=os.getenv("RANDOMNUMBER")
ACCESS_TOKEN_EXPIRE_MINUTES=30

def confirm_password(plain_password, hashed_password):
    return crpt.verify(plain_password, hashed_password)

def hash_password(password):
    return crpt.hash(password)



