from sqlmodel import SQLModel, Field

class Mamorio(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = Field(default=None)
    email: str
    phone: str
    location: str
    sku: str
    profile_picture_url: str | None = Field(default=None)