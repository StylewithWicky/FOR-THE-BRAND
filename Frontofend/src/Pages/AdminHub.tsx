import { useState } from "react";
import AuthForm from "../components/LoginForm";
import { s } from "../styles/Auth.styles"
import { DollarSign, Calendar, Truck, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminLogin = async (data: any) => {
    console.log("Authenticating Admin...", data);
    // Simulate high-security check
    await new Promise(r => setTimeout(r, 1500));
    setIsAuthenticated(true);
  };

  // 1. SECURE LOGIN STATE (Matching your login form style)
  if (!isAuthenticated) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.header}>
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-[#1A73E8] to-[#FF6B00] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className={s.title}>Admin Portal</h1>
            <p className={s.subtitle}>Level 4 Authorization Required</p>
          </div>
          <AuthForm onSuccess={handleAdminLogin} />
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED HUB STATE
  return (
    <div className="min-h-screen bg-black p-8 selection:bg-[#FF6B00]/30">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 mt-8">
          <p className="text-[#1A73E8] font-black tracking-[0.3em] uppercase text-[10px] mb-2">Management Terminal</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-white mb-4">
            Operations <span className="bg-gradient-to-r from-[#1A73E8] to-[#FF6B00] bg-clip-text text-transparent">Hub</span>
          </h1>
          <p className="text-zinc-500 max-w-md">Real-time control for Maitai Farm & Rarity Logistics.</p>
        </header>

        {/* Using a standard grid since s.hubGrid might be custom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ModuleCard 
            title="Finance & Invoicing" 
            desc="Automated billing, crop revenue tracking, and car hire statements." 
            icon={<DollarSign />} 
            accent="#10b981" // Emerald
          />
          <ModuleCard 
            title="Booking & Events" 
            desc="Manage scheduling for Rarity fleet and Maitai Farm tours." 
            icon={<Calendar />} 
            accent="#1A73E8" // YOLO Blue
          />
          <ModuleCard 
            title="Logistics" 
            desc="Dorper sheep supply chain and fleet maintenance schedules." 
            icon={<Truck />} 
            accent="#FF6B00" // YOLO Orange
          />
        </div>
      </div>
    </div>
  );
}

// 3. REFACTORED MODULE CARD
function ModuleCard({ title, desc, icon, accent }: { title: string; desc: string; icon: React.ReactNode; accent: string }) {
  return (
    <div 
      className="group relative bg-[#0D0D0D] border border-white/5 p-8 rounded-[2.5rem] transition-all hover:-translate-y-2 hover:border-white/10 overflow-hidden"
    >
      {/* Dynamic Accent Glow */}
      <div 
        className="absolute top-0 left-0 w-full h-1 opacity-50 transition-all group-hover:h-2" 
        style={{ backgroundColor: accent }} 
      />
      
      <div 
        className="p-4 w-fit rounded-2xl mb-6 transition-all group-hover:scale-110" 
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-8">{desc}</p>
      
      <button 
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group-hover:gap-4"
        style={{ color: accent }}
      >
        Unlock Module <ArrowRight size={14} />
      </button>
    </div>
  );
}