from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import date
from enum import Enum

class Matrip(SQLModel,table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name:str
    description:Optional[str]
    start_date:date
    end_date:date
    location:str
    activities: Optional[List[str]] = Field(default=None, sa_column_kwargs={"type_": "ARRAY(TEXT)"})
    price:Optional[float]
    capacity:Optional[int]
    public_rating:Optional[float]
    image_url:Optional[str] = Field(default=None)
    

    