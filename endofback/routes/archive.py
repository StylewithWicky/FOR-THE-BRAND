from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from auth.database import get_session
from auth.deps import get_current_user
from models.archive import FinanceArchive, TripArchive, VenueArchive
from typing import List

from models.events import Sherehe
from models.msee import Mzee

router = APIRouter()
def create_finance_entry(session: Session, amount: float, desc: str, ref: str, mpesa: str | None) -> None:
    record = FinanceArchive(
        category="LOGISTICS",
        transaction_type="EXPENSE",
        amount=amount,
        description=desc,
        reference_id=ref,
        payment_method="M-PESA",
        mpesa_code=mpesa or "N/A"
    )
    session.add(record)


@router.get("/logistics", response_model=List[TripArchive])
async def get_trip_history(
    session: Session = Depends(get_session), 
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    return session.exec(select(TripArchive).order_by(TripArchive.date.desc())).all()


@router.post("/archive/logistics")
async def save_trip(
    trip_in: TripArchive, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    try:
        session.add(trip_in)
        session.flush() 
        
        create_finance_entry(
            session=session,
            amount=trip_in.charge_amount,
            desc=f"Transport via {trip_in.vehicle_details or 'Logistics'} to {trip_in.destination}",
            ref=f"TRIP_MANUAL_{trip_in.id}",
            mpesa=trip_in.payment_reference
        )
        
        session.commit()
        return {"status": "success", "archived_id": trip_in.id}
        
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database write failure: {str(e)}")


@router.get("/venues", response_model=List[VenueArchive])
async def get_venue_history(
    session: Session = Depends(get_session), 
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    return session.exec(select(VenueArchive).order_by(VenueArchive.date.desc())).all()


@router.post("/close-trip/{event_id}")
async def close_out_trip(
    event_id: int, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    event = session.get(Sherehe, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        
    if not event.trip_details:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No logistics details found for this event")
    
    try:
        trip_logistics = event.trip_details[0] 
        payment_ref = getattr(trip_logistics, "mpesa_ref", None) or "N/A"
        driver_phone_num = getattr(trip_logistics, "contact_phone", None) or getattr(trip_logistics, "driver_phone", "N/A")

        archived_trip = TripArchive(
            date=event.date,
            driver_name=trip_logistics.driver_name,
            driver_phone=driver_phone_num, 
            vehicle_details=trip_logistics.vehicle_sku if hasattr(trip_logistics, "vehicle_sku") else getattr(trip_logistics, "vehicle_plate", "N/A"),
            origin="Nairobi",
            destination=event.location,
            purpose=event.name,  
            charge_amount=trip_logistics.driver_charge,
            payment_reference=payment_ref
        )
        session.add(archived_trip)
        create_finance_entry(
            session=session,
            amount=trip_logistics.driver_charge,
            desc=f"Trip to {event.location} for {event.name}",
            ref=f"TRIP_{event_id}",
            mpesa=payment_ref
        )
        
        session.delete(trip_logistics)
        session.commit()
        
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to archive trip execution loop: {str(e)}")
    
    return {"status": "Archived successfully"}