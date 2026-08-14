from sqlmodel import SQLModel, Field,Relationship
from typing import List,TYPE_CHECKING
import datetime
from sqlalchemy import Column, ARRAY, TEXT
if TYPE_CHECKING:
    from models.msee import Mzee
    from models.Kubook import Kubook
    from images import Image

class TripCategory(str):
    mainland = "mainland"
    local = "localpackages"
    international = "international"
    
class Matrip(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = Field(default=None)
    start_date: datetime.date
    end_date: datetime.date
    package_type:str 
    location: str
    activities: List[str] | None = Field(default=None, sa_column=Column(ARRAY(TEXT)))
    price: float | None = Field(default=None)
    capacity: int | None = Field(default=None)
    sku: str
    is_active: bool = Field(default=True)
    is_public: bool = Field(default=True)   
    
    points_awarded: int | None = Field(default=None)
    mzee_id: int | None = Field(default=None, foreign_key="mzee.id")
    mzee: "Mzee" = Relationship(back_populates="matrips")
    kubooks: List["Kubook"] = Relationship(back_populates="trip")
    images: List["Image"] = Relationship(back_populates="matrip", lazy="selectin")
    

    