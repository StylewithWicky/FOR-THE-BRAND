from pydantic import BaseModel, ConfigDict

class CollaboraterBase(BaseModel):
    name: str
    email: str
    phone: str
    is_admin: bool 
    is_active: bool 
    model_config = ConfigDict(from_attributes=True)
    
class CollaboraterCreate(CollaboraterBase):
    pass

class CollaboraterSchema(CollaboraterBase):
    id: int
    
class CollaboraterUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    is_admin: bool | None = None 
    is_active: bool | None = None
    model_config = ConfigDict(from_attributes=True)