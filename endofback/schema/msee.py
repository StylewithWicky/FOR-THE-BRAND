from pydantic import BaseModel, ConfigDict, f
from typing import Optional 

class MzeeBase(BaseModel):
    name:str
    age:int
    hashed_password:str
    email:str
    phone:str
    is_admin:bool 
    is_active:bool 
    model_config = ConfigDict(from_attributes=True)
    
class MerchCreate(MzeeBase):
    pass

class MerchSchema(MzeeBase):
    
    id: int
    
class MerchUpdate(MzeeBase):
    name:Optional[str]
    age:Optional[int]
    hashed_password:Optional[str]
    email:Optional[str]
    phone:Optional[str]
    is_admin:Optional[bool] 
    is_active:Optional[bool]
    model_config = ConfigDict(from_attributes=True)