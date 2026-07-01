from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from auth.database import get_session
from models.madoo import FinanceRecord

router = APIRouter()
def get_margins(session: Session, event_id: int):
    records = session.exec(select(FinanceRecord).where(FinanceRecord.event_id == event_id)).all()
    
    revenue = sum(r.amount for r in records if r.transaction_type == "REVENUE")
    expenses = sum(r.amount for r in records if r.transaction_type == "EXPENSE")
    net_profit = revenue - expenses
    margin = (net_profit / revenue * 100) if revenue > 0 else 0
    
    return {
        "revenue": revenue,
        "expenses": expenses,
        "net_profit": net_profit,
        "margin_percentage": round(margin, 2)
    }

@router.get("/report/{event_id}")
async def get_event_dashboard(event_id: int, session: Session = Depends(get_session)):
    """Returns the live P&L for a specific event."""
    data = get_margins(session, event_id)
    return {"event_id": event_id, **data}

@router.get("/summary")
async def get_global_health(session: Session = Depends(get_session)):
    revenue = session.exec(select(func.sum(FinanceRecord.amount)).where(FinanceRecord.transaction_type == "REVENUE")).one() or 0
    expenses = session.exec(select(func.sum(FinanceRecord.amount)).where(FinanceRecord.transaction_type == "EXPENSE")).one() or 0
    
    return {
        "total_revenue": revenue,
        "total_expenses": expenses,
        "net_profit": revenue - expenses
    }