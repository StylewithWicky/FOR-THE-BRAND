from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional 

class MzeeBase(BaseModel):
    name:str
    age:int
    email:EmailStr
    phone:str
    is_admin:bool 
    is_active:bool 
    model_config = ConfigDict(from_attributes=True)
    
class MzeeCreate(MzeeBase):
    password:str

class MzeeSchema(MzeeBase):
    
    id: int
    
class MzeeUpdate(MzeeBase):
    name:Optional[str]
    age:Optional[int]
    hashed_password:Optional[str]
    email:Optional[str]
    phone:Optional[str]
    is_admin:Optional[bool] 
    is_active:Optional[bool]
    model_config = ConfigDict(from_attributes=True)