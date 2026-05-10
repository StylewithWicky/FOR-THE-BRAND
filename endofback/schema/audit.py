from pydantic import BaseModel
from datetime import datetime

class AuditLogCreate(BaseModel):
    action: str
    module: str
    details: str

class AuditLogRead(BaseModel):
    id: int
    admin_email: str
    action: str
    module: str
    details: str
    timestamp: datetime
    session_id: str