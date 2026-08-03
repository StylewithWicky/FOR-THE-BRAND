import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Truck, DollarSign, Plus, ChevronLeft, X, Hotel, Phone, User } from 'lucide-react';
import axiosClient from '../api/axiosClients';
import { useNavigate } from 'react-router-dom';

export default function BookingsAndEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State for Eka Kitu
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    activities: '',
    price: '',
    hotel_name: '',
    hotel_cost: '',
    contact_person: '',
    contact_phone: '',
    package_details: '',
    image: ''
  });

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axiosClient.get('/sherehe/mkubwa/zote');
      setEvents(response.data);
    } catch (err) { 
      console.error("Error fetching events:", err); 
    }
  };

  useEffect(() => { 
    fetchEvents(); 
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Transforming string values to numeric types where your backend expects it
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        hotel_cost: parseFloat(formData.hotel_cost) || 0,
        date: new Date(formData.date).toISOString()
      };
      
      await axiosClient.post('/sherehe/mkubwa/zote', payload); // Adjust endpoint if creation URL differs
      setShowModal(false);
      // Reset Form
      setFormData({
        name: '', description: '', date: '', location: '', activities: '',
        price: '', hotel_name: '', hotel_cost: '', contact_person: '',
        contact_phone: '', package_details: '',image:''
      });
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
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

      {/* Header - Stacked on Mobile, Flex on Desktop */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 md:mb-12">
        <div>
          <p className="text-blue-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-1 sm:mb-2">Fleet & Event Management</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bookings & Events</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 sm:py-3 rounded-full text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> EKA KITU 
        </button>
      </div>

      {/* Event Grid - Single Column on Mobile, Two Columns on Medium+ screens */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {events.length === 0 ? (
          <div className="lg:col-span-2 text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium text-sm">
            Hakuna sherehe zilizopatikana. Gusa 'Eka Kitu' kuongeza.
          </div>
        ) : (
          events.map(event => {
            // Safe fallback attributes matching your Python backend properties
            const trip = event.trip_details?.[0]; 
            const eventName = event.name || "Untitled Event";
            const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'No Date';
            const location = event.location || 'No Location Set';

            return (
              <div key={event.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="mb-6">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-md md:text-lg font-bold text-slate-900 tracking-tight line-clamp-2">{eventName}</h2>
                  </div>
                  
                  {/* Event Meta Badges */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-400 mt-2.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={12} className="text-slate-400" /> {eventDate}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <MapPin size={12} className="text-slate-400" /> {location}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 border-l-2 border-slate-100 pl-2.5">{event.description}</p>
                  )}
                </div>

                {/* Logistics & Hospitality Breakdown */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                  <div className="pr-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Hotel size={10}/> Hospitality</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{event.hotel_name || 'Unassigned'}</p>
                    <p className="text-[11px] font-extrabold text-emerald-600 mt-1">KES {(event.hotel_cost || 0).toLocaleString()}</p>
                  </div>
                  <div className="border-l border-slate-100 pl-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Truck size={10}/> Logistics</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{trip?.transport_means || 'Unassigned'}</p>
                    <p className="text-[11px] font-extrabold text-blue-600 mt-1">KES {(trip?.driver_charge || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* "Eka Kitu" Side Drawer / Modal Drawer for Mobile & Desktop Context */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-end transition-opacity duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Form Container */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">New Entry</p>
                <h2 className="text-xl font-bold text-slate-900">Eka Kitu Mpya</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content / Form */}
            <form onSubmit={handleSubmit} className="p-6 flex-1 space-y-5">
              
              {/* Basic Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-1">1. Event Basics</p>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Event Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" placeholder="e.g., Koroga Festival" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Date *</label>
                    <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" />
                  </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location *</label>
                      <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" placeholder="e.g., Naivasha" />
                    </div>
                  </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Description / Activities</label>
                  <textarea name="description" rows={2} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors resize-none" placeholder="Details about the setup..." />
                </div>
              </div>
              <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location *</label>
                    <input type="file" name="image" required value={formData.image} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" placeholder="e.g., Naivasha" />
                  </div>
                

              {/* Hospitality Section */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-1">2. Hospitality Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hotel Name</label>
                    <input type="text" name="hotel_name" value={formData.hotel_name} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" placeholder="e.g., Enashipai" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hotel Cost (KES)</label>
                    <input type="number" name="hotel_cost" value={formData.hotel_cost} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Person</label>
                    <input type="text" name="contact_person" value={formData.contact_person} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" placeholder="Manager Name" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Phone</label>
                    <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors" placeholder="07123..." />
                  </div>
                </div>
              </div>

            </form>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-full text-xs font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-slate-900 text-white py-3 rounded-full text-xs font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-sm"
              >
                {loading ? 'Saving...' : 'Save Record'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}