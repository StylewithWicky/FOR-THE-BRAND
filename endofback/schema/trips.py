from pydantic import BaseModel, ConfigDict
from typing import List
import datetime

class MatripBase(BaseModel):
    name: str
    description: str
    start_date: datetime.date
    end_date: datetime.date
    location: str
    activities: str 
    price: float
    capacity: int
    public_rating: float
    image_url: str 
    sku: str
    model_config = ConfigDict(from_attributes=True)
    
class MatripCreate(MatripBase):
    pass

class MatripSchema(MatripBase):
    id: int
    
class MatripUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    start_date: datetime.date | None = None
    end_date: datetime.date | None = None
    location: str | None = None
    activities: List[str] | None = None 
    price: float | None = None
    capacity: int | None = None
    public_rating: float | None = None
    image_url: str | None = None 
    sku: str | None = None
    model_config = ConfigDict(from_attributes=True)