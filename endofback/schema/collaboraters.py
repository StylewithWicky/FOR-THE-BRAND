from pydantic import BaseModel, ConfigDict
from typing import Optional 

class CollaboraterBase(BaseModel):
    name:str
    email:str
    phone:str
    is_admin:bool 
    is_active:bool 
    model_config = ConfigDict(from_attributes=True)
    
class CollaboraterCreate(CollaboraterBase):
    pass

class CollaboraterSchema(CollaboraterBase):
    
    id: int
    
class CollaboraterUpdate(CollaboraterBase):
    name:Optional[str]
    email:Optional[str]
    phone:Optional[str]
    is_admin:Optional[bool] 
    is_active:Optional[bool]
    model_config = ConfigDict(from_attributes=True)