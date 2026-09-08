import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ChevronLeft, RefreshCw } from 'lucide-react';
import axiosClient from '../api/axiosClients';

export default function LogisticsTower() {
  const [logistics, setLogistics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogistics = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/logistics/active'); 
      setLogistics(res.data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchLogistics();
    const interval = setInterval(fetchLogistics, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalOutstandingBudget = useMemo(() => {
    return logistics.reduce((sum, item) => sum + (item.driver_charge || 0), 0);
  }, [logistics]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-10 font-sans">
      {/* Return to Hub Action Button */}
      <button 
        onClick={() => navigate('/a1/mdosi/kejayamkuu')} 
        className="text-slate-400 hover:text-slate-600 transition-colors font-bold text-[10px] uppercase mb-8 sm:mb-12 flex items-center gap-2"
      >
        <ChevronLeft size={16} /> Return to Hub
      </button>

      <div className="max-w-5xl mx-auto">
        
        {/* Responsive Header Component */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12 border-b border-slate-200 pb-6 sm:pb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Logistic and Scheduling</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">Automatic allocations from Master Bookings</p>
          </div>
          <div className="text-left sm:text-right bg-blue-50/50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-blue-100 sm:border-none flex justify-between sm:block items-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Liability</p>
              <p className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5">KES {totalOutstandingBudget.toLocaleString()}</p>
            </div>
            {loading && (
              <RefreshCw size={16} className="animate-spin text-blue-500 sm:hidden" />
            )}
          </div>
        </div>

        {/* Responsive List Layout Grid */}
        <div className="grid gap-4 sm:gap-6">
          {logistics.length === 0 && !loading ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium text-sm">
              No active logistics allocations found.
            </div>
          ) : (
            logistics.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:shadow-md"
              >
                {/* Profile Identity Blocks */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:w-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <Truck size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base sm:text-lg text-slate-800 leading-snug">{item.driver_name}</h2>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5">{item.vehicle_plate}</p>
                  </div>
                </div>
                
                {/* Operational Dispatch Status Tags */}
                <div className="flex sm:flex-col justify-between items-center sm:items-end border-t border-slate-50 pt-3 sm:pt-0 sm:border-none">
                  <span className="block sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <div className="text-right">
                    <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs inline-block">
                      {item.current_status}
                    </span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}