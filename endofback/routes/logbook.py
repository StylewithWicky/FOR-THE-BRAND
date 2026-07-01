from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session, select
from typing import List
from auth.database import get_session
from auth.deps import get_current_user
from models.logbook import LogEntry
from schema.logbook import LogEntryCreate, LogEntryRead
from models.msee import Mzee  
import datetime
from datetime import date, time, datetime 

router = APIRouter()


@router.post("/add", response_model=LogEntryRead, status_code=status.HTTP_201_CREATED)
async def create_log(
    entry_in: LogEntryCreate, 
    session: Session = Depends(get_session), 
    current_admin: Mzee = Depends(get_current_user)
):
    if not current_admin.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Only admins can write log updates"
        )
        
   
    log_data = entry_in.model_dump()
    new_entry = LogEntry(**log_data, created_by=current_admin.email.lower())
    
    session.add(new_entry)
    session.commit()
    session.refresh(new_entry)
    return new_entry
@router.get("/entries", response_model=List[LogEntryRead])
async def get_logs_by_date(
    date: date | None = None, 
    session: Session = Depends(get_session),
    current_user: Mzee = Depends(get_current_user)
):

    statement = select(LogEntry)
    
    if date:
        start_date= datetime.combine(date, time.min)
        end_date = datetime.combine(date, time.max)
        
        statement = statement.where(LogEntry.start_time >= start_date)
        statement = statement.where(LogEntry.start_time <= end_date)

    statement = statement.order_by(LogEntry.start_time.desc())
    return session.exec(statement).all()

@router.get("/{trip_id}/entries", response_model=List[LogEntryRead])
async def get_logs_by_trip(
    trip_id: int, 
    session: Session = Depends(get_session)
):
    
    statement = select(LogEntry).where(LogEntry.trip_id == trip_id).order_by(LogEntry.start_time.asc())
    return session.exec(statement).all()


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_log(
    entry_id: int, 
    session: Session = Depends(get_session), 
    current_admin: Mzee = Depends(get_current_user)
):
    if not current_admin.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Forbidden: Not authorized to modify log history"
        )
        
    entry = session.get(LogEntry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Log entry haijapatikana"
        )
        
    session.delete(entry)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)