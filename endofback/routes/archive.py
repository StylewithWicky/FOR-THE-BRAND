from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from auth.database import get_session
from auth.security import get_current_user
from models.archive import TripArchive, VenueArchive
from typing import List

router = APIRouter(prefix="/archive", tags=["Archive"])

@router.get("/logistics", response_model=List[TripArchive])
async def get_trip_history(session: Session = Depends(get_session), user: str = Depends(get_current_user)):
    return session.exec(select(TripArchive).order_by(TripArchive.date.desc())).all()

@router.post("/logistics/add")
async def archive_trip(trip: TripArchive, session: Session = Depends(get_session), user: str = Depends(get_current_user)):
    session.add(trip)
    session.commit()
    return {"status": "Archived Successfully"}

@router.get("/venues", response_model=List[VenueArchive])
async def get_venue_history(session: Session = Depends(get_session), user: str = Depends(get_current_user)):
    return session.exec(select(VenueArchive).order_by(VenueArchive.date.desc())).all()