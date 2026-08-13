

from sqlmodel import Relationship, SQLModel, Field
from typing import TYPE_CHECKING, List, Optional
import datetime 
from sqlalchemy import Column, ARRAY, TEXT
if TYPE_CHECKING:
    from models.MasterBooking import MasterBooking
    from models.Kubook import Kubook
    from images import Image
    
    
class ShereheCategory(str):
    Calm: str = "calm"
    Mid: str = "mid"
    Adrenaline: str = "adrenaline"
    

class Sherehe(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = Field(default=None)
    date: datetime.datetime 
    location: str
    activities: List[str] | None = Field(default=None, sa_column=Column(ARRAY(TEXT)))
    price: float | None = Field(default=None)
    public_rating: float | None = Field(default=None)
    sku: str | None = Field(default=None)
    image_url: str | None = Field(default=None)
    hotel_name: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    package_details: Optional[str] = None
    hotel_cost: Optional[float] = None
    is_archived: bool = Field(default=False)
    kubooks: List["Kubook"] = Relationship(back_populates="sherehe")
    images: List["Image"] = Relationship(back_populates="sherehe", lazy="selectin")
    
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    logistics: List["TripLogistics"] = Relationship(back_populates="sherehe")
    
class TripLogistics(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    event_id: int | None = Field(default=None, foreign_key="sherehe.id")
    transport_means: str
    driver_name: str | None = None
    assignment_date: datetime.datetime | None = None
    driver_charge: float = Field(default=0.0)
    vehicle_sku: str | None = None
    sherehe: Optional["Sherehe"] = Relationship(back_populates="logistics")
    booking_id: int | None = Field(default=None, foreign_key="masterbooking.id")
    master_booking: Optional["MasterBooking"] = Relationship(back_populates="trip_logistics")
    current_status: str = Field(default="PENDING", index=True)