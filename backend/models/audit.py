from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    admin_email: str = Field(index=True)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None 
    action: str  
    module: str  
    details: str 
    timestamp: datetime = Field(default_factory=datetime.now)
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    class Config:
        allow_mutation = False