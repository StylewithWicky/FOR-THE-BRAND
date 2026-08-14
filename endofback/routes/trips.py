from fastapi import APIRouter, Depends, HTTPException,Query,status, Response
from sqlmodel import Session, select
from typing import List
from models.MasterBooking import MasterBooking
from models.trips import Matrip, TripCategory
from schema.trips import MatripCreate, MatripSchema, MatripUpdate
from auth.database import get_session
from auth.deps import get_current_user
from models.msee import Mzee

router = APIRouter()


@router.post('/public-create', response_model=MatripSchema, status_code=status.HTTP_201_CREATED)
def create_public_trip(
    trip_in: MatripCreate,  
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)  
):
    try:
        new_trip = Matrip.model_validate(trip_in)
        new_trip.is_active = True 
        if new_trip.package_type:
            new_trip.package_type = new_trip.package_type.strip().lower()
            
        session.add(new_trip)
        session.commit()
        session.refresh(new_trip)
        return new_trip
        
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Could not process itinerary metrics into request tracker."
        )


@router.get("/active", response_model=List[MatripSchema])
def get_trips(
    type: TripCategory | None = Query(default=None, description="Filter trips by category type"),
    session: Session = Depends(get_session)
):
    statement = select(Matrip).where(Matrip.is_active == True, Matrip.is_public == True)
    
    if type:
        statement = statement.where(Matrip.category == type)
        
    trips = session.exec(statement).all()
    return trips


@router.get("/", response_model=List[MatripSchema])
def list_trips(
    type: str | None = None,
    location: str | None = None, 
    offset: int = 0, 
    limit: int = 20, 
    session: Session = Depends(get_session)
):
    statement = select(Matrip).where(Matrip.is_public == True)
    
    if type: 
        statement = statement.where(Matrip.package_type == type.strip().lower())
    if location:
        statement = statement.where(Matrip.location.contains(location))
        
    return session.exec(statement.offset(offset).limit(limit)).all()


@router.get("/{trip_id}", response_model=MatripSchema)
def get_trip_details(trip_id: int, session: Session = Depends(get_session)):
    trip = session.get(Matrip, trip_id)
    if not trip or not getattr(trip, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Trip not found"
        )
    return trip


@router.post("/create", response_model=MatripSchema, status_code=status.HTTP_201_CREATED)
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
    if new_trip.package_type:
        new_trip.package_type = new_trip.package_type.strip().lower()
        
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
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Unauthorized action"
        )
        
    db_trip = session.get(Matrip, trip_id)
    if not db_trip or not getattr(db_trip, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Trip not found"
        )
    
    update_data = trip_in.model_dump(exclude_unset=True)
    
    if "package_type" in update_data and update_data["package_type"]:
        update_data["package_type"] = update_data["package_type"].strip().lower()

    for key, value in update_data.items():
        setattr(db_trip, key, value)
        
    session.add(db_trip)
    session.commit()
    session.refresh(db_trip)
    return db_trip


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: int, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Only admins can remove trips"
        )
        
    trip = session.get(Matrip, trip_id)
    if not trip or not getattr(trip, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Trip not found"
        )
    trip.is_active = False
    session.add(trip)
    session.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)