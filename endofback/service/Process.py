from sqlmodel import Session
from models.MasterBooking import MasterBooking
from models.events import Sherehe
from models.trips import Matrip
from models.madoo import FinanceRecord

def process_master_booking(session: Session, master: MasterBooking):
    
    new_event = Sherehe(
        name=master.title,
        description=master.description,
        location=master.place_name,
        date=master.departure_time.date(),
        lat=master.latitude,
        lon=master.longitude
    )
    session.add(new_event)
    session.flush()
    new_trip = Matrip(
        event_id=new_event.id,
        transport_mode=master.transport_mode,
        driver_name=master.vendor_name,
        total_cost=master.vendor_quote + master.driver_charge,
        status="PENDING_DEPLOYMENT"
    )
    session.add(new_trip)
    total_expense = master.vendor_quote + master.hotel_cost
    
    new_finance = FinanceRecord(
        event_id=new_event.id,
        category="LOGISTICS_AND_HOSPITALITY",
        amount=total_expense,
        description=f"Initial budget for {master.title}",
        transaction_type="EXPENSE"
    )
    session.add(new_finance)
    session.commit()
    return {"status": "success", "event_id": new_event.id}