import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Clock, MapPin, Activity } from 'lucide-react';

export default function Personnel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('yolo_token');
      const res = await axios.get('http://localhost:8000/api/v1/trace/logs', {
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
    const interval = setInterval(fetchLogs, 10000); // Live refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-white/[0.05] pb-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">PERSONNEL_TRACEABILITY</h1>
          <p className="text-[10px] text-zinc-500 tracking-[0.4em] font-bold mt-1 uppercase">
            KUANGALIA_PERSONNEL_CHANGES_IN_REALTIME
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-sm text-[#1A73E8] text-[10px] font-bold">
            YOURS_TRULY
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Shield size={16}/>} label="Total Actions" value={logs.length} />
        <StatCard icon={<Activity size={16}/>} label="Active Admins" value="1" />
        <StatCard icon={<Clock size={16}/>} label="Last Entry" value={logs[0]?.timestamp ? new Date(logs[0].timestamp).toLocaleTimeString() : 'N/A'} />
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] text-[9px] uppercase tracking-widest text-zinc-500 font-black">
            <tr>
              <th className="p-5">Personnel</th>
              <th className="p-5">Action</th>
              <th className="p-5">Module</th>
              <th className="p-5">Trace_Detail</th>
              <th className="p-5">IP_Address</th>
              <th className="p-5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-medium">
            {logs.map((log: any) => (
              <tr key={log.id} className="border-t border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
                <td className="p-5 text-blue-400 font-mono">{log.admin_email}</td>
                <td className="p-5">
                  <span className="bg-white/5 px-2 py-1 rounded-xs font-black text-[9px]">
                    {log.action}
                  </span>
                </td>
                <td className="p-5 text-zinc-400">{log.module}</td>
                <td className="p-5 text-zinc-500 group-hover:text-zinc-200 italic">"{log.details}"</td>
                <td className="p-5 font-mono text-zinc-600">{log.ip_address || "0.0.0.0"}</td>
                <td className="p-5 text-right text-zinc-500 font-mono">
                   {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-sm">
      <div className="flex items-center gap-2 text-zinc-500 mb-2">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-black italic">{value}</div>
    </div>
  );
}