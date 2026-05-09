from sqlmodel import SQLModel, Field
from typing import List
import datetime
from sqlalchemy import Column, ARRAY, TEXT

class Matrip(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = Field(default=None)
    start_date: datetime.date
    end_date: datetime.date
    location: str
    activities: List[str] | None = Field(default=None, sa_column=Column(ARRAY(TEXT)))
    price: float | None = Field(default=None)
    capacity: int | None = Field(default=None)
    public_rating: float | None = Field(default=None)
    image_url: str | None = Field(default=None)
    sku: str
    

    