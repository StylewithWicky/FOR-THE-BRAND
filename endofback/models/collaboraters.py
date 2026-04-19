from sqlmodel import SQLModel, Field
from typing import Optional,List
from datetime import date 

class Mamorio(SQLModel, table=True):
    id:Optional[int] = Field(default=None, primary_key=True)
    name:str
    description:Optional[str]
    email:str
    phone:str
    location:str
    sku:str
    profile_picture_url:Optional[str] = Field(default=None)
    