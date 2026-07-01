from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from auth.database import get_session
from models.MasterBooking import MasterBooking,ChatHistory
from service.Brandy_Service import generate_itinerary, get_brandy_response
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str



@router.post("/chat/{event_id}")
async def client_brandy_chat(
    event_id: int, 
    request: ChatRequest, 
    session: Session = Depends(get_session)
):
    trip = session.exec(select(MasterBooking).where(MasterBooking.id == event_id)).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found, mkuu!")

    
    context = f"Trip: {trip.title} | Location: {trip.place_name} | Vibe: {trip.description}"
    
   
    try:
        reply = await get_brandy_response(context, request.message)
        
      
        new_chat = ChatHistory(
            trip_id=event_id,
            user_message=request.message,
            brandy_response=reply
        )
        session.add(new_chat)
        session.commit()
        
        return {"brandy_response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Brandy is currently down, tuko on it!")
    
@router.post("/itinerary/{event_id}")
async def get_trip_itinerary(event_id: int, session: Session = Depends(get_session)):
    trip = session.get(MasterBooking, event_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    itinerary = await generate_itinerary(f"{trip.title} at {trip.place_name}. Details: {trip.package_details}")
    return {"itinerary": itinerary}