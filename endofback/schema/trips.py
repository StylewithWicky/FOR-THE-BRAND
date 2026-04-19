from pydantic import BaseModel, ConfigDict, f
from typing import Optional , List
from datetime import date

class MatripBase(BaseModel):
    name:str
    description:str
    start_date:date
    end_date:date
    location:str
    activities: str 
    price:float
    capacity:int
    public_rating:float
    image_url:str 
    sku:str
    model_config = ConfigDict(from_attributes=True)
    
class MatripCreate(MatripBase):
    pass

class MatripSchema(MatripBase):
    
    id: int
    
class MatripUpdate(MatripBase):
    name:Optional[str]
    description:Optional[str]
    start_date:Optional[date]
    end_date:Optional[date]
    location:Optional[str]
    activities: Optional[List[str]] 
    price:Optional[float]
    capacity:Optional[int]
    public_rating:Optional[float]
    image_url:Optional[str] 
    sku:str
    model_config = ConfigDict(from_attributes=True)
    