from pydantic import BaseModel, ConfigDict, f
from typing import Optional 

class MerchBase(BaseModel):
    name:str
    description:Optional[str]
    price:float
    discount_price:Optional[float]
    available_stock:Optional[int]
    image_url:Optional[str]
    category:str
    model_config = ConfigDict(from_attributes=True)
    
class MerchCreate(MerchBase):
    pass

class MerchSchema(MerchBase):
    
    id: int
    
class MerchUpdate(MerchBase):
    name:Optional[str]
    description:Optional[str]
    price:Optional[float]
    discount_price:Optional[float]
    available_stock:Optional[int]
    image_url:Optional[str]
    category:Optional[str]
    model_config = ConfigDict(from_attributes=True)
    