import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, BarChart3, Search, MapPin, Calendar, Receipt, ChevronLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClients';

export default function Archive() {
  const [activeTab, setActiveTab] = useState<'logistics' | 'venues' | 'finance'>('logistics');
  const [data, setData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axiosClient.get(`/archive/${activeTab}`);
      setData(res.data);
    } catch (err) { console.error("Sync Failed:", err); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const filteredData = data.filter((item: any) => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalFinancialImpact = filteredData.reduce((acc, curr) => 
    acc + (curr.charge_amount || curr.total_charge || curr.amount || 0), 0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 md:p-20 font-sans">
      <button onClick={() => navigate('/a1/mdosi/kejayamkuu')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors uppercase text-[10px] font-bold tracking-widest mb-12">
        <ChevronLeft size={16} /> Back to Hub
      </button>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <p className="text-blue-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Historical Records</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-8">BI Vault System</h1>
          <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-full w-fit shadow-sm">
            {(['logistics', 'venues', 'finance'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Database size={16}/>} label="Total Records" value={filteredData.length} />
          <StatCard icon={<TrendingUp size={16}/>} label="Financial Impact" value={`KES ${totalFinancialImpact.toLocaleString()}`} />
          <StatCard icon={<BarChart3 size={16}/>} label="Average Metric" value={`KES ${filteredData.length ? Math.round(totalFinancialImpact/filteredData.length).toLocaleString() : 0}`} />
        </div>

        <div className="space-y-4">
          {filteredData.map((item: any) => {
            if (activeTab === 'logistics') return <LogisticsCard key={item.id} data={item} />;
            if (activeTab === 'venues') return <VenueCard key={item.id} data={item} />;
            return <FinanceCard key={item.id} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
}



function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="text-blue-600 mb-4">{icon}</div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-extrabold tracking-tight">{value}</h3>
    </div>
  );
}

function LogisticsCard({ data }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{data.origin} → {data.destination}</h3>
        <p className="text-xs text-slate-500 font-medium">{data.driver_name} • {data.purpose}</p>
      </div>
      <p className="font-bold">KES {data.charge_amount?.toLocaleString()}</p>
    </div>
  );
}

function VenueCard({ data }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{data.venue_name}</h3>
        <div className="flex gap-4 mt-2 text-slate-400 text-[10px] font-bold uppercase">
          <span className="flex items-center gap-1"><MapPin size={12}/> {data.location}</span>
          <span className="flex items-center gap-1"><User size={12}/> {data.contact_person}</span>
        </div>
      </div>
      <p className="font-bold">KES {data.total_charge?.toLocaleString()}</p>
    </div>
  );
}

function FinanceCard({ data }: any) {
  const isIncome = data.transaction_type === 'INCOME';
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Receipt className={isIncome ? 'text-emerald-500' : 'text-rose-500'} />
        <div>
          <h4 className="font-bold text-sm">{data.description}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase">{data.category}</p>
        </div>
      </div>
      <p className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
        {isIncome ? '+' : '-'} {data.amount?.toLocaleString()}
      </p>
    </div>
  );
}