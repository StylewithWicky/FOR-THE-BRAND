from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, and_
from datetime import datetime, timedelta
from typing import List, Optional
from auth.database import get_session
from auth.deps import get_current_user
from models.logbook import LogEntry
from schema.logbook import LogEntryCreate, LogEntryRead

router = APIRouter()

@router.post("/add", response_model=LogEntryRead, status_code=status.HTTP_201_CREATED)
async def create_log_entry(
    entry_in: LogEntryCreate,
    session: Session = Depends(get_session),
    admin_email: str = Depends(get_current_user)
):
    new_entry = LogEntry(
        **entry_in.model_dump(),
        created_by=admin_email
    )
    session.add(new_entry)
    session.commit()
    session.refresh(new_entry)
    return new_entry

@router.get("/entries", response_model=List[LogEntryRead])
async def get_log_entries(
    date: Optional[str] = None, # Format: YYYY-MM-DD
    session: Session = Depends(get_session),
    current_admin: str = Depends(get_current_user)
):
    statement = select(LogEntry)
    
    if date:
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
            start_of_day = datetime.combine(target_date, datetime.min.time())
            end_of_day = start_of_day + timedelta(days=1)
            
            statement = statement.where(
                and_(
                    LogEntry.start_time >= start_of_day,
                    LogEntry.start_time < end_of_day
                )
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    results = session.exec(statement.order_by(LogEntry.start_time.asc())).all()
    return results

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_log_entry(
    entry_id: int,
    session: Session = Depends(get_session),
    admin_email: str = Depends(get_current_user)
):
    entry = session.get(LogEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    session.delete(entry)
    session.commit()
    return None