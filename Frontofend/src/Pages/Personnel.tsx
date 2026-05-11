import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Clock, Activity } from 'lucide-react';

interface Log {
  id: number;
  admin_email: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export default function Personnel() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('yolo_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const res = await axios.get(`${apiUrl}/trace/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeAdmins = new Set(logs.map(log => log.admin_email)).size;

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-12 border-b border-white/[0.05] pb-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Personnel_Traceability</h1>
          <p className="text-[10px] text-zinc-500 tracking-[0.4em] font-bold mt-1 uppercase">
            Monitoring_System_Access_In_Realtime
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-sm text-[#1A73E8] text-[10px] font-bold tracking-widest">
            LIVE_FEED
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Shield size={16}/>} label="Total Actions" value={logs.length} />
        <StatCard icon={<Activity size={16}/>} label="Active Admins" value={activeAdmins} />
        <StatCard 
          icon={<Clock size={16}/>} 
          label="Last Entry" 
          value={logs[0]?.timestamp ? new Date(logs[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} 
        />
      </div>

      <div className="bg-white/[0.01] border border-white/[0.05] rounded-sm overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] text-[9px] uppercase tracking-widest text-zinc-600 font-black">
            <tr>
              <th className="p-5">Personnel</th>
              <th className="p-5">Action</th>
              <th className="p-5">Module</th>
              <th className="p-5">Trace_Detail</th>
              <th className="p-5">IP_Address</th>
              <th className="p-5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-bold">
            {!loading && logs.map((log) => (
              <tr key={log.id} className="border-t border-white/[0.02] hover:bg-white/[0.03] transition-all group">
                <td className="p-5 text-[#1A73E8] font-mono italic">{log.admin_email.split('@')[0]}</td>
                <td className="p-5">
                  <span className="bg-white/5 border border-white/5 px-2 py-1 rounded-xs font-black text-[8px] tracking-widest uppercase group-hover:bg-[#1A73E8]/20 group-hover:text-[#1A73E8] transition-colors">
                    {log.action}
                  </span>
                </td>
                <td className="p-5 text-zinc-400 font-black uppercase tracking-tighter">{log.module}</td>
                <td className="p-5 text-zinc-500 group-hover:text-zinc-200 italic transition-colors">"{log.details}"</td>
                <td className="p-5 font-mono text-zinc-600">{log.ip_address || "0.0.0.0"}</td>
                <td className="p-5 text-right text-zinc-500 font-mono">
                   {new Date(log.timestamp).toLocaleDateString()} | {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && !loading && (
          <div className="p-20 text-center text-zinc-800 font-black italic text-2xl uppercase opacity-20">
            No_Trace_Logs_Found
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-sm hover:border-[#1A73E8]/30 transition-all duration-500">
      <div className="flex items-center gap-2 text-zinc-600 mb-3">
        <span className="text-[#1A73E8]">{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="text-3xl font-black italic tracking-tighter leading-none">{value}</div>
    </div>
  );
}