from pydantic import BaseModel, ConfigDict, f
from typing import Optional ,List
from datetime import date

class MashereheBase(BaseModel):
    name: str
    description: str
    date: Optional[date]
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
    name: Optional[str]
    description: Optional[str]
    date: Optional[date]
    location:Optional[str]
    activities: Optional[List[str]]
    price: Optional[float]
    public_rating: Optional[float]
    image_url: Optional[str] 
    model_config = ConfigDict(from_attributes=True)