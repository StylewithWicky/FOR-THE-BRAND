import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Truck, DollarSign, Plus, ChevronLeft, X, Hotel, Phone, User, Image as ImageIcon } from 'lucide-react';
import axiosClient from '../api/axiosClients';
import { useNavigate } from 'react-router-dom';

export default function BookingsAndEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  
  // Separate Modal States
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Event Form State (Includes category: calm, mid, adrenaline)
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    price: '',
    hotel_name: '',
    hotel_cost: '',
    contact_person: '',
    contact_phone: '',
    package_details: '',
    category: 'mid'
  });

  
  const [tripForm, setTripForm] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    package_type: '',
    activities: '',
    location: '',
    capacity: '',
    price: '',
    category: 'mainland',
    sku: '',
    hotel_name: '',
    contact_person: '',
    contact_phone: '',
    package_details: '',
    hotel_cost: ''
  });

  const [selectedEventFiles, setSelectedEventFiles] = useState<FileList | null>(null);
  const [selectedTripFiles, setSelectedTripFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axiosClient.get('/sherehe/mkubwa/zote');
      setEvents(response.data);
    } catch (err) { 
      console.error("Error fetching events:", err); 
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await axiosClient.get('/trips/active');
      setTrips(response.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  useEffect(() => { 
    fetchEvents();
    fetchTrips();
  }, []);

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTripChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTripForm(prev => ({ ...prev, [name]: value }));
  };

  
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', eventForm.name);
      data.append('description', eventForm.description);
      
      if (eventForm.date) {
        const cleanDate = new Date(eventForm.date).toISOString().split('T')[0] + "T00:00:00";
        data.append('date', cleanDate);
      }

      data.append('location', eventForm.location);
      data.append('price', eventForm.price ? eventForm.price : '0');
      data.append('hotel_name', eventForm.hotel_name);
      data.append('hotel_cost', eventForm.hotel_cost ? eventForm.hotel_cost : '0');
      data.append('contact_person', eventForm.contact_person);
      data.append('contact_phone', eventForm.contact_phone);
      data.append('package_details', eventForm.package_details);
      data.append('category', eventForm.category);

      if (selectedEventFiles) {
        for (let i = 0; i < selectedEventFiles.length; i++) {
          data.append('images', selectedEventFiles[i]);
        }
      }

      await axiosClient.post('/sherehe/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowEventModal(false);
      setEventForm({
        name: '', description: '', date: '', location: '',
        price: '', hotel_name: '', hotel_cost: '', contact_person: '',
        contact_phone: '', package_details: '', category: 'mid'
      });
      setSelectedEventFiles(null);
      fetchEvents();
      alert('Event created successfully!');
    } catch (err: any) {
      console.error("Event creation error:", err?.response?.data);
      alert(err?.response?.data?.detail || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Trip Form with updated backend structure & Images
  const handleTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', tripForm.name);
      if (tripForm.description) data.append('description', tripForm.description);
      
      if (tripForm.start_date) {
        const cleanStartDate = new Date(tripForm.start_date).toISOString().split('T')[0] + "T00:00:00";
        data.append('start_date', cleanStartDate);
      }
      if (tripForm.end_date) {
        const cleanEndDate = new Date(tripForm.end_date).toISOString().split('T')[0] + "T00:00:00";
        data.append('end_date', cleanEndDate);
      }

      data.append('package_type', tripForm.package_type);

      // Convert comma-separated activities string into multiple FormData entries for List[str]
      if (tripForm.activities) {
        const activitiesList = tripForm.activities.split(',').map(act => act.trim()).filter(Boolean);
        activitiesList.forEach(activity => {
          data.append('activities', activity);
        });
      }

      data.append('location', tripForm.location);
      if (tripForm.capacity) data.append('capacity', tripForm.capacity);
      if (tripForm.price) data.append('price', tripForm.price);
      data.append('category', tripForm.category);
      if (tripForm.sku) data.append('sku', tripForm.sku);
      if (tripForm.hotel_name) data.append('hotel_name', tripForm.hotel_name);
      if (tripForm.contact_person) data.append('contact_person', tripForm.contact_person);
      if (tripForm.contact_phone) data.append('contact_phone', tripForm.contact_phone);
      if (tripForm.package_details) data.append('package_details', tripForm.package_details);
      if (tripForm.hotel_cost) data.append('hotel_cost', tripForm.hotel_cost);

      if (selectedTripFiles) {
        for (let i = 0; i < selectedTripFiles.length; i++) {
          data.append('images', selectedTripFiles[i]);
        }
      }

      await axiosClient.post('/trips/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowTripModal(false);
      setTripForm({
        name: '', description: '', start_date: '', end_date: '',
        package_type: '', activities: '', location: '', capacity: '',
        price: '', category: 'mainland', sku: '',
        hotel_name: '', contact_person: '', contact_phone: '', package_details: '', hotel_cost: ''
      });
      setSelectedTripFiles(null);
      fetchTrips();
      alert('Trip created successfully!');
    } catch (err: any) {
      console.error("Trip creation error:", err?.response?.data);
      alert(err?.response?.data?.detail || "Failed to create trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8 md:p-20 relative overflow-x-hidden">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-12">
        <button 
          onClick={() => navigate('/a1/mdosi/kejayamkuu')} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors uppercase text-[10px] font-bold tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Dash
        </button>
      </div>

      {/* Header Actions */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 md:mb-12">
        <div>
          <p className="text-blue-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-1 sm:mb-2">Fleet & Event Management</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bookings & Events</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowEventModal(true)}
            className="bg-slate-900 text-white px-6 py-3.5 sm:py-3 rounded-full text-xs font-bold hover:bg-slate-800 transition-all flex justify-center items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Eka Sherehe
          </button>
          <button 
            onClick={() => setShowTripModal(true)}
            className="bg-blue-600 text-white px-6 py-3.5 sm:py-3 rounded-full text-xs font-bold hover:bg-blue-500 transition-all flex justify-center items-center gap-2 shadow-sm"
          >
            <Truck size={16} /> Eka Trip
          </button>
        </div>
      </div>

      {/* Event Grid Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-lg font-bold mb-4">Active Events</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {events.length === 0 ? (
            <div className="lg:col-span-2 text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium text-sm">
              Hakuna Sherehe mzee. Click 'Eka Sherehe' to add one.
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-md font-bold text-slate-900">{event.name}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold uppercase">{event.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{event.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{event.location} • {new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Trip Grid Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-lg font-bold mb-4">Active Trips</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {trips.length === 0 ? (
            <div className="lg:col-span-2 text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium text-sm">
              Hakuna trips mzee. Click 'Eka Trip' to add one.
            </div>
          ) : (
            trips.map(trip => (
              <div key={trip.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-md font-bold text-slate-900">{trip.name}</h3>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold uppercase">{trip.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{trip.description}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                    {trip.location} • {new Date(trip.start_date).toLocaleDateString()} {trip.end_date ? `to ${new Date(trip.end_date).toLocaleDateString()}` : ''}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Event Modal Drawer */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowEventModal(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">Create Event</h2>
              <button onClick={() => setShowEventModal(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleEventSubmit} id="event-form" className="p-6 flex-1 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Event Name *</label>
                <input type="text" name="name" required value={eventForm.name} onChange={handleEventChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date *</label>
                  <input type="date" name="date" required value={eventForm.date} onChange={handleEventChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Location *</label>
                  <input type="text" name="location" required value={eventForm.location} onChange={handleEventChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category *</label>
                  <select name="category" value={eventForm.category} onChange={handleEventChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs">
                    <option value="calm">Calm</option>
                    <option value="mid">Mid</option>
                    <option value="adrenaline">Adrenaline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hotel Cost (KES)</label>
                  <input type="number" name="hotel_cost" value={eventForm.hotel_cost} onChange={handleEventChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea name="description" rows={2} value={eventForm.description} onChange={handleEventChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Event Images *</label>
                <input type="file" multiple required onChange={(e) => setSelectedEventFiles(e.target.files)} accept="image/*" className="w-full text-xs" />
              </div>
            </form>

            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setShowEventModal(false)} className="flex-1 border py-3 rounded-full text-xs font-bold">Cancel</button>
              <button type="submit" form="event-form" disabled={loading} className="flex-1 bg-slate-900 text-white py-3 rounded-full text-xs font-bold">Save Event</button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Modal Drawer */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTripModal(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">Create New Trip</h2>
              <button onClick={() => setShowTripModal(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleTripSubmit} id="trip-form" className="p-6 flex-1 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Trip Name *</label>
                <input type="text" name="name" required value={tripForm.name} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Start Date *</label>
                  <input type="date" name="start_date" required value={tripForm.start_date} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">End Date</label>
                  <input type="date" name="end_date" value={tripForm.end_date} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Location *</label>
                  <input type="text" name="location" required value={tripForm.location} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category *</label>
                  <select name="category" value={tripForm.category} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs">
                    <option value="mainland">Mainland</option>
                    <option value="international">International</option>
                    <option value="east-africa">East Africa</option>
                    <option value="safari">Safari</option>
                    <option value="coastal">Coastal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Package Type *</label>
                  <input type="text" name="package_type" required value={tripForm.package_type} onChange={handleTripChange} placeholder="e.g. All Inclusive" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">SKU</label>
                  <input type="text" name="sku" value={tripForm.sku} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Activities (comma separated)</label>
                <input type="text" name="activities" value={tripForm.activities} onChange={handleTripChange} placeholder="e.g. Game drive, Boat ride, Hiking" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Price (KES)</label>
                  <input type="number" step="any" name="price" value={tripForm.price} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Capacity</label>
                  <input type="number" name="capacity" value={tripForm.capacity} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hotel Name</label>
                  <input type="text" name="hotel_name" value={tripForm.hotel_name} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hotel Cost (KES)</label>
                  <input type="number" step="any" name="hotel_cost" value={tripForm.hotel_cost} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Contact Person</label>
                  <input type="text" name="contact_person" value={tripForm.contact_person} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Contact Phone</label>
                  <input type="text" name="contact_phone" value={tripForm.contact_phone} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Package Details</label>
                <textarea name="package_details" rows={2} value={tripForm.package_details} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea name="description" rows={3} value={tripForm.description} onChange={handleTripChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Trip Images</label>
                <input type="file" multiple onChange={(e) => setSelectedTripFiles(e.target.files)} accept="image/*" className="w-full text-xs" />
              </div>
            </form>

            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button type="button" onClick={() => setShowTripModal(false)} className="flex-1 border py-3 rounded-full text-xs font-bold">Cancel</button>
              <button type="submit" form="trip-form" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-full text-xs font-bold">Save Trip</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}