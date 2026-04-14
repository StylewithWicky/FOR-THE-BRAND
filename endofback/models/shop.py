from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import date 

class Merch(SQLModel, table=True):
    id:Optional[int]= Field(default=None, primary_key=True)
    name:str
    description:Optional[str]
    price:float
    discount_price:Optional[float]
    available_stock:Optional[int]
    image_url:Optional[str] = Field(default=None)
    
    