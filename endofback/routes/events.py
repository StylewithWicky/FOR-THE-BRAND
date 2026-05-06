from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from models.events import Sherehe
from schema.events import MashereheCreate, MashereheSchema, MashereheUpdate
from auth.database import get_session
from auth.deps import get_current_user #
from models.msee import Mzee

router = APIRouter(prefix="/sherehe", tags=["Sherehe (Events)"])


@router.get("/", response_model=List[MashereheSchema])
def read_events(
    offset: int = 0, 
    limit: int = 20, 
    session: Session = Depends(get_session)
):
    
    return session.exec(select(Sherehe).offset(offset).limit(limit)).all()

@router.get("/{event_id}", response_model=MashereheSchema)
def read_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Sherehe, event_id)
    if not event:
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
    
    new_event = Sherehe.model_validate(event_in)
    session.add(new_event)
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
    
   
    update_data = event_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_event, key, value)
        
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event

@router.delete("/{event_id}")
def delete_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Sherehe, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    session.delete(event)
    session.commit()
    return {"ok": True}