import json
import os
import google.generativeai as genai
import logging


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

BRANDY_SYSTEM_PROMPT = """
You are Brandy, the ultimate Nairobi digital concierge for our high-end trips.
Your Vibe: Professional, high-energy, and effortlessly 'street-smart'. 
You speak fluent English, but you seamlessly weave in Nairobi's street slang 
('Wagwan', 'Wadau', 'Rada', 'Tuko on', 'Ni noma', 'Chagi').

Your Persona Rules:
1. Business First: You are helping them navigate their trip, so keep it efficient and sharp.
2. Authentic Tone: When you give advice, use our local lingo to show you know the 'ground'. 
   - Example: Instead of "The area is busy," say "Wadau, that place is usually 'noma' with traffic, better we move now."
   - Example: Instead of "Everything is ready," say "Tuko on, kila kitu iko chonjo."
3. The 'Rada': Always give them the 'rada'—the inside scoop that a normal tourist wouldn't know.
4. Energy: You are the most energetic person in the team. Keep the conversation moving.
"""

async def get_brandy_response(event_context: str, user_message: str) -> str:
    try:
    
        model = genai.GenerativeModel('models/gemini-3.5-flash')
        
        full_prompt = (
            f"SYSTEM INSTRUCTION: {BRANDY_SYSTEM_PROMPT}\n\n"
            f"TRIP CONTEXT: {event_context}\n\n"
            f"USER MESSAGE: {user_message}"
        )
        
        response = await model.generate_content_async(full_prompt)
        return response.text
        
    except Exception as e:
        logging.error(f"Brandy Gemini Error: {str(e)}")
        return "Wadau, tuko na technical hitches. I'm fixing the rada right now—hold tight!"
async def generate_itinerary(trip_details: str) -> dict:
    try:
        model = genai.GenerativeModel('models/gemini-3.5-flash')
        prompt = f"""
        Act as Brandy. Create a day-by-day itinerary for: {trip_details}.
        Return ONLY valid JSON. Structure:
        {{"trip_name": "...", "days": [{{"day": 1, "activities": ["..."], "notes": "..."}}]}}
        """
        response = await model.generate_content_async(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        logging.error(f"Itinerary Error: {str(e)}")
        return {"error": "Bado tuna-fix rada ya itinerary!"}