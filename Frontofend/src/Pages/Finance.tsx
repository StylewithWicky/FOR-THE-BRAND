import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axiosClient from '../api/axiosClients';
import SecurityGuard from '../admin/SecurityGuard';

export default function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'RECONCILIATION' | 'SYSTEM_SECURITY'>('RECONCILIATION');
  const navigate = useNavigate();

  const fetchFinanceLedger = async () => {
    try {
      const response = await axiosClient.get('/madoo/invoices');
      setInvoices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("FINANCE_SYNC_FAULT:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceLedger();
    const interval = setInterval(fetchFinanceLedger, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8 lg:p-20">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/a1/mdosi/kejayamkuu')} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors uppercase text-[10px] font-bold tracking-widest mb-8 lg:mb-12"
      >
        <ChevronLeft size={16} /> Back to Hub
      </button>

      {/* Header Viewport Container */}
      <div className="max-w-7xl mx-auto mb-8 lg:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-blue-600 text-[10px] font-bold tracking-[0.3em] uppercase mb-1 lg:mb-2">Financial Settlement</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">Settlement Workspace</h1>
        </div>

        {/* Tab Controls - Full width on ultra-small screens, auto-width on larger devices */}
        <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm flex w-full sm:w-auto justify-center sm:justify-start">
          <button 
            onClick={() => setActiveTab('RECONCILIATION')} 
            className={`flex-1 sm:flex-none text-center px-6 py-2 rounded-full text-[10px] font-bold uppercase transition-all ${activeTab === 'RECONCILIATION' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            Ledger
          </button>
          <button 
            onClick={() => setActiveTab('SYSTEM_SECURITY')} 
            className={`flex-1 sm:flex-none text-center px-6 py-2 rounded-full text-[10px] font-bold uppercase transition-all ${activeTab === 'SYSTEM_SECURITY' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            Firewall
          </button>
        </div>
      </div>

      {activeTab === 'RECONCILIATION' ? (
        <div className="max-w-7xl mx-auto">
          {/* Table / Card Container */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="w-full">
              <table className="w-full text-left border-collapse">
                {/* Desktop and Tablet Table Header - Hidden completely on Mobile */}
                <thead className="hidden md:table-header-group">
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="p-6">Invoice ID</th>
                    <th className="p-6">Client Name</th>
                    <th className="p-6 text-right">Amount</th>
                    <th className="p-6 text-center">Status</th>
                  </tr>
                </thead>
                
                {/* Body Component: Acts as standalone cards on mobile, tables on desktop */}
                <tbody className="block md:table-row-group divide-y divide-slate-100 font-semibold text-slate-600">
                  {isLoading ? (
                    <tr className="block md:table-row">
                      <td colSpan={4} className="p-12 text-center block md:table-cell text-xs text-slate-400">
                        Syncing ledger...
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr className="block md:table-row">
                      <td colSpan={4} className="p-12 text-center block md:table-cell text-xs text-slate-400">
                        No invoices found.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr 
                        key={inv.id} 
                        className="block md:table-row hover:bg-blue-50/30 transition-colors p-4 sm:p-6 md:p-0 flex flex-col gap-2 relative border-b border-slate-100 last:border-0 md:border-b-0"
                      >
                        {/* Invoice Number */}
                        <td className="md:p-6 text-blue-600 font-bold text-sm md:text-xs block md:table-cell">
                          <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Invoice ID</span>
                          #{inv.invoice_number}
                        </td>

                        {/* Client Identity Column */}
                        <td className="md:p-6 text-xs block md:table-cell">
                          <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Client Name</span>
                          {inv.client_name || "N/A"}
                        </td>

                        {/* Financial Amount Value */}
                        <td className="md:p-6 md:text-right text-sm md:text-xs font-bold text-slate-900 md:text-slate-600 block md:table-cell">
                          <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 font-semibold">Amount</span>
                          KES {inv.amount_due ? inv.amount_due.toLocaleString() : "0"}
                        </td>

                        {/* Settlement Status Pillar Tag */}
                        <td className="md:p-6 md:text-center block md:table-cell mt-1 md:mt-0 absolute top-4 right-4 md:static">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <SecurityGuard />
        </div>
      )}
    </div>
  );
}