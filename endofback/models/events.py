from sqlmodel import SQLModel , Field
from typing import Optional,List
from datetime import datetime 
from sqlalchemy import Column, ARRAY, TEXT

class Sherehe(SQLModel , table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = Field(default=None)
    date: datetime
    location: str
    activities: Optional[List[str]] = Field(default=None, sa_column=Column(ARRAY(TEXT)), default=None)
    price: Optional[float]
    public_rating: Optional[float] = Field(default=None)
    sku:Optional[str] = Field(default=None)
    image_url: Optional[str] = Field(default=None)
 