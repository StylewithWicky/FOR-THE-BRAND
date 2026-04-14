from sqlmodel import SQLModel , Field
from typing import Optional,List
from datetime import datetime 

class Sherehe(SQLModel , table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str]
    date: datetime
    location: str
    activities: Optional[List[str]] = Field(default=None, sa_column_kwargs={"type_": "ARRAY(TEXT)"})
    price: Optional[float]
    public_rating: Optional[float]
    image_url: Optional[str] = Field(default=None)
