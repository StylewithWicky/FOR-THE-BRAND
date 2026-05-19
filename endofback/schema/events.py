from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import date
import datetime

class MashereheBase(BaseModel):
    name: str
    description: str
    date: datetime.date | None = None
    location: str
    activities: List[str]
    price: float
    public_rating: float
    image_url: str 
    model_config = ConfigDict(from_attributes=True)
    
class MashereheCreate(MashereheBase):
    pass

class MashereheSchema(MashereheBase):
    
    id: int
    
class MashereheUpdate(MashereheBase):
    name: str | None = None
    description: str | None = None
    date: datetime.date | None = None
    location:str | None = None
    activities: str | None = None
    price: float | None = None
    public_rating: float | None = None
    image_url: str | None = None
    model_config = ConfigDict(from_attributes=True)
    
class PublicEventResponse(BaseModel):
    id: int
    title: str
    venue_place: str
    event_date: datetime
    hotel_name: str | None = None
    package_details: str | None = None

class AdminTripDetails(BaseModel):
    transport_means: str
    driver_name: str | None = None
    assignment_date: datetime.datetime | None = None
    driver_charge: float
    vehicle_sku: str | None = None

class AdminEventResponse(BaseModel):
    id: int
    title: str
    venue_place: str
    event_date: datetime
    hotel_name: str | None = None
    contact_person: str | None = None
    contact_phone: str | None = None
    package_details: str | None = None
    hotel_cost: float
    is_archived: bool
    created_at: datetime
    trip_details: AdminTripDetails = None