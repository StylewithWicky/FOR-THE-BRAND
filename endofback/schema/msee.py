from pydantic import BaseModel, ConfigDict, EmailStr

class MzeeBase(BaseModel):
    name: str
    age: int
    email: EmailStr
    phone: str
    sku: str | None = None
    is_admin: bool =False 
    is_active: bool = True
    model_config = ConfigDict(from_attributes=True)
    
class MzeeCreate(MzeeBase):
    password: str

class MzeeSchema(MzeeBase):
    id: int
    
class MzeeUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    hashed_password: str | None = None
    email: str | None = None
    phone: str | None = None
    sku: str | None = None
    is_admin: bool | None = None 
    is_active: bool | None = None
    model_config = ConfigDict(from_attributes=True)