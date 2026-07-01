import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Server, Activity, ArrowLeft, RefreshCw, Terminal, ChevronLeft } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <nav className="p-8 md:p-10">
        <button 
          onClick={() => navigate('/a1/mdosi/kejayamkuu')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft size={16} /> Back to Hub
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pb-20">
        <header className="flex justify-between items-end mb-16">
          <div>
            <p className="text-blue-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Infrastructure Layer</p>
            <h1 className="text-5xl font-extrabold tracking-tight">System Monitor</h1>
          </div>

          <button
            onClick={() => void fetchSystemData()}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 font-bold px-6 py-3 text-[10px] uppercase tracking-widest transition-all rounded-full shadow-sm"
          >
            <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Refresh'}
          </button>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <MetricCard label="Gate Status" value="Active" color="text-emerald-600" icon={<Server size={20} />} />
          <MetricCard label="Rate Limiter" value="10 req/60s" color="text-slate-900" icon={<Activity size={20} />} />
          <MetricCard label="Incidents" value={logs.length.toString()} color="text-blue-600" icon={<ShieldAlert size={20} />} />
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <Terminal size={16} className="text-blue-600" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">System Trace Log</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="p-6">Timestamp</th>
                  <th className="p-6">Action</th>
                  <th className="p-6">Operator</th>
                  <th className="p-6">IP Address</th>
                  <th className="p-6 text-right">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-slate-400">No runtime events found.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-6 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-6 font-bold text-slate-900 uppercase">{log.action}</td>
                      <td className="p-6">{log.user}</td>
                      <td className="p-6 font-mono">{log.ip_address}</td>
                      <td className="p-6 text-right italic text-slate-400">{log.details}</td>
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

function MetricCard({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="text-slate-300">{icon}</div>
      </div>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}