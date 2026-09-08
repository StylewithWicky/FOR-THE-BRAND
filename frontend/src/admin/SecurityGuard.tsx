import React, { useState, useEffect } from 'react';


interface SecurityAlert {
  type: string;
  source: string;
  details: string;
  timestamp: string;
  kill_type: 'IP' | 'PHONE'; 
}

interface SecurityTelemetryResponse {
  alerts: SecurityAlert[];
  blocked: string[];
}

export default function SecurityGuard() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [blockedList, setBlockedList] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fetchSecurityMatrix = async () => {
    try {
      const response = await fetch('/api/v1/admin/security/logs-telemetry');
      const data: SecurityTelemetryResponse = await response.json();
      setAlerts(data.alerts || []);
      setBlockedList(data.blocked || []);
    } catch (err) {
      console.error("SYS_GUARD_ERROR: Telemetry frame sync failure ->", err);
    }
  };

  useEffect(() => {
    fetchSecurityMatrix();
    const pulseEngine = setInterval(fetchSecurityMatrix, 3000);
    return () => clearInterval(pulseEngine);
  }, []);


  const executeKillSwitch = async (killType: 'IP' | 'PHONE', targetValue: string): Promise<void> => {
    if (!window.confirm(`CRITICAL SYSTEM OVERRIDE: Revoke network access for ${killType}: ${targetValue}?`)) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/v1/admin/security/terminate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: killType, target: targetValue })
      });

      if (response.ok) {
        await fetchSecurityMatrix();
      } else {
        alert("CRITICAL FAULT: Firewall execution vector rejected by backend core.");
      }
    } catch (err) {
      console.error("FIREWALL_OVERRIDE_ABORTED:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-neutral-100 bg-neutral-950 p-2 selection:bg-neutral-800">
      
      
      <div className={`border rounded overflow-hidden transition-colors duration-300 ${
        alerts.length > 0 ? 'border-rose-900 bg-rose-950/10' : 'border-neutral-800 bg-neutral-900/40'
      }`}>
        <div className={`px-4 py-3 border-b flex justify-between items-center ${
          alerts.length > 0 ? 'bg-rose-950/40 border-rose-900' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase">
            <span className={`w-2 h-2 rounded-full ${alerts.length > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
            {alerts.length > 0 ? 'MALICIOUS_ACTIVITY_DETECTED' : 'FIREWALL_STREAM_SECURE'}
          </div>
          <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-bold">
            {alerts.length} TARGETS FOUND
          </span>
        </div>

        <div className="divide-y divide-neutral-900 max-h-[350px] overflow-y-auto">
          {alerts.map((alert, idx) => (
            <div key={idx} className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center text-xs bg-neutral-950/60 hover:bg-neutral-950 transition-colors">
              <div className="lg:col-span-2 font-black tracking-wider text-rose-400">
                // {alert.type}
              </div>
              <div className="lg:col-span-5 text-neutral-300">
                <span className="text-neutral-600">VECTOR:</span> <span className="text-neutral-100 font-bold bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">{alert.source}</span>
                <p className="text-neutral-400 mt-1">{alert.details}</p>
              </div>
              <div className="lg:col-span-2 text-neutral-500 text-[11px] text-right lg:text-left">
                {alert.timestamp}
              </div>
              <div className="lg:col-span-3 text-right">
                <button
                  disabled={isProcessing}
                  onClick={() => executeKillSwitch(alert.kill_type, alert.source)}
                  className="w-full lg:w-auto bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded transition-transform active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-600"
                >
                  Terminate Access
                </button>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-12 text-neutral-600 italic text-xs">
              NO ACTIVE VULNERABILITY FLAGGED BY REDIS INGESTION STREAMS.
            </div>
          )}
        </div>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded overflow-hidden">
        <div className="bg-neutral-950 border-b border-neutral-800 px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
          Isolated Blacklist Registry Pool
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {blockedList.map((blockedValue, index) => (
            <span 
              key={index} 
              className="text-[11px] font-bold bg-neutral-950 text-rose-400 border border-rose-950 px-2.5 py-1 rounded flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-rose-500"></span>
              {blockedValue}
            </span>
          ))}
          {blockedList.length === 0 && (
            <span className="text-xs text-neutral-500 italic">No targets globally quarantined in current runtime.</span>
          )}
        </div>
      </div>

    </div>
  );
}