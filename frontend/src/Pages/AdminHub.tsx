import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Settings, Calendar, History, DollarSign, Truck, ShoppingCart, ArrowRight, Bell, Search, Menu, X } from "lucide-react";

export default function AdminHub(): React.JSX.Element {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Collapsed completely on mobile, slides in from z-index, handles standard layout on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-slate-200 bg-white p-6 md:p-10 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Close Button - Mobile Only */}
        <div className="flex lg:hidden justify-end mb-4">
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-900">
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-12 lg:mb-16">
          <div className="w-1 h-8 bg-blue-600 rounded-full" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">YOLO Connect OS</span>
        </div>

        <nav className="space-y-6 flex-1">
          <NavItem icon={<Home size={18} />} label="Terminal" active onClick={() => { navigate('/a1/mdosi/kejayamkuu'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Users size={18} />} label="Personnel" onClick={() => { navigate('/a1/mdosi/personnel'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Calendar size={18} />} label="Logbook" onClick={() => { navigate('/a1/mdosi/logbook'); setIsSidebarOpen(false); }} />
          <NavItem icon={<History size={18} />} label="Archive" onClick={() => { navigate('/a1/mdosi/archive'); setIsSidebarOpen(false); }} />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <NavItem icon={<Settings size={18} />} label="System" onClick={() => { navigate('/a1/mdosi/system'); setIsSidebarOpen(false); }} />
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto w-full">
        <header className="flex justify-between items-end mb-10 lg:mb-20">
          <div>
            <div className="flex items-center gap-4 mb-2">
              {/* Hamburger Toggle - Only Visible on Mobile/Tablet viewports */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors p-1 -ml-1"
              >
                <Menu size={24} />
              </button>
              <p className="text-blue-600 text-[10px] font-bold tracking-[0.3em] uppercase pt-0.5">Welcome Back</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">WaGwAn WaDaU!</h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 pb-1">
            <button className="text-slate-400 hover:text-slate-900 transition-colors"><Search size={20}/></button>
            <button className="relative text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
          </div>
        </header>

        {/* Modules Grid - Base 1 column, switches to 2 columns on medium break points and wider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
          <ModuleCard title="Finance & Invoicing" desc="Capital flow management and revenue analytics." icon={<DollarSign />} onClick={() => navigate('/a1/mdosi/finance')} />
          <ModuleCard title="Booking & Events" desc="Guest reservation and venue coordination." icon={<Calendar />} onClick={() => navigate('/a1/mdosi/bookings')} />
          <ModuleCard title="Logistics & Scheduling" desc="Fleet tracking and field-work synchronization." icon={<Truck />} onClick={() => navigate('/a1/mdosi/trips')} />
          <ModuleCard title="Shop & Merch" desc="Inventory control and asset distribution." icon={<ShoppingCart />} onClick={() => navigate('/a1/mdosi/merch')} />
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 cursor-pointer group ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
      <span className={active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900'}>{icon}</span>
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
}

function ModuleCard({ title, desc, icon, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-6 md:mb-10">
        <div className="text-blue-600 bg-blue-50 p-3 md:p-4 rounded-2xl">{React.cloneElement(icon, { size: 24 })}</div>
        <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}