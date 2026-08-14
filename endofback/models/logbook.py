from sqlmodel import Relationship, SQLModel, Field
from datetime import datetime
from typing import Optional,TYPE_CHECKING
from models.MasterBooking import MasterBooking
import uuid
if TYPE_CHECKING:
    from models.MasterBooking import MasterBooking
 

class LogEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    master_booking_id: int = Field(foreign_key="masterbooking.id") 
    title: str = Field(index=True)
    description: str
    entry_type: str 
    location: Optional[str] = None
    accent_color: str = Field(default="#1A73E8") 
    start_time: datetime = Field(index=True)
    end_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str 
    master_booking: "MasterBooking" = Relationship(back_populates="logs", lazy='selectin')