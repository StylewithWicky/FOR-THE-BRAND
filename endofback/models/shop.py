from sqlmodel import SQLModel, Field

class Merch(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = Field(default=None)
    price: float
    discount_price: float | None = Field(default=None)
    available_stock: int | None = Field(default=None)
    category: str
    image_url: str | None = Field(default=None)
    sku: str