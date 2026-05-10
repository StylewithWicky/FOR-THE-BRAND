from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class LogEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    entry_type: str 
    location: Optional[str] = None
    accent_color: str = Field(default="#1A73E8") 
    start_time: datetime = Field(index=True)
    end_time: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str  