import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import PassportMap from '../../components/PassportMap';

// Improved StatusBadge with borders for better visual weight
const StatusBadge = ({ status }: { status?: string }) => {
  const styles: any = {
    draft: 'bg-slate-800 text-slate-400 border border-slate-700',
    under_review: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    published: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
  };
  const displayStatus = status || 'draft';
  return (
    <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest font-mono ${styles[displayStatus] || 'bg-white/5'}`}>
      {displayStatus.replace('_', ' ')}
    </span>
  );
};

export default function MemberDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const token = localStorage.getItem('yolo_token');
        const res = await fetch('/api/v1/msee/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard:", e);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  // Centralized Navigation Logic
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Assuming you have logic here or via context to detect if member
    // If not, simply routing to your feed:
    navigate('/c2/v1/feed');
  };

  if (loading) return <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center font-mono text-xs animate-pulse">ReLaX NiKuPaNgE...</div>;
  if (!data) return <div className="min-h-screen bg-[#0b0c0e] flex items-center justify-center font-mono text-xs text-red-500">Error: Could not load data.</div>;

  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen font-sans p-6 md:p-12 flex gap-8">
      {/* Sidebar */}
      <aside className="w-80 space-y-6 hidden lg:block">
        <div className="bg-[#0f1115] border border-white/5 rounded-3xl p-8 text-center">
          <QRCodeCanvas value={data?.profile?.id || "N/A"} size={150} bgColor="#0f1115" fgColor="#ffffff" />
          <p className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Your QR Code</p>
        </div>
        <div className="bg-[#0f1115] border border-white/5 rounded-3xl p-6">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono mb-4">TRAVELER PASSPORT</h3>
          <PassportMap locations={data?.visited_locations || []} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow space-y-8">
        <header className="flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h2 className="text-3xl font-serif">WaGwAn, <span className="text-amber-400">{data?.profile?.name}</span></h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">{data?.profile?.tier || "Standard"} Member</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleHomeClick} className="text-[10px] font-mono uppercase text-slate-500 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-xl">
              Home
            </button>
            <NavLink to="/c2/v1/plan-trip" className="bg-amber-500 text-black px-6 py-2 rounded-xl text-xs font-bold uppercase hover:bg-white transition-all">
              + Plan Trip
            </NavLink>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Journeys Section */}
          <section className="bg-[#0f1115] border border-white/5 rounded-3xl p-8">
            <h2 className="text-lg mb-6 font-serif tracking-wide">Recent Journeys</h2>
            <div className="space-y-1">
              {data?.trips?.length > 0 ? (
                data.trips.map((t: any) => (
                  <div key={t.id} className="group flex justify-between items-center py-4 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">{t.name}</span>
                      <span className="text-[9px] uppercase tracking-widest text-slate-600 font-mono mt-0.5">
                        {t.date ? new Date(t.date).toLocaleDateString() : 'Pending'}
                      </span>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-mono text-slate-600 italic">No recent journeys recorded.</p>
              )}
            </div>
          </section>

          <section className="bg-[#0f1115] border border-white/5 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-serif">Community Posts</h2>
              <NavLink to="/c2/v1/create-post" className="text-[10px] font-mono text-amber-500 uppercase hover:text-white transition-colors">
                + New Post
              </NavLink>
            </div>
            <div className="space-y-4">
              {data?.blogs?.length > 0 ? (
                data.blogs.map((b: any) => (
                  <div key={b.id} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm font-mono truncate mr-4">{b.title}</span>
                    <StatusBadge status={b.status} />
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-mono text-slate-600 italic">No posts found. Start sharing your journey.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}