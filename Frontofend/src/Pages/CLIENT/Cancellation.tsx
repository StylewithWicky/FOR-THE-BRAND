import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CancellationPolicyPage() {
  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      
      {/* MINIMALIST HEADER BAR */}
      <nav className="w-full px-8 md:px-16 py-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <Link to="/c2/v1/plan-trip" className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-amber-500 transition">
          ← Back to Booking 
        </Link>
        <span className="text-[10px] font-mono tracking-[0.2em] text-amber-500 font-bold uppercase">YOLO CONNECT</span>
      </nav>

      {/* CANCELLATION POLICY SECTION */}
      <section className="max-w-4xl mx-auto px-8 py-16 space-y-12">
        <div className="space-y-2">
          <span className="text-[9px] font-mono tracking-[0.4em] text-amber-500 block uppercase"> LEGAL PROTOCOLS</span>
          <h1 className="text-4xl font-serif">Cancellation & Refund Policy </h1>
          <p className="text-xs text-slate-400 font-light max-w-xl">
            Our operational parameters for cancellation requests. Review these financial horizons before locking in tracking assets.
          </p>
        </div>

        {/* POLICY REFERENCE TABLE */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                <th className="p-4 md:p-6">Timeline </th>
                <th className="p-4 md:p-6">Refund </th>
                <th className="p-4 md:p-6 text-right">Operational Penalty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-4 md:p-6 font-serif text-sm text-white">60+ Days Out</td>
                <td className="p-4 md:p-6 text-emerald-400 font-bold">100% Refund</td>
                <td className="p-4 md:p-6 text-right text-slate-500">Zero Processing Cost</td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-4 md:p-6 font-serif text-sm text-white">30 - 59 Days Out</td>
                <td className="p-4 md:p-6 text-amber-400">50% Refund</td>
                <td className="p-4 md:p-6 text-right text-amber-500/70">Loss of Baseline Deposit</td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-4 md:p-6 font-serif text-sm text-white">Under 30 Days</td>
                <td className="p-4 md:p-6 text-rose-400">0% Refund</td>
                <td className="p-4 md:p-6 text-right text-rose-500 font-bold">100% Asset Commitment</td>
              </tr>
            </tbody>
          </table>
        </div>

        <blockquote className="border-l-2 border-amber-500 pl-4 py-1 text-xs text-slate-400 font-mono italic">
          Note: Permit processing operations for mountain gorilla tracks in Rwanda or specialized regional routes are instantly non-refundable upon reservation sequence initiation.
        </blockquote>
      </section>

      <hr className="border-white/5 max-w-5xl mx-auto" />

     
      <section id="tips" className="max-w-5xl mx-auto px-8 py-20 space-y-12">
        <div className="space-y-2">
          <span className="text-[9px] font-mono tracking-[0.4em] text-amber-500 block uppercase"> COURIER COMPASS</span>
          <h2 className="text-3xl font-serif">Travel Tips — YOLO CONNECT</h2>
          <p className="text-xs text-slate-400 font-light">Critical field guidance for exploring East African regional hubs safely.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#101114] border border-white/5 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="text-amber-500 font-mono text-xs tracking-widest font-bold">// 01 / REQUISITES</div>
            <h4 className="text-lg font-serif">Documentation </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Ensure your East Africa Tourist Visa or relevant localized entry passes are saved in physical and cloud formats before arrival. 
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#101114] border border-white/5 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="text-amber-500 font-mono text-xs tracking-widest font-bold">// 02 / RESERVES</div>
            <h4 className="text-lg font-serif">Currency Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              While major design hubs seamlessly interface with card networks, keep minor USD notes or local mobile payment accounts open for local tipping and markets.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#101114] border border-white/5 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="text-amber-500 font-mono text-xs tracking-widest font-bold">// 03 / METRICS</div>
            <h4 className="text-lg font-serif">Seasonal Calibration</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Align your target dates carefully to avoid peak coastal rainy vectors if you are looking for soft, slow rhythm coastal setups.
            </p>
          </div>
        </div>
      </section>

      {/* COMPACT FOOTER */}
      <footer className="bg-[#08090a] border-t border-white/5 py-8 text-center text-[10px] text-slate-600 font-mono tracking-widest">
        YOLO CONNECT  LOG // ALL RIGHTS RESERVED © 2026
      </footer>

    </div>
  );
}