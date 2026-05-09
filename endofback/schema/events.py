from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import date
import datetime

class MashereheBase(BaseModel):
    name: str
    description: str
    date: datetime.date | None = None
    location: str
    activities: List[str]
    price: float
    public_rating: float
    image_url: str 
    model_config = ConfigDict(from_attributes=True)
    
class MashereheCreate(MashereheBase):
    pass

class MashereheSchema(MashereheBase):
    
    id: int
    
class MashereheUpdate(MashereheBase):
    name: str | None = None
    description: str | None = None
    date: datetime.date | None = None
    location:str | None = None
    activities: str | None = None
    price: float | None = None
    public_rating: float | None = None
    image_url: str | None = None
    model_config = ConfigDict(from_attributes=True)