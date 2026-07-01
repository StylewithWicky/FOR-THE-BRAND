import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, Activity, ArrowLeft } from 'lucide-react';
import axiosClient from '../api/axiosClients';

interface AuditLog {
  id: number;
  admin_email: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export default function Personnel() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/trace/logs');
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to sync audit dataset", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-10 font-sans">
      
      {/* Navigation Anchor */}
      <button 
        onClick={() => navigate('/a1/mdosi/kejayamkuu')} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors uppercase text-[10px] font-bold tracking-widest mb-8 sm:mb-12"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>
    
      <div className="max-w-7xl mx-auto">
        
        {/* Dynamic Header Structure */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Personnel Audit</h1>
            <p className="text-slate-500 mt-1 sm:mt-2 font-medium text-sm sm:text-base">Tracking system activity and access logs.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 self-start sm:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Active
          </div>
        </div>

        {/* Stats Metrics Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatCard icon={<Shield size={18}/>} label="Total Actions" value={loading ? '...' : logs.length} />
          <StatCard icon={<Activity size={18}/>} label="Active Admins" value="-" />
          <StatCard icon={<Clock size={18}/>} label="Last Entry" value="Live" />
        </div>

        {/* Main Content Node */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-2xl border border-slate-100" />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium text-sm">
            No system audit trails found in records database.
          </div>
        ) : (
          <div>
            {/* Desktop-Only Data View Layout Table */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                    <th className="p-6">Personnel</th>
                    <th className="p-6">Action</th>
                    <th className="p-6">Module</th>
                    <th className="p-6">Detail</th>
                    <th className="p-6 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-slate-600">
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-blue-50/40 transition-colors">
                      <td className="p-6 text-blue-600 font-bold">{log.admin_email ? log.admin_email.split('@')[0] : 'Unknown'}</td>
                      <td className="p-6">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-slate-600 tracking-wide">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-6 text-slate-800 font-bold uppercase tracking-wide">{log.module}</td>
                      <td className="p-6 italic max-w-xs truncate text-slate-500">"{log.details}"</td>
                      <td className="p-6 text-right font-mono text-slate-400 font-bold">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card Stack List View */}
            <div className="block md:hidden space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operator</p>
                      <span className="text-xs font-extrabold text-blue-600">{log.admin_email ? log.admin_email.split('@')[0] : 'Unknown'}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Action</p>
                      <span className="bg-slate-100 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase text-slate-600 inline-block">
                        {log.action}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Module</p>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">{log.module}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/50">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Operation Detail</p>
                    <p className="text-xs italic text-slate-600 leading-relaxed">"{log.details}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between sm:block">
      <div className="flex items-center gap-3 text-slate-400 sm:mb-4">
        <div className="shrink-0 text-slate-400">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}