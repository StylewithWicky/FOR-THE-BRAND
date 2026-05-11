import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  HardDrive, Truck, MapPin, DollarSign, 
  Calendar, Search, ArrowUpRight, Filter,
  Phone, User, Receipt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Archive() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'logistics' | 'venues' | 'finance'>('logistics');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('yolo_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const res = await axios.get(`${apiUrl}/archive/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error("Sync Failed:", err);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const filteredData = data.filter((item: any) => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 font-sans selection:bg-[#1A73E8]/30">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex justify-between items-start mb-20 border-b border-white/[0.03] pb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1 h-12 bg-[#1A73E8] shadow-[0_0_20px_rgba(26,115,232,0.4)]" />
              <h1 className="text-6xl font-black italic tracking-tighter uppercase">Operations_Archive</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.5em] uppercase pl-6">
              Historical_Intelligence_&_Cost_Analysis
            </p>
          </div>

          <div className="flex bg-white/[0.02] border border-white/[0.05] p-1 rounded-xs">
            <TabButton label="Logistics" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
            <TabButton label="Venues" active={activeTab === 'venues'} onClick={() => setActiveTab('venues')} />
            <TabButton label="Finance" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          </div>
        </header>

        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
          <input 
            type="text"
            placeholder={`SEARCH_${activeTab.toUpperCase()}_RECORDS...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.01] border border-white/[0.05] p-6 pl-16 text-sm font-black italic uppercase tracking-widest outline-none focus:border-[#1A73E8]/40 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activeTab === 'logistics' && filteredData.map((trip: any) => (
            <LogisticsCard key={trip.id} data={trip} />
          ))}
          {activeTab === 'venues' && filteredData.map((venue: any) => (
            <VenueCard key={venue.id} data={venue} />
          ))}
          {activeTab === 'finance' && filteredData.map((entry: any) => (
            <FinanceCard key={entry.id} data={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-white text-black' : 'text-zinc-600 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function LogisticsCard({ data }: any) {
  return (
    <div className="group bg-white/[0.01] border border-white/[0.03] p-10 hover:bg-white/[0.02] hover:border-[#1A73E8]/20 transition-all duration-500 flex justify-between items-center">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[#1A73E8] text-[10px] font-black font-mono tracking-tighter italic">
            {new Date(data.date).toLocaleDateString()}
          </span>
          <span className="bg-white/5 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
            {data.vehicle_type}
          </span>
        </div>
        <h3 className="text-3xl font-black italic uppercase tracking-tighter group-hover:translate-x-2 transition-transform">
          {data.route_origin} <span className="text-[#1A73E8]">➔</span> {data.route_destination}
        </h3>
        <div className="flex gap-8">
          <IconLabel icon={<User size={12}/>} label={data.driver_name} />
          <IconLabel icon={<Phone size={12}/>} label={data.driver_phone} />
          <IconLabel icon={<Truck size={12}/>} label={data.cargo_type} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-4xl font-black italic tracking-tighter mb-1">KES {data.total_cost.toLocaleString()}</p>
        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{data.mpesa_ref || "CASH_SETTLED"}</p>
      </div>
    </div>
  );
}

function VenueCard({ data }: any) {
  return (
    <div className="group bg-white/[0.01] border border-white/[0.03] p-10 hover:bg-white/[0.02] hover:border-white/10 transition-all flex justify-between items-center">
      <div className="space-y-4">
        <p className="text-zinc-500 text-[10px] font-black italic">{new Date(data.date).toLocaleDateString()}</p>
        <h3 className="text-3xl font-black italic uppercase tracking-tighter">{data.venue_name}</h3>
        <div className="flex gap-8">
          <IconLabel icon={<MapPin size={12}/>} label={data.location_details} />
          <IconLabel icon={<Calendar size={12}/>} label={data.event_purpose} />
          <IconLabel icon={<User size={12}/>} label={data.contact_person} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-4xl font-black italic tracking-tighter">KES {data.cost_breakdown.toLocaleString()}</p>
        <div className="flex items-center justify-end gap-2 mt-2">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
           <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">VERIFIED_LOCATION</p>
        </div>
      </div>
    </div>
  );
}

function FinanceCard({ data }: any) {
  const isIncome = data.transaction_type === 'INCOME';
  return (
    <div className="group bg-white/[0.01] border border-white/[0.03] p-8 flex justify-between items-center hover:bg-white/[0.02]">
      <div className="flex gap-8 items-center">
        <div className={`w-12 h-12 flex items-center justify-center border ${isIncome ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
          <Receipt size={20} className={isIncome ? 'text-green-500' : 'text-red-500'} />
        </div>
        <div>
          <h4 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-[#1A73E8] transition-colors">{data.description}</h4>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{data.category} • {data.mpesa_code}</p>
        </div>
      </div>
      <p className={`text-3xl font-black italic tracking-tighter ${isIncome ? 'text-white' : 'text-zinc-500'}`}>
        {isIncome ? '+' : '-'} {data.amount.toLocaleString()}
      </p>
    </div>
  );
}

function IconLabel({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2 text-zinc-500">
      <span className="text-[#1A73E8]">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}