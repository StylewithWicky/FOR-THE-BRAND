from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class TripArchive(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime = Field(default_factory=datetime.utcnow)
    driver_name: str
    driver_phone: str
    vehicle_details: str
    origin: str
    destination: str
    purpose: str
    charge_amount: float
    fuel_cost_included: bool = True
    payment_reference: str 
    notes: Optional[str] = None

class VenueArchive(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime
    venue_name: str
    location: str
    event_type: str
    total_charge: float
    deposit_paid: float
    contact_person: str
    contact_number: str
    amenities: str 
    feedback: Optional[str] = None
    
class FinanceArchive(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    category: str  
    transaction_type: str  
    amount: float
    description: str
    reference_id: str  
    payment_method: str 
    mpesa_code: Optional[str] = Field(unique=True)