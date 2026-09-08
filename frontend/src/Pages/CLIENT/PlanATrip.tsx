import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PlanATripPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    totalBudget: '',
    groupSize: '1',
    guidePreference: '',
    travelDate: '',
    durationDays: '',
    destinationCountry: '',
    additionalMessage: ''
  });

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage('');
      const API_BASE = (import.meta as any).env.VITE_API_URL 

      const selectedDate = bookingForm.travelDate ? new Date(bookingForm.travelDate) : new Date();
const formattedStartDate = selectedDate.toISOString().split('T')[0];

const calculatedDays = parseInt(bookingForm.durationDays || '1', 10);
const computedEndDate = new Date(selectedDate.getTime() + (calculatedDays * 24 * 60 * 60 * 1000))
  .toISOString().split('T')[0];
  
    const payload = {
      name: String(`${bookingForm.fullName} — ${bookingForm.destinationCountry} Trip`), 
      location: String(bookingForm.destinationCountry),
      start_date: formattedStartDate, 
      end_date: computedEndDate,       
      package_type: String(bookingForm.guidePreference || 'Not Selected'),
      is_active: true,
      
      
      activities: [
        `Budget: $${bookingForm.totalBudget}`,
        `Group Size: ${bookingForm.groupSize} Pax`,
        `Duration: ${bookingForm.durationDays} Days`
      ],
      
      description: String(
        `Email: ${bookingForm.email} | ` +
        `Phone: ${bookingForm.phoneNumber} | ` +
        `Notes: ${bookingForm.additionalMessage || 'None'}`
      )
    };
      const response = await fetch(`${API_BASE}/trips/public-create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Data validation pipeline sync exception.');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Dropped link layer to trip database backend.');
    } finally {
      setLoading(false);
    }
}
  if (success) {
    return (
      <div className="bg-[#0b0c0e] text-white min-h-screen flex items-center justify-center p-8 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl mx-auto">✦</div>
          <h2 className="text-3xl font-serif">Blueprint Logged</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Your destination vectors have been synced to the server pipeline. We are compiling your custom track run now.
          </p>
          <Link to="/" className="inline-block text-[10px] font-mono uppercase bg-amber-500 text-black px-6 py-3 rounded-xl font-bold tracking-widest hover:bg-white transition">
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 flex flex-col lg:flex-row">
      
    
      <div className="lg:w-4/12 h-[35vh] lg:h-screen relative flex flex-col justify-end p-12 lg:p-16 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200')] bg-cover bg-center brightness-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-black/10 to-transparent z-10" />
        
        <div className="relative z-10 space-y-6">
          <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 font-bold uppercase">// Tracking Systems</span>
          <h2 className="text-3xl font-serif text-white leading-tight">
            Tell us more about your <span className="italic font-normal text-amber-400">travel plans</span>.
          </h2>
          
          <div className="pt-4 border-t border-white/5 space-y-2">
            <Link to="/c2/v1/cancellation" className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-amber-400 transition">
              → View Cancellation Policy
            </Link>
            <Link to="/c2/v1/cancellation#tips" className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-amber-400 transition">
              → Travel Tips 
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:w-8/12 p-8 md:p-16 lg:p-20 flex flex-col justify-center max-w-4xl mx-auto w-full overflow-y-auto">
        <form onSubmit={handleFormSubmission} className="space-y-8">
          
          <div className="space-y-2 border-b border-white/5 pb-4">
            <h1 className="text-2xl font-serif">Itinerary Configuration</h1>
            <p className="text-xs text-slate-400 font-light">Provide your parameters to generate custom local routes.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={bookingForm.fullName}
                onChange={(e) => setBookingForm(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Doe" 
                className="w-full bg-transparent border-none text-white focus:outline-none font-serif text-base" 
              />
            </div>

            {/* Email Address */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={bookingForm.email}
                onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com" 
                className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-sm" 
              />
            </div>

            {/* Phone Number */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Phone Number</label>
              <input 
                type="tel" 
                required
                value={bookingForm.phoneNumber}
                onChange={(e) => setBookingForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+254 700 000000" 
                className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-sm" 
              />
            </div>

            {/* Total Budget */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Total Budget (USD)</label>
              <input 
                type="number" 
                required
                value={bookingForm.totalBudget}
                onChange={(e) => setBookingForm(prev => ({ ...prev, totalBudget: e.target.value }))}
                placeholder="e.g., 3500" 
                className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-sm" 
              />
            </div>

            {/* Group Size */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Group Size</label>
              <input 
                type="number" 
                min="1"
                required
                value={bookingForm.groupSize}
                onChange={(e) => setBookingForm(prev => ({ ...prev, groupSize: e.target.value }))}
                className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-sm" 
              />
            </div>

            {/* Safari Duration */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Safari Duration (Days)</label>
              <input 
                type="number" 
                required
                value={bookingForm.durationDays}
                onChange={(e) => setBookingForm(prev => ({ ...prev, durationDays: e.target.value }))}
                placeholder="e.g., 7" 
                className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-sm" 
              />
            </div>

            {/* Preferred Travel Date */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Preferred Travel Date</label>
              <input 
                type="date" 
                required
                value={bookingForm.travelDate}
                onChange={(e) => setBookingForm(prev => ({ ...prev, travelDate: e.target.value }))}
                className="w-full bg-transparent border-none text-white focus:outline-none font-mono text-xs text-slate-400 mt-1" 
              />
            </div>

            {/* Destination Country Selection */}
            <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Select Destination Country</label>
              <select 
                required
                value={bookingForm.destinationCountry}
                onChange={(e) => setBookingForm(prev => ({ ...prev, destinationCountry: e.target.value }))}
                className="w-full bg-[#0b0c0e] border-none text-white focus:outline-none font-serif text-sm mt-1 cursor-pointer"
              >
                <option value="" disabled className="text-zinc-700">Select country</option>
                <option value="Kenya">Kenya</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Uganda">Uganda</option>
                <option value="Democratic Republic of Congo">Democratic Republic of Congo</option>
                <option value="Congo River">Congo River</option>
              </select>
            </div>
          </div>

          {/* Private Guide Radio/Selector Preference */}
          <div className="space-y-3">
            <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest">Private Guide Preference</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'yes', label: 'Yes, I want a private guide' },
                { id: 'no', label: 'No, group guide is fine' },
                { id: 'not-sure', label: 'Not sure, need more info' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBookingForm(prev => ({ ...prev, guidePreference: opt.label }))}
                  className={`p-4 rounded-xl text-xs font-mono border text-left transition-all ${
                    bookingForm.guidePreference === opt.label ? 'border-amber-500 bg-amber-500/5 text-white' : 'border-white/5 bg-white/[0.01] text-slate-400 hover:border-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Message Area */}
          <div className="border-b border-white/10 py-2 focus-within:border-amber-500 transition-colors">
            <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Additional Message</label>
            <textarea 
              rows={3}
              value={bookingForm.additionalMessage}
              onChange={(e) => setBookingForm(prev => ({ ...prev, additionalMessage: e.target.value }))}
              placeholder="Any specific properties, musical events, or custom requirements..." 
              className="w-full bg-transparent border-none text-white focus:outline-none font-serif text-sm mt-1 resize-none" 
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-mono text-red-400 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">{errorMessage}</p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-black font-black uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-white transition shadow-xl font-mono disabled:opacity-30"
          >
            {loading ? 'Transmitting Data Logs...' : 'Submit Request →'}
          </button>
        </form>
      </div>

    </div>
  );
}