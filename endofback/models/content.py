from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from models.msee import Mzee

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    mzee_id: int = Field(foreign_key="mzee.id")
    mzee: "Mzee" = Relationship(back_populates="posts")

class Blog(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    slug: str = Field(index=True, unique=True)
    excerpt: str
    content: str
    category: str
    status: str = Field(default="draft") 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    mzee_id: int = Field(foreign_key="mzee.id")
    mzee: "Mzee" = Relationship(back_populates="blogs")