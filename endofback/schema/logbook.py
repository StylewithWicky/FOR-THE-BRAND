from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LogEntryCreate(BaseModel):
    title: str
    description: str
    entry_type: str
    location: Optional[str] = None
    accent_color: Optional[str] = "#1A73E8"
    start_time: datetime
    end_time: Optional[datetime] = None

class LogEntryRead(BaseModel):
    id: int
    title: str
    description: str
    entry_type: str
    location: Optional[str]
    accent_color: str
    start_time: datetime
    end_time: Optional[datetime]
    created_by: str