from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class InvoiceSchema(SQLModel):
    id: int
    invoice_number: int
    amount: float
    status: str
class Invoice(SQLModel, table=True):
    __tablename__ = "invoice"
    id: Optional[int] = Field(default=None, primary_key=True)
    invoice_number: int = Field(unique=True, index=True)
    amount: float
    owner_email: str
    status: str = Field(default="PENDING", index=True)
    event_id: Optional[int] = Field(default=None, foreign_key="sherehe.id") 
    interactions: List["MadooInteraction"] = Relationship(back_populates="invoice")

class MadooInteraction(SQLModel, table=True):
    __tablename__ = "madoo_interactions"
    id: Optional[int] = Field(default=None, primary_key=True)
    invoice_id: Optional[int] = Field(default=None, foreign_key="invoice.id")
    phone_number: str
    amount: float
    checkout_request_id: str = Field(index=True)
    status: str = Field(default="PENDING", index=True)
    mpesa_receipt: Optional[str] = None
    invoice: Optional[Invoice] = Relationship(back_populates="interactions")

class SecurityLogTable(SQLModel, table=True):
    __tablename__ = "security_log"
    id: Optional[int] = Field(default=None, primary_key=True)
    violation_type: str
    narrative: str

class FinanceRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: int
    category: str  
    transaction_type: str 
    amount: float
    invoice_id: Optional[int] = Field(default=None, foreign_key="invoice.id")