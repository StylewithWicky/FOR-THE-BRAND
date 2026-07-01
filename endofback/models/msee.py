from sqlmodel import SQLModel, Field,Relationship
from typing import List,TYPE_CHECKING, Optional
import datetime 
if TYPE_CHECKING:
    from models.trips import Matrip
    from models.content import Post, Blog
    
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
    points: int = Field(default=0)
    tier: str = Field(default="Calm")
    matrips: list["Matrip"] = Relationship(back_populates="mzee")
    posts: List["Post"] = Relationship(back_populates="mzee")
    blogs: List["Blog"] = Relationship(back_populates="mzee")