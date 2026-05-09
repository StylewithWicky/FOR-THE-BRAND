import { useState } from "react";
import AuthForm from "../components/LoginForm"
import { s } from "../styles/Hub.css"
import { DollarSign, Calendar, Truck, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminLogin = async (data: any) => {
    // 2026: Replace with actual API call to your FOR-THE-BRAND backend
    console.log("Authenticating Admin...", data);
    await new Promise(r => setTimeout(r, 1500));
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.header}>
            <ShieldCheck className="mx-auto mb-4 text-zinc-900 dark:text-white" size={40} />
            <h1 className={s.title}>Admin Portal</h1>
            <p className={s.subtitle}>Secure access required</p>
          </div>
          <AuthForm onSuccess={handleAdminLogin} buttonText="Access Terminal" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Management Hub</h1>
          <p className="text-zinc-500">Select a module to manage Maitai Farm operations</p>
        </header>

        <div className={s.hubGrid}>
          <ModuleCard 
            title="Finance & Invoicing" 
            desc="Automated billing & AI revenue tracking" 
            icon={<DollarSign />} 
            color="border-emerald-500" 
          />
          <ModuleCard 
            title="Booking & Events" 
            desc="Scheduling for car hire & farm tours" 
            icon={<Calendar />} 
            color="border-blue-500" 
          />
          <ModuleCard 
            title="Logistics" 
            desc="Fleet management & supply chain AI" 
            icon={<Truck />} 
            color="border-amber-500" 
          />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ title, desc, icon, color }: any) {
  return (
    <div className={`${s.hubCard} ${color}`}>
      <div className="p-3 w-fit rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
      <button className="mt-6 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
        Unlock Module →
      </button>
    </div>
  );
}