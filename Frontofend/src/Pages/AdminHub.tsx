import { useState } from "react";
import AuthForm from "../components/LoginForm";
import { s } from "../styles/Auth.styles"
import { DollarSign, Calendar, Truck, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminHub() {
  return (
    <div className="min-h-screen bg-black p-8 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 mt-8 flex justify-between items-end">
          <div>
            <p className="text-[#1A73E8] font-black tracking-[0.4em] uppercase text-[9px] mb-3 flex items-center gap-2">
              <ShieldCheck size={12} /> System Status: Online
            </p>
            <h1 className="text-6xl font-black tracking-tighter text-white">
              Mkubwa <span className="bg-gradient-to-r from-[#1A73E8] to-[#FF6B00] bg-clip-text text-transparent">Terminal</span>
            </h1>
          </div>
          <div className="text-right pb-2">
             <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Maitai Farm Operations</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ModuleCard title="Finance" desc="Revenue & Invoicing" icon={<DollarSign />} accent="#10b981" />
          <ModuleCard title="Fleet" desc="Rarity Car Hire" icon={<Calendar />} accent="#1A73E8" />
          <ModuleCard title="Supply" desc="Dorper Logistics" icon={<Truck />} accent="#FF6B00" />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ title, desc, icon, accent }: any) {
  return (
    <div className="group relative bg-[#0D0D0D] border border-white/5 p-8 rounded-[2.5rem] transition-all hover:border-white/10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] opacity-30" style={{ backgroundColor: accent }} />
      <div className="p-4 w-fit rounded-2xl mb-6" style={{ backgroundColor: `${accent}10`, color: accent }}>
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-2 text-white">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed mb-8 font-medium">{desc}</p>
      <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
        Enter Module <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );
}