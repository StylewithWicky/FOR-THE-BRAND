from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class SystemConfig(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(unique=True, index=True)
    value: str
    description: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SecurityAudit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    action: str 
    user_email: str = Field(index=True)
    ip_address: Optional[str] = None
    status: str = Field(index=True)  
    payload: Optional[str] = None    