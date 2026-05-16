from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class MpesaTransaction(SQLModel, table=True):
    __tablename__: str = "mpesatransaction"

    id: Optional[int] = Field(default=None, primary_key=True)
    invoice_id: str = Field(index=True, description="Links back to your order or rental invoice")
    phone_number: str = Field(description="Format: 2547XXXXXXXX or 2541XXXXXXXX")
    amount: float
    merchant_request_id: Optional[str] = Field(default=None, index=True)
    checkout_request_id: Optional[str] = Field(default=None, index=True)
    status: str = Field(default="PENDING", index=True)
    mpesa_receipt: Optional[str] = Field(default=None, index=True)
    result_code: Optional[int] = Field(default=None)
    result_desc: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)