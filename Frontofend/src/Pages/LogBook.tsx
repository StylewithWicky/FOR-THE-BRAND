import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, Plus, MapPin, Tag, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('yolo_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const res = await axios.get(`${apiUrl}/logbook/entries?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Logbook Sync Failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [selectedDate]);

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans selection:bg-[#1A73E8]/30">
      
      <aside className="w-80 border-r border-white/[0.03] p-10 flex flex-col space-y-10 bg-black">
        <button 
          onClick={() => navigate('/a1/mdosi/kejayamkuu')}
          className="flex items-center gap-2 text-zinc-600 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest"
        >
          <ArrowLeft size={14} /> Back_To_Hub
        </button>

        <header>
          <h2 className="text-4xl font-black italic tracking-tighter leading-none mb-2 uppercase">Log_Book</h2>
          <p className="text-[#1A73E8] text-[9px] font-black tracking-[0.4em] uppercase">Maitai_Operational_Feed</p>
        </header>

        <div className="space-y-4">
          <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Select_Target_Date</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.05] p-4 text-xs font-bold text-[#1A73E8] focus:border-[#1A73E8] transition-all outline-none rounded-sm"
          />
        </div>

        <div className="pt-10 border-t border-white/[0.03] space-y-6">
          <StatMini label="Active_Tasks" value={entries.length} />
          <StatMini label="System_Status" value="SYNCED" accent="#1A73E8" />
        </div>
      </aside>

      <main className="flex-1 p-20 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-6">
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Timeline_Live</h3>
              <div className="h-[1px] w-20 bg-white/10" />
            </div>
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xs hover:bg-[#1A73E8] hover:text-white transition-all group">
              <Plus size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">New_Log</span>
            </button>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-8">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/[0.02] rounded-sm" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {entries.length > 0 ? (
                entries.map((log) => (
                  <div key={log.id} className="relative pl-12 pb-12 group">
                    <div className="absolute left-[5px] top-0 bottom-0 w-[1px] bg-white/[0.05]" />
                    <div 
                      className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full z-10 transition-all duration-500 group-hover:scale-150 shadow-[0_0_15px_rgba(26,115,232,0.4)]" 
                      style={{ backgroundColor: log.accent_color }} 
                    />

                    <div className="flex justify-between items-start bg-white/[0.01] border border-transparent group-hover:border-white/[0.05] group-hover:bg-white/[0.02] p-8 rounded-sm transition-all duration-500">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-zinc-600 font-mono text-[10px] tracking-tighter">
                            {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[8px] font-black tracking-widest text-[#1A73E8] uppercase px-2 py-0.5 bg-[#1A73E8]/10 rounded-full">
                            {log.entry_type}
                          </span>
                        </div>
                        <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-4 group-hover:translate-x-2 transition-transform duration-500">
                          {log.title}
                        </h4>
                        <p className="text-zinc-500 text-xs font-medium max-w-xl leading-relaxed mb-6 italic">
                          "{log.description}"
                        </p>
                        <div className="flex gap-6">
                          <DetailItem icon={<MapPin size={12}/>} text={log.location} />
                          <DetailItem icon={<Tag size={12}/>} text={`Admin_${log.created_by?.split('@')[0] || 'Unknown'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.02] rounded-sm">
                   <p className="text-zinc-800 font-black italic text-5xl uppercase opacity-20 select-none">Void_Data</p>
                   <p className="text-zinc-600 text-[10px] font-bold tracking-[0.3em] mt-4 uppercase">No_Entries_Logged_For_This_Shift</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatMini({ label, value, accent = "#333" }: { label: string; value: string | number; accent?: string }) {
  return (
    <div>
      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black italic" style={{ color: accent }}>{value}</p>
    </div>
  );
}

function DetailItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-600">
      <span className="text-[#1A73E8]">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest">{text}</span>
    </div>
  );
}