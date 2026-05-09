from sqlmodel import SQLModel, Field
from typing import List
import datetime 
from sqlalchemy import Column, ARRAY, TEXT

class Sherehe(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None = Field(default=None)
    date: datetime.datetime 
    location: str
    activities: List[str] | None = Field(default=None, sa_column=Column(ARRAY(TEXT)))
    price: float | None = Field(default=None)
    public_rating: float | None = Field(default=None)
    sku: str | None = Field(default=None)
    image_url: str | None = Field(default=None)