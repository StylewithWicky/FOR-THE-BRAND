import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClients';
import { AuditLog } from '../types/api';

export default function AuditLogTable(): React.JSX.Element {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAuditLogs = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axiosClient.get<AuditLog[]>('/system/audit-logs');
      setLogs(response.data);
    } catch (err) {
      
      console.error("Local component error layer catches rejection safely.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAuditLogs();
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-4xl font-black tracking-tight uppercase font-['League_Spartan']">
          System Audits
        </h1>
        <button 
          onClick={() => void fetchAuditLogs()}
          disabled={loading}
          className="bg-white text-black font-bold px-6 py-2 uppercase tracking-wider hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Refresh Logs'}
        </button>
      </div>

      
    </div>
  );
}