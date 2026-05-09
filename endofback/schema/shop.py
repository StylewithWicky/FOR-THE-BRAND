from pydantic import BaseModel, ConfigDict

class MerchBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    discount_price: float | None = None
    available_stock: int | None = None
    image_url: str | None = None
    category: str
    model_config = ConfigDict(from_attributes=True)
    
class MerchCreate(MerchBase):
    pass

class MerchSchema(MerchBase):
    id: int
    
class MerchUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    discount_price: float | None = None
    available_stock: int | None = None
    image_url: str | None = None
    category: str | None = None
    model_config = ConfigDict(from_attributes=True)