import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, MapPin, Tag, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClients';

interface LogEntry {
  id: number;
  title: string;
  description: string;
  entry_type: string;
  location: string;
  accent_color: string;
  start_time: string;
  created_by: string;
}

export default function Logbook() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLog, setNewLog] = useState({ title: '', description: '', entry_type: 'GENERAL', location: 'HQ' });

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/logbook/entries`, { params: { date: selectedDate } });
      setEntries(res.data);
    } catch (err) { 
      console.error("Sync Failed", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/logbook/entries', newLog);
      setShowModal(false);
      setNewLog({ title: '', description: '', entry_type: 'GENERAL', location: 'HQ' });
      fetchEntries();
    } catch (err) {
      console.error("Failed to save entry", err);
    }
  };

  useEffect(() => { fetchEntries(); }, [selectedDate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-10">
      
      {/* Back Navigation Link */}
      <button 
        onClick={() => navigate('/a1/mdosi/kejayamkuu')} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors uppercase text-[10px] font-bold tracking-widest mb-8 sm:mb-12"
      >
        <ChevronLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-5xl mx-auto">
        
        {/* Dynamic Header Structure */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Operational Logbook</h1>
            <p className="text-slate-500 mt-1 sm:mt-2 font-medium text-sm sm:text-base">Chronological record of system activities.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>

        {/* Scaled Date Selection Filter */}
        <div className="bg-white p-3 sm:p-4 rounded-full border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-fit justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-slate-400 ml-2" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold outline-none uppercase tracking-widest cursor-pointer text-slate-700"
            />
          </div>
        </div>

        {/* Time Timeline Cards Wrapper */}
        {loading ? (
          <div className="space-y-4 sm:space-y-6 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-40 sm:h-32 bg-white rounded-3xl border border-slate-100" />)}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {entries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium text-sm">
                No system log records logged for this date.
              </div>
            ) : (
              entries.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Color Accent Indicator Strip (Flips to absolute top bar on mobile) */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5 sm:h-auto sm:w-1.5 sm:relative sm:rounded-full shrink-0" 
                    style={{ backgroundColor: log.accent_color || '#3b82f6' }} 
                  />
                  
                  <div className="flex-1 mt-2 sm:mt-0">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        {log.entry_type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-md sm:bg-transparent sm:p-0">
                        {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <h4 className="text-base sm:text-lg font-bold mb-2 text-slate-800 leading-snug">{log.title}</h4>
                    <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">{log.description}</p>
                    
                    {/* Meta Field Footer Blocks */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} className="shrink-0" /> 
                        <span className="text-[10px] font-bold uppercase tracking-wider">{log.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Tag size={14} className="shrink-0" /> 
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {log.created_by ? log.created_by.split('@')[0] : 'System'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mobile-Responsive Modal Component Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transform transition-all p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-xl text-slate-900">New Logbook Entry</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateLog} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Entry Title</label>
                <input 
                  type="text" required
                  placeholder="e.g., Cargo Dispatch Shift Alpha"
                  value={newLog.title}
                  onChange={e => setNewLog({...newLog, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Type</label>
                  <select 
                    value={newLog.entry_type}
                    onChange={e => setNewLog({...newLog, entry_type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                  >
                    <option value="GENERAL">General</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="INCIDENT">Incident</option>
                    <option value="DISPATCH">Dispatch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Location</label>
                  <input 
                    type="text" required
                    value={newLog.location}
                    onChange={e => setNewLog({...newLog, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Detailed Description</label>
                <textarea 
                  required rows={4}
                  placeholder="Write clear context on operational updates..."
                  value={newLog.description}
                  onChange={e => setNewLog({...newLog, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}