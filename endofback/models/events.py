from sqlmodel import Relationship, SQLModel, Field
from typing import List, Optional
import datetime 
from sqlalchemy import Column, ARRAY, TEXT

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
    
class TripLogistics(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    event_id: int | None = Field(default=None, foreign_key="sherehe.id")
    transport_means: str
    driver_name: str | None = None
    assignment_date: datetime.datetime | None = None
    driver_charge: float = Field(default=0.0)
    vehicle_sku: str | None = None
    
    event: "Sherehe" = Relationship(back_populates="trip_details")