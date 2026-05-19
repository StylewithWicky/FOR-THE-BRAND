from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime, date

class MashereheBase(BaseModel):
    title: str
    venue_place: str
    event_date: datetime
    hotel_name: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    package_details: Optional[str] = None
    hotel_cost: float = 0.0

class MashereheCreate(MashereheBase):
    transport_means: str
    driver_name: Optional[str] = None
    assignment_date: Optional[datetime] = None
    driver_charge: float = 0.0
    vehicle_sku: Optional[str] = None

class AdminTripDetails(BaseModel):
    transport_means: str
    driver_name: Optional[str] = None
    assignment_date: Optional[datetime] = None
    driver_charge: float
    vehicle_sku: Optional[str] = None

class MashereheSchema(MashereheBase):
    id: int
    is_archived: bool
    created_at: datetime
    trip_details: Optional[AdminTripDetails] = None
    model_config = ConfigDict(from_attributes=True)

class MashereheUpdate(BaseModel):
    title: Optional[str] = None
    venue_place: Optional[str] = None
    event_date: Optional[datetime] = None
    hotel_name: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    package_details: Optional[str] = None
    hotel_cost: Optional[float] = None
    transport_means: Optional[str] = None
    driver_name: Optional[str] = None
    assignment_date: Optional[datetime] = None
    driver_charge: Optional[float] = None
    vehicle_sku: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class PublicMashereheSchema(BaseModel):
    id: int
    title: str
    venue_place: str
    event_date: datetime
    hotel_name: Optional[str] = None
    package_details: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)