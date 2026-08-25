from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import datetime

class MatripBase(BaseModel):
    name: str
    description: str
    start_date: datetime.date
    end_date: datetime.date
    location: str
    package_type: str
    activities: Optional[List[str]] = []
    price: float
    capacity: int
    sku: str
    is_active: bool
    model_config = ConfigDict(from_attributes=True)
    
class MatripCreate(MatripBase):
    activities: List[str] = []
    price: float = 0.0
    capacity: int = 1
    sku: str = "PENDING-PUBLIC"
    is_active: bool = True
    model_config = ConfigDict(from_attributes=True)

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
    sku: str | None = None
    is_active: bool | None = None
    package_type: str | None = None
    model_config = ConfigDict(from_attributes=True)