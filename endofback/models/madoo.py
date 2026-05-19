from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Invoice(SQLModel, table=True):
    __tablename__: str = "invoice"

    id: Optional[str] = Field(default=None, primary_key=True, index=True)
    invoice_number: str = Field(unique=True, index=True)
    amount: float
    status: str = Field(default="PENDING", index=True)  
    owner_email: str = Field(description="Recipient email used to automatically send the receipt")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    transactions: List["MadooInteraction"] = Relationship(back_populates="invoice")


class MadooInteraction(SQLModel, table=True):
    __tablename__: str = "madoo-interactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    phone_number: str
    amount: float
    merchant_request_id: Optional[str] = Field(default=None, index=True)
    checkout_request_id: Optional[str] = Field(default=None, index=True)
    status: str = Field(default="PENDING", index=True) 
    mpesa_receipt: Optional[str] = Field(default=None, index=True)
    result_code: Optional[int] = Field(default=None)
    result_desc: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    invoice_id: Optional[str] = Field(default=None, foreign_key="invoice.id", index=True, nullable=True)
    invoice_number: Optional[str] = Field(default=None, nullable=True)
    
    invoice: Optional[Invoice] = Relationship(back_populates="transactions")
    
    
class SecurityLogTable(SQLModel, table=True):
    __tablename__: str = "security_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    violation_type: str = Field(index=True)      
    offending_vector: str = Field(index=True)    
    narrative: str                                
    mitigation_mode: str                          
    created_at: datetime = Field(default_factory=datetime.utcnow)