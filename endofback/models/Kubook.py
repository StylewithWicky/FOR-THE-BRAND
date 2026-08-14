from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, Optional, List
from datetime import datetime
if TYPE_CHECKING:
    from models.events import TripLogistics
    from models.logbook import LogEntry
    from models.events import Sherehe
    from models.trips import Matrip
    
class Kubook(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    mzee_id: int = Field(foreign_key="mzee.id")
    trip_id: int = Field(foreign_key="matrip.id")
    trip:Optional["Matrip"] = Relationship(back_populates="kubooks" , lazy="selectin")
    sherehe_id: int | None = Field(default=None, foreign_key="sherehe.id")
    sherehe: Optional['Sherehe'] = Relationship(back_populates="kubooks" , lazy="selectin")
    status: str = Field(default="PENDING")
    created_at: datetime = Field(default_factory=datetime.utcnow)