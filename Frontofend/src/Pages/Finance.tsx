import React, { useState, useEffect } from 'react';
import SecurityGuard from '../admin/SecurityGuard';

interface InvoiceAsset {
  id: string;
  invoice_number: string;
  client_name: string;
  package_name: string;
  amount_due: number;
  amount_paid: number;
  status: 'PENDING' | 'PAID';
  settled_at: string | null;
  mpesa_receipt: string | null;
}

export default function FinancePage() {
  const [invoices, setInvoices] = useState<InvoiceAsset[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceAsset | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'RECONCILIATION' | 'SYSTEM_SECURITY'>('RECONCILIATION');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFinanceLedger = async () => {
    try {
      const response = await fetch('/api/v1/admin/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data || []);
      }
    } catch (err) {
      console.error("FINANCE_NODE_SYNC_FAULT:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceLedger();
    const interval = setInterval(fetchFinanceLedger, 5000);
    return () => clearInterval(interval);
  }, []);

  const packageMetrics = invoices.reduce<Record<string, { count: number; revenue: number }>>((acc, inv) => {
    if (inv.status === 'PAID') {
      const tier = inv.package_name || 'UNASSIGNED';
      if (!acc[tier]) acc[tier] = { count: 0, revenue: 0 };
      acc[tier].count += 1;
      acc[tier].revenue += inv.amount_paid;
    }
    return acc;
  }, {});

  const grossCollected = invoices
    .filter(i => i.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount_paid, 0);

  const outstanding = invoices
    .filter(i => i.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount_due, 0);

  const displayedInvoices = invoices.filter(inv => 
    selectedTier === 'ALL' ? true : inv.package_name === selectedTier
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#050505] text-zinc-500 font-mono flex items-center justify-center text-xs tracking-widest animate-pulse">
        // INITIALIZING_FINANCIAL_WORKSPACE_NODE...
      </div>
    );
  }

  return (
    <div className="w-full bg-[#050505] text-white min-h-screen p-16 font-mono tracking-tight selection:bg-[#1A73E8]/30">
      
      <header className="border-b border-white/[0.03] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[#1A73E8] text-[9px] font-black tracking-[0.5em] uppercase mb-3 opacity-60">
            NODE_FINANCE_INVOICING
          </p>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
            Settlement Workspace
          </h1>
        </div>
        
        <div className="flex gap-1 bg-neutral-900/60 p-1 border border-white/[0.03] rounded-sm text-xs font-bold backdrop-blur-md">
          <button
            onClick={() => setActiveTab('RECONCILIATION')}
            className={`px-4 py-2 uppercase transition-all duration-300 ${activeTab === 'RECONCILIATION' ? 'bg-white text-black font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Ledger & Cohorts
          </button>
          <button
            onClick={() => setActiveTab('SYSTEM_SECURITY')}
            className={`px-4 py-2 uppercase transition-all duration-300 ${activeTab === 'SYSTEM_SECURITY' ? 'bg-white text-black font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Firewall Guard
          </button>
        </div>
      </header>

      {activeTab === 'RECONCILIATION' ? (
        <div className="space-y-10 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0A0A0A] border border-white/[0.03] p-8 rounded-sm relative group overflow-hidden">
              <div className="absolute left-0 top-0 w-[1px] h-0 group-hover:h-full bg-[#1A73E8] transition-all duration-500" />
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gross Capital Liquidated</div>
              <div className="text-3xl font-black text-white tracking-tighter mt-2">KES {grossCollected.toLocaleString()}</div>
              <div className="text-[9px] text-emerald-400 font-bold mt-2 tracking-wider">// {invoices.filter(i => i.status === 'PAID').length} BALANCES RECONCILED</div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.03] p-8 rounded-sm relative group overflow-hidden">
              <div className="absolute left-0 top-0 w-[1px] h-0 group-hover:h-full bg-[#FF6B00] transition-all duration-500" />
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Unsettled Balances (In-Flight)</div>
              <div className="text-3xl font-black text-[#FF6B00] tracking-tighter mt-2">KES {outstanding.toLocaleString()}</div>
              <div className="text-[9px] text-zinc-600 font-bold mt-2 tracking-wider">// AWAITING CALLBACK STREAM</div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.03] p-8 rounded-sm relative group overflow-hidden">
              <div className="absolute left-0 top-0 w-[1px] h-0 group-hover:h-full bg-white transition-all duration-500" />
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Operational Integrity</div>
              <div className="text-3xl font-black text-white tracking-tighter mt-2">100.0%</div>
              <div className="text-[9px] text-zinc-600 font-bold mt-2 tracking-wider">// PLATFORM AUTO-AUDIT ACTIVE</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.keys(packageMetrics).map((tier) => (
              <div 
                key={tier}
                onClick={() => setSelectedTier(tier === selectedTier ? 'ALL' : tier)}
                className={`cursor-pointer p-6 rounded-sm border transition-all duration-500 ${
                  selectedTier === tier ? 'bg-white text-black border-white' : 'bg-[#0A0A0A] text-zinc-400 border-white/[0.03] hover:border-white/[0.08]'
                }`}
              >
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider">
                  <span>Tiers // {tier}</span>
                  <span className={selectedTier === tier ? 'bg-black text-white px-1.5 py-0.5 rounded-sm' : 'text-zinc-500'}>{packageMetrics[tier].count} PAX</span>
                </div>
                <div className={`text-xl font-black tracking-tighter mt-2 ${selectedTier === tier ? 'text-black' : 'text-white'}`}>
                  KES {packageMetrics[tier].revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/[0.03] rounded-sm overflow-hidden">
              <div className="px-6 py-4 bg-black/40 border-b border-white/[0.03] flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ACTIVE MANIFEST STREAM // {selectedTier}</span>
                <span className="text-[10px] text-zinc-600 font-mono">COUNT: {displayedInvoices.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.03] text-zinc-500 font-bold uppercase text-[10px] bg-black/20">
                      <th className="p-5 font-black tracking-wider">Invoice</th>
                      <th className="p-5 font-black tracking-wider">Recipient Name</th>
                      <th className="p-5 font-black tracking-wider text-right">Target Amount</th>
                      <th className="p-5 font-black tracking-wider text-center">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.01]">
                    {displayedInvoices.map((inv) => (
                      <tr 
                        key={inv.id} 
                        onClick={() => setSelectedInvoice(inv)}
                        className={`cursor-pointer transition-all duration-300 ${selectedInvoice?.id === inv.id ? 'bg-[#1A73E8]/10 text-white' : 'hover:bg-black/40'}`}
                      >
                        <td className="p-5 font-bold tracking-wider text-[#1A73E8]">#{inv.invoice_number}</td>
                        <td className="p-5 truncate max-w-[140px] text-zinc-300">{inv.client_name}</td>
                        <td className="p-5 font-black text-right text-zinc-100">KES {inv.amount_due.toLocaleString()}</td>
                        <td className="p-5 text-center">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm border ${
                            inv.status === 'PAID' 
                              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/40' 
                              : 'bg-amber-950/20 text-amber-500 border-amber-900/40 animate-pulse'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {displayedInvoices.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-zinc-600 italic text-xs">
                          NO VERIFIED TRANSACTION LOGS INSIDE CURRENT CRITERIA POOL.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/[0.03] rounded-sm p-8 space-y-6 relative">
              {selectedInvoice ? (
                <div className="space-y-5 text-xs animate-fade-in">
                  <div className="border-b border-white/[0.03] pb-3">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">// TRACE REFERENCE</span>
                    <h3 className="text-xl font-black text-white tracking-tighter mt-1">#{selectedInvoice.invoice_number}</h3>
                  </div>
                  
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between border-b border-white/[0.01] pb-2">
                      <span className="text-zinc-500">Client:</span>
                      <span className="text-white font-bold">{selectedInvoice.client_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.01] pb-2">
                      <span className="text-zinc-500">Allocation:</span>
                      <span className="text-[#1A73E8] font-bold uppercase text-[10px] tracking-wider">{selectedInvoice.package_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.01] pb-2">
                      <span className="text-zinc-500">Required:</span>
                      <span className="text-white font-bold">KES {selectedInvoice.amount_due.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.01] pb-2">
                      <span className="text-zinc-500">Cleared:</span>
                      <span className="text-emerald-400 font-bold">KES {selectedInvoice.amount_paid.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <span className="text-zinc-500">M-Pesa Token Verification:</span>
                      <span className="bg-black text-[11px] px-3 py-2 border border-white/[0.03] rounded-sm font-bold text-zinc-300 text-center block tracking-widest selection:bg-neutral-800">
                        {selectedInvoice.mpesa_receipt || 'WAITING_CALLBACK_INJECT'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-600 italic py-16 text-xs">
                  SELECT RUNTIME ROW LOG ITEM TO VIEW DETAILED NETWORK DISCHARGE TRAIL.
                </div>
              )}
            </div>
          </div>
          
        </div>
      ) : (
        <SecurityGuard />
      )}
    </div>
  );
}