from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from auth.database import get_session
from auth.security import get_current_user
from models.archive import FinanceArchive, TripArchive, VenueArchive
from typing import List

router = APIRouter(prefix="/archive", tags=["Archive"])

@router.get("/logistics", response_model=List[TripArchive])
async def get_trip_history(session: Session = Depends(get_session), user: str = Depends(get_current_user)):
    return session.exec(select(TripArchive).order_by(TripArchive.date.desc())).all()

@router.post("/archive/logistics")
async def save_trip(trip: TripArchive, session: Session = Depends(get_session)):
   
    session.add(trip)
    session.commit()
    session.refresh(trip)
    
    # 2. Automatically trigger a Finance Archive entry
    finance_record = FinanceArchive(
        category="LOGISTICS",
        transaction_type="EXPENSE",
        amount=trip.total_cost,
        description=f"Transport: {trip.cargo_type} to {trip.route_destination}",
        reference_id=f"TRIP_{trip.id}",
        payment_method="M-PESA",
        mpesa_code=trip.mpesa_ref
    )
    session.add(finance_record)
    session.commit()
    
    return {"status": "success", "archived_id": trip.id}

@router.get("/venues", response_model=List[VenueArchive])
async def get_venue_history(session: Session = Depends(get_session), user: str = Depends(get_current_user)):
    return session.exec(select(VenueArchive).order_by(VenueArchive.date.desc())).all()