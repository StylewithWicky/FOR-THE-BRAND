import shutil

from fastapi import APIRouter, Depends, HTTPException, status, Body, Form, UploadFile, File
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from models.events import Sherehe, TripLogistics
from schema import events
from schema.events import MashereheCreate, MashereheSchema, MashereheUpdate, PublicMashereheSchema
from auth.database import get_session
from auth.deps import get_current_user
from models.msee import Mzee
from models.MasterBooking import MasterBooking
from dotenv import load_dotenv, find_dotenv
from datetime import datetime
import os

load_dotenv(find_dotenv())
router = APIRouter()
upload_dir = "uploads"
os.makedirs(upload_dir, exist_ok=True)

SECRET_KEY = os.getenv("SECRET_KEY")

# ==========================================
# 1. STATIC PATHS (Evaluated FIRST)
# ==========================================

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
    
    return session.exec(
        select(Sherehe)
        .options(selectinload(Sherehe.logistics))
        .offset(offset)
        .limit(limit)
    ).all()


@router.get("/active")
def read_active_logistics(
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    active_trips = session.exec(
        select(TripLogistics).where(TripLogistics.current_status != "COMPLETED")
    ).all()
    return active_trips


@router.post("/create", response_model=MashereheSchema, status_code=status.HTTP_201_CREATED)
def create_event(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    date: datetime = Form(...),
    location: str = Form(...),
    price: Optional[float] = Form(None),
    public_rating: Optional[float] = Form(None),
    sku: Optional[str] = Form(None),
    hotel_name: Optional[str] = Form(None),
    contact_person: Optional[str] = Form(None),
    contact_phone: Optional[str] = Form(None),
    package_details: Optional[str] = Form(None),
    hotel_cost: Optional[float] = Form(None),
    images: List[UploadFile] = File(default=[]),
    
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    if image and len(images) > 5:
        raise HTTPException(status_code=400, detail="You can upload a maximum of 5 images.")
    if image and len(images) < 3:
        raise HTTPException(status_code=400, detail="You have to upload at least 3 images.")
             
    
    
    new_event = Sherehe(
        name=name,
        description=description,
        date=date,
        location=location,
        price=price,
        public_rating=public_rating,
        sku=sku,
        image_urls=image_path, 
        hotel_name=hotel_name,
        contact_person=contact_person,
        contact_phone=contact_phone,
        package_details=package_details,
        hotel_cost=hotel_cost
    )
    image_path = []
    for image in images:
              
        if image.filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                modified_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                safe_filename = f"{timestamp}_{image.filename}_{modified_at}"
                file_path = os.path.join(upload_dir, safe_filename)
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)
                
                image_path.append(file_path)
                
    session.add(new_event)
    session.flush() 
    session.commit()
    session.refresh(new_event)
    
    return new_event
    


# ==========================================
# 2. DYNAMIC PATHS (Evaluated LAST)
# ==========================================

@router.get("/{event_id}", response_model=PublicMashereheSchema)
def read_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Sherehe, event_id)
    if not event or event.is_archived:
        raise HTTPException(status_code=404, detail="Sherehe not found")
    return event


@router.patch("/{event_id}", response_model=MashereheSchema)
def update_event(
    event_id: int,
    event_in: MashereheUpdate,
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db_event = session.get(Sherehe, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    schema_mapping = {"title": "name", "venue_place": "location", "event_date": "date"}
    trip_field_mapping = {
        "transport_means": "transport_means",
        "driver_name": "driver_name",
        "assignment_date": "assignment_date",
        "driver_charge": "driver_charge",
        "vehicle_sku": "vehicle_plate"
    }
    
    event_data = event_in.model_dump(exclude_unset=True)
    
    for key, value in event_data.items():
        if key in trip_field_mapping:
            db_trip_key = trip_field_mapping[key]
            
            if key == "driver_charge" and value is not None:
                value = float(value) * 1.10

            if db_event.trip_details:
                setattr(db_event.trip_details[0], db_trip_key, value)
            else:
                new_trip = TripLogistics(**{db_trip_key: value, "event_id": db_event.id, "current_status": "PENDING_DISPATCH"})
                session.add(new_trip)
        else:
            db_key = schema_mapping.get(key, key)
            setattr(db_event, db_key, value)
            
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
        
    for trip in event.trip_details:
        session.delete(trip)
        
    session.delete(event)
    session.commit()
    return {"ok": True}


@router.post("/{trip_id}/assign")
async def assign_logistics(
    trip_id: int, 
    vehicle: str = Body(...), 
    driver: str = Body(...), 
    phone: str = Body(...), 
    session: Session = Depends(get_session)
):
    trip = session.get(MasterBooking, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    new_logistics = TripLogistics(trip_id=trip_id, vehicle_plate=vehicle, driver_name=driver, driver_phone=phone)
    session.add(new_logistics)
    session.commit()
    return {"message": "Logistics assigned successfully"}


@router.patch("/{logistics_id}/status")
async def update_logistics_status(
    logistics_id: int, 
    status: str = Body(..., embed=True), 
    session: Session = Depends(get_session)
):
    log = session.get(TripLogistics, logistics_id)
    if not log:
        raise HTTPException(status_code=404, detail="Logistics record not found")
    
    log.current_status = status
    session.commit()
    return {"status": "Updated"}