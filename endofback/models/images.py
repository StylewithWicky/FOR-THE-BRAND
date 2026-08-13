from sqlmodel import Field, Relationship, SQLModel
from typing import List, TYPE_CHECKING
if TYPE_CHECKING:
    from events import Sherehe
    from trips import Matrip
    
class Image(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    url: str
    event_id: int | None = Field(default=None, foreign_key="sherehe.id")
    trip_id: int | None = Field(default=None, foreign_key="matrip.id")
    sherehe: "Sherehe" = Relationship(back_populates="images", lazy="selectin")
    matrip: "Matrip" = Relationship(back_populates="images", lazy="selectin")
 