import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Server, Activity, ArrowLeft, RefreshCw, Terminal } from 'lucide-react';
import axiosClient from '../api/axiosClients';
import { AuditLog } from '../types/api';

export default function SystemPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSystemData = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosClient.get<AuditLog[]>('/system/audit-logs');
      setLogs(response.data);
    } catch (err) {
      console.error("Failed to sync system infrastructure metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSystemData();
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-[#1A73E8]/30">
      
      {/* Structural Minimal Sidebar just for Back-Navigation */}
      <aside className="w-64 border-r border-white/[0.03] flex flex-col p-10 z-50 bg-black/20 backdrop-blur-2xl">
        <button 
          onClick={() => navigate('/a1/mdosi/kejayamkuu')}
          className="flex items-center gap-4 text-zinc-500 hover:text-white transition-all group mb-12"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Return to Hub</span>
        </button>

        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-6 bg-[#FF6B00] shadow-[0_0_15px_#FF6B00]" />
          <p className="text-[10px] font-black tracking-[0.4em] text-white uppercase">
            SYSTEM CORE
          </p>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-20 overflow-y-auto custom-scrollbar studio-bg">
        <header className="flex justify-between items-end mb-16">
          <div>
            <p className="text-[#FF6B00] text-[9px] font-black tracking-[0.5em] uppercase mb-6">
              INFRASTRUCTURE LAYER
            </p>
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-2 font-['League_Spartan']">
              SYSTEM MONITOR
            </h1>
            <div className="h-[2px] w-24 bg-[#FF6B00] mt-4" />
          </div>

          <button
            onClick={() => void fetchSystemData()}
            disabled={loading}
            className="flex items-center gap-3 border border-white/[0.05] bg-zinc-900/50 hover:bg-white hover:text-black text-zinc-400 font-bold px-6 py-3 text-xs uppercase tracking-widest transition-all disabled:opacity-50 rounded-sm"
          >
            <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Force Refresh'}
          </button>
        </header>

        {/* Live System Metrics Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mb-16">
          <div className="border border-white/[0.03] bg-gradient-to-b from-[#0A0A0A] to-black p-8 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-2">Gate Status</p>
              <p className="text-2xl font-black tracking-tight text-emerald-500">ACTIVE</p>
            </div>
            <Server size={24} className="text-zinc-800" />
          </div>

          <div className="border border-white/[0.03] bg-gradient-to-b from-[#0A0A0A] to-black p-8 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-2">Rate Limiter</p>
              <p className="text-2xl font-black tracking-tight text-white">10 req / 60s</p>
            </div>
            <Activity size={24} className="text-zinc-800" />
          </div>

          <div className="border border-white/[0.03] bg-gradient-to-b from-[#0A0A0A] to-black p-8 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-2">Logged Incidents</p>
              <p className="text-2xl font-black tracking-tight text-[#FF6B00]">{logs.length}</p>
            </div>
            <ShieldAlert size={24} className="text-zinc-800" />
          </div>
        </div>

        {/* Audit Log Terminal Console */}
        <div className="max-w-7xl border border-white/[0.03] bg-[#0A0A0A] rounded-sm overflow-hidden">
          <div className="border-b border-white/[0.03] bg-black/40 px-6 py-4 flex items-center gap-3">
            <Terminal size={14} className="text-[#FF6B00]" />
            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">System Trace Logbook</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.02] bg-zinc-950 text-[10px] font-black tracking-wider text-zinc-500 uppercase">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Action Event</th>
                  <th className="py-4 px-6">Operator</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6 text-right">Payload Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.01] text-xs font-mono">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-600 font-sans tracking-wide uppercase text-[10px]">
                      No recorded runtime violations or events found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-4 px-6 text-zinc-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-4 px-6 font-bold text-white uppercase tracking-tight italic">{log.action}</td>
                      <td className="py-4 px-6 text-zinc-400">{log.user}</td>
                      <td className="py-4 px-6 text-zinc-600">{log.ip_address}</td>
                      <td className="py-4 px-6 text-right text-zinc-400 font-sans max-w-xs truncate group-hover:text-white transition-colors">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}