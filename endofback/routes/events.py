from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List 
from models.events import Sherehe, TripLogistics
from schema.events import MashereheCreate, MashereheSchema, MashereheUpdate, PublicMashereheSchema
from auth.database import get_session
from auth.deps import get_current_user 
from models.msee import Mzee

router = APIRouter()

@router.get("/", response_model=List[PublicMashereheSchema])
def read_events(
    offset: int = 0, 
    limit: int = 20, 
    session: Session = Depends(get_session)
):
    return session.exec(select(Sherehe).where(Sherehe.is_archived == False).offset(offset).limit(limit)).all()

@router.get("/mkubwa/zote", response_model=List[MashereheSchema])
def read_all_events_admin(
    offset: int = 0,
    limit: int = 20,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return session.exec(select(Sherehe).offset(offset).limit(limit)).all()

@router.get("/{event_id}", response_model=PublicMashereheSchema)
def read_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Sherehe, event_id)
    if not event or event.is_archived:
        raise HTTPException(status_code=404, detail="Sherehe not found")
    return event

@router.post("/", response_model=MashereheSchema, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: MashereheCreate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user) 
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    new_event = Sherehe(
        title=event_in.title,
        venue_place=event_in.venue_place,
        event_date=event_in.event_date,
        hotel_name=event_in.hotel_name,
        contact_person=event_in.contact_person,
        contact_phone=event_in.contact_phone,
        package_details=event_in.package_details,
        hotel_cost=event_in.hotel_cost
    )
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    
    new_trip = TripLogistics(
        event_id=new_event.id,
        transport_means=event_in.transport_means,
        driver_name=event_in.driver_name,
        assignment_date=event_in.assignment_date if event_in.assignment_date else event_in.event_date,
        driver_charge=event_in.driver_charge,
        vehicle_sku=event_in.vehicle_sku
    )
    session.add(new_trip)
    session.commit()
    session.refresh(new_event)
    
    return new_event

@router.patch("/{event_id}", response_model=MashereheSchema)
def update_event(
    event_id: int, 
    event_in: MashereheUpdate, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to edit events")
        
    db_event = session.get(Sherehe, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event_data = event_in.model_dump(exclude_unset=True)
    
    trip_fields = {"transport_means", "driver_name", "assignment_date", "driver_charge", "vehicle_sku"}
    event_updates = {k: v for k, v in event_data.items() if k not in trip_fields}
    trip_updates = {k: v for k, v in event_data.items() if k in trip_fields}
    
    for key, value in event_updates.items():
        setattr(db_event, key, value)
        
    if trip_updates:
        if db_event.trip_details:
            for key, value in trip_updates.items():
                setattr(db_event.trip_details, key, value)
            session.add(db_event.trip_details)
        else:
            new_trip = TripLogistics(event_id=db_event.id, **trip_updates)
            session.add(new_trip)
            
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event

@router.delete("/{event_id}")
def delete_event(
    event_id: int, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
         raise HTTPException(status_code=403, detail="Only admins can delete")

    event = session.get(Sherehe, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if event.trip_details:
        session.delete(event.trip_details)
        
    session.delete(event)
    session.commit()
    return {"ok": True}