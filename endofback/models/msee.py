from sqlmodel import SQLModel, Field

class Mzee(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    age: int | None = Field(default=None)
    hashed_password: str
    email: str = Field(index=True, unique=True)
    phone: str
    sku: str | None = Field(default=None, nullable=True)
    is_admin: bool = Field(default=False)
    is_active: bool = Field(default=True)
    