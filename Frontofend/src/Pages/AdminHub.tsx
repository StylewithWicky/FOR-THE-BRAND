import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Settings, Calendar, History, DollarSign, Truck, ShoppingCart, ArrowUpRight, Bell, Search } from "lucide-react";

export default function AdminHub() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-[#1A73E8]/30">
      
      <aside className="w-64 border-r border-white/[0.03] flex flex-col p-10 z-50 bg-black/20 backdrop-blur-2xl">
        <div className="flex items-center gap-3 mb-20 group cursor-pointer">
          <div className="w-1 h-10 bg-[#1A73E8] group-hover:shadow-[0_0_20px_#1A73E8] transition-all duration-500" />
          <img 
            src="/image/YOLO.png"
            alt="YOLO Connect" 
            className="w-20 h-auto transition-all duration-500 drop-shadow-[0_0_8px_rgba(26,115,232,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(26,115,232,0.5)] group-hover:scale-105"
          />
          <p className="text-[8px] font-black tracking-[0.4em] text-zinc-600 uppercase group-hover:text-zinc-400 transition-colors">
            ONLIKEMF-os
          </p>
        </div>

        <nav className="space-y-8 flex-1">
          <NavItem icon={<Home size={18} />} label="Terminal" active onClick={() => navigate('/a1/mdosi/kejayamkuu')} />
          <NavItem icon={<Users size={18} />} label="Personnel" onClick={() => navigate('/a1/mdosi/personnel')} />
          <NavItem icon={<Calendar size={18} />} label="Logbook" onClick={() => navigate('/a1/mdosi/logbook')} />
          <NavItem icon={<History size={18} />} label="Archive" />
        </nav>

        <div className="pt-10 border-t border-white/[0.03]">
          <NavItem icon={<Settings size={18} />} label="System" />
        </div>
      </aside>

      <main className="flex-1 p-20 overflow-y-auto custom-scrollbar studio-bg">
        
        <header className="flex justify-between items-end mb-24">
          <div>
            <p className="text-[#1A73E8] text-[9px] font-black tracking-[0.5em] uppercase mb-6 opacity-50">
              ALWAYS FOR THE BRAND
            </p>
            <h1 className="text-7xl font-black tracking-tighter leading-none mb-2">
              WaGwAn WaDaU!!
            </h1>
            <div className="h-[2px] w-24 bg-[#1A73E8] mt-4" />
          </div>
          
          <div className="flex items-center gap-8 pb-4">
             <button className="p-2 text-zinc-600 hover:text-white transition-all"><Search size={20} strokeWidth={1.5}/></button>
             <button className="relative p-2 text-zinc-600 hover:text-white transition-all">
                <Bell size={20} strokeWidth={1.5} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]" />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl">
          
          <ModuleCard 
            title="FINANCE & INVOICING" 
            desc="Capital flow management and real-time revenue analytics." 
            icon={<DollarSign />} 
            accent="#1A73E8" 
          />

          <ModuleCard 
            title="BOOKING & EVENTS" 
            desc="Guest reservation oversight and venue timeline coordination." 
            icon={<Calendar />} 
            accent="#FFFFFF" 
          />

          <ModuleCard 
            title="LOGISTICS & SCHEDULING" 
            desc="Fleet tracking and automated field-work synchronization." 
            icon={<Truck />} 
            accent="#FF6B00" 
          />

          <ModuleCard 
            title="SHOP & MERCH" 
            desc="Inventory control and brand asset distribution." 
            icon={<ShoppingCart />} 
            accent="#1A73E8" 
          />

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center gap-5 cursor-pointer transition-all duration-500 group
        ${active ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'}
      `}
    >
      <span className={`${active ? 'text-[#1A73E8]' : 'group-hover:text-white transition-colors'}`}>{icon}</span>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{label}</span>
    </div>
  );
}

function ModuleCard({ title, desc, icon, accent }: any) {
  return (
    <div className="group relative bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-white/[0.03] p-12 rounded-sm transition-all duration-700 hover:border-white/[0.08] cursor-pointer overflow-hidden">
      
      <div className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full transition-all duration-700 shadow-[0_0_15px]" style={{ backgroundColor: accent, boxShadow: `0 0 15px ${accent}` }} />

      <div className="flex justify-between items-start mb-16">
        <div className="text-zinc-700 group-hover:text-white transition-all duration-700">
          {React.cloneElement(icon, { size: 30, strokeWidth: 1 })}
        </div>
        <ArrowUpRight size={20} className="text-zinc-900 group-hover:text-zinc-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-700" />
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-black tracking-tighter text-zinc-400 group-hover:text-white transition-all duration-700 mb-3 uppercase italic">
          {title}
        </h3>
        <p className="text-zinc-600 text-xs font-medium leading-relaxed max-w-[280px] group-hover:text-zinc-400 transition-all duration-700">
          {desc}
        </p>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000" style={{ backgroundColor: accent }} />
    </div>
  );
}
 