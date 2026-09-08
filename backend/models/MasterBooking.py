from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, Optional, List
from datetime import datetime
if TYPE_CHECKING:
    from models.events import TripLogistics
    from models.logbook import LogEntry

class MasterBooking(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    status: str = "PENDING" 
    
    place_name: str
    latitude: float
    longitude: float
    google_maps_url: str
    transport_mode: str 
    vendor_name: str
    vendor_quote: float
    driver_charge: float
    vehicle_sku: str | None = None
    hotel_name: str
    package_details: str
    hotel_cost: float
    guest_count: int
    departure_time: datetime
    sherehe_id: int | None = Field(default=None, foreign_key="sherehe.id")
    matrip_id: int | None = Field(default=None, foreign_key="matrip.id")
    chat_histories: List["ChatHistory"] = Relationship(back_populates="trip")
    trip_logistics: List["TripLogistics"] = Relationship(back_populates="master_booking")
    logs: List["LogEntry"] = Relationship(back_populates="master_booking")

class ChatHistory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    trip_id: int = Field(foreign_key="masterbooking.id")
    user_message: str
    brandy_response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    trip: MasterBooking = Relationship(back_populates="chat_histories")