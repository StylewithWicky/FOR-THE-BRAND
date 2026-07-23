from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from models.trips import Matrip
from models.Kubook import Kubook
from models.events import Sherehe
from auth.database import get_session
from auth.deps import get_current_user
from models.msee import Mzee

router = APIRouter()

@router.post("/kubook", response_model=Kubook, status_code=status.HTTP_201_CREATED)
def book_trip(
    trip_id: int,
    sherehe_id: int | None = None,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    trip = session.get(Matrip, trip_id)
    if not trip or not trip.is_active:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    new_booking = Kubook(
        mzee_id=current_user.id,
        trip_id=trip.id,
        event_id=sherehe_id,
        status="PENDING"
    )
    
    session.add(new_booking)
    session.commit()
    session.refresh(new_booking)
    
    return new_booking

@router.get("/my-bookings", response_model=list[Kubook])
def get_my_bookings(
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    statement = select(Kubook).where(Kubook.mzee_id == current_user.id)
    bookings = session.exec(statement).all()
    return bookings

@router.get("/kubook/{booking_id}", response_model=Kubook)
def get_booking_details(
    booking_id: int,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    booking = session.get(Kubook, booking_id)
    if not booking or booking.mzee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return booking

@router.get("/kubook/{booking_id}/sherehe", response_model=Sherehe)
def get_booking_event(
    booking_id: int,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    booking = session.get(Kubook, booking_id)
    if not booking or booking.mzee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if not booking.sherehe_id:
        raise HTTPException(status_code=404, detail="No associated event for this booking")
    
    event = session.get(Sherehe, booking.sherehe_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return event

@router.get("/kubook/{booking_id}/trip", response_model=Matrip)
def get_booking_trip(
    booking_id: int,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    booking = session.get(Kubook, booking_id)
    if not booking or booking.mzee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    trip = session.get(Matrip, booking.trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    return trip
@router.get("/kubook/{booking_id}/status", response_model=str)
def get_booking_status( 
    booking_id: int,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    booking = session.get(Kubook, booking_id)
    if not booking or booking.mzee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return booking.status

@router.delete("/kubook/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking( 
    booking_id: int,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    booking = session.get(Kubook, booking_id)
    if not booking or booking.mzee_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    session.delete(booking)
    session.commit()
