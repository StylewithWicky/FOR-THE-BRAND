from sqlmodel import SQLModel, Field
from typing import Optional , List
from datetime import date

class Mzee(SQLModel, table=True):
    id:Optional[int] =Field(default=None , primary_key=True)
    name:str
    age:Optional[int]
    hashed_password:str
    email:str
    phone:str
    is_admin:bool = Field(default=False)
    is_active:bool = Field(default=True)
    