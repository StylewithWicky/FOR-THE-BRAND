from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class MashereheBase(BaseModel):
    name: str
    location: str
    date: datetime
    hotel_name: str | None = None
    contact_person: str | None = None
    contact_phone: str | None = None
    package_details: str | None = None
    hotel_cost: float | None = 0.0

class MashereheCreate(MashereheBase):
    transport_means: str
    driver_name: str | None = None
    assignment_date: datetime | None = None
    driver_charge: float = 0.0
    vehicle_sku: str | None = None

class AdminTripDetails(BaseModel):
    id: int
    event_id: int
    transport_means: str
    driver_name: str | None = None
    assignment_date: datetime | None = None
    driver_charge: float
    vehicle_sku: str | None = None
    model_config = ConfigDict(from_attributes=True)

class MashereheSchema(MashereheBase):
    id: int
    is_archived: bool
    created_at: datetime
    trip_details: List[AdminTripDetails] = []
    model_config = ConfigDict(from_attributes=True)

class MashereheUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    date: datetime | None = None
    hotel_name: str | None = None
    contact_person: str | None = None
    contact_phone: str | None = None
    package_details: str | None = None
    hotel_cost: float | None = None
    transport_means: str | None = None
    driver_name: str | None = None
    assignment_date: datetime | None = None
    driver_charge: float | None = None
    vehicle_sku: str | None = None
    model_config = ConfigDict(from_attributes=True)

class PublicMashereheSchema(BaseModel):
    id: int
    name: str
    location: str
    date: datetime
    hotel_name: str | None = None
    package_details: str | None = None
    model_config = ConfigDict(from_attributes=True)