from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from models.trips import Matrip
from schema.trips import MatripCreate, MatripSchema, MatripUpdate
from auth.database import get_session
from auth.deps import get_current_user
from models.msee import Mzee

router = APIRouter(prefix="/trips", tags=["Matrips (Trips & Bookings)"])



@router.get("/", response_model=List[MatripSchema])
def list_trips(
    location: Optional[str] = None,
    offset: int = 0, 
    limit: int = 20, 
    session: Session = Depends(get_session)
):
   
    statement = select(Matrip)
    if location:
        statement = statement.where(Matrip.location.contains(location))
    
    return session.exec(statement.offset(offset).limit(limit)).all()

@router.get("/{trip_id}", response_model=MatripSchema)
def get_trip_details(trip_id: int, session: Session = Depends(get_session)):
    trip = session.get(Matrip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip



@router.post("/", response_model=MatripSchema, status_code=status.HTTP_201_CREATED)
def create_new_trip(
    trip_in: MatripCreate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
   
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Admin access required for fleet management"
        )
    
    new_trip = Matrip.model_validate(trip_in)
    session.add(new_trip)
    session.commit()
    session.refresh(new_trip)
    return new_trip

@router.patch("/{trip_id}", response_model=MatripSchema)
def update_trip(
    trip_id: int, 
    trip_in: MatripUpdate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db_trip = session.get(Matrip, trip_id)
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    update_data = trip_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_trip, key, value)
        
    session.add(db_trip)
    session.commit()
    session.refresh(db_trip)
    return db_trip