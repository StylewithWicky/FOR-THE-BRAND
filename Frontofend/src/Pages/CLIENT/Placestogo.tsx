import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Sanctuary {
  id: string | number;
  name: string;
  region: string;
  filterRegion: string;
  coords: string;
  img: string;
  desc: string;
  density: string;
  vibe: string;
}

export default function PlacesToGo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sanctuaries, setSanctuaries] = useState<Sanctuary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const videoSourcePrimary = "/videos/beech.mp4";
  const videoSourceFallback = "/videos/relaxs.mp4";

  const regions: string[] = ['Mainland packages', 'International Packages', 'Coastal packages', 'Day Trips'];
  const [currentRegion, setCurrentRegion] = useState<string>('Mainland packages');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.94]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "64px"]);
  const textParallax = useTransform(scrollYProgress, [0, 0.25], [0, -40]);

  useEffect(() => {
    const fetchSanctuaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = (import.meta.env.VITE_API_URL as string);
        let endpoint = `${API_BASE}/trips/`;
        
        if (currentRegion === 'Mainland packages') {
          endpoint = `${API_BASE}/trips/`;
        } else if (currentRegion === 'Coastal packages') {
          endpoint = `${API_BASE}/trips/?type=coastal`;
        } else if (currentRegion === 'Day Trips') {
          endpoint = `${API_BASE}/sherehe/`;
        } else if (currentRegion === 'International Packages') {
          endpoint = `${API_BASE}/trips/?type=international`;
        }

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('yolo_token') || ''}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        
        const data = await response.json();
        setSanctuaries(data);
      } catch (err: any) {
        setError(err.message || "Failed to sync.");
      } finally {
        setLoading(false);
      }
    };

    fetchSanctuaries();
  }, [currentRegion]);

  return (
    <div ref={containerRef} className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      <motion.header 
        style={{ scale: heroScale, borderRadius: heroRadius }}
        className="relative h-[70vh] md:h-[80vh] flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12 lg:px-24 origin-top overflow-hidden bg-black"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.35] pointer-events-none"
        >
          <source src={videoSourcePrimary} type="video/mp4" />
          <img src={videoSourceFallback} alt="Fallback" className="absolute inset-0 w-full h-full object-cover" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-black/40 z-10 pointer-events-none" />
        
        <nav className="absolute top-0 left-0 w-full px-6 md:px-16 py-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 via-black/20 to-transparent">
          <Link to="/" className="text-lg md:text-xl font-black tracking-[0.2em] text-amber-500 uppercase font-sans">
            Yolo<span className="text-white font-light">Connect</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] text-slate-300 font-bold">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home </Link>
            <Link to="/c2/v1/tings" className="hover:text-amber-400 transition-colors">Things to Do</Link>
          </div>
        </nav>

        <motion.div style={{ y: textParallax }} className="relative z-20 max-w-7xl w-full mx-auto">
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono font-bold block mb-3">TUPIGE LAP PAMOJA</span>
          <h1 className="text-[12vw] md:text-[7vw] font-serif leading-[0.9] tracking-tight text-white max-w-4xl">
            TRAVEL MADE <br /><span className="italic font-normal text-amber-400">EASIER</span>.
          </h1>
        </motion.div>
      </motion.header>

      <section className="py-10 md:py-16 max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start mb-8 md:mb-16 border-b border-white/5 pb-8 relative z-10">
          {regions.map(region => (
            <button
              key={region}
              disabled={loading}
              onClick={() => setCurrentRegion(region)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full uppercase tracking-widest text-[8px] md:text-[9px] font-bold transition-all ${
                currentRegion === region ? 'bg-amber-500 text-black shadow-xl' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              } disabled:opacity-50`}
            >
              {region}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-[30px] md:rounded-[40px] bg-white/[0.01]">
            <p className="font-mono text-xs text-amber-500 uppercase tracking-widest animate-pulse">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 border border-red-500/20 rounded-[30px] md:rounded-[40px] bg-red-500/[0.02]">
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest">Error: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            {sanctuaries.length > 0 ? (
              sanctuaries.map((sanctuary, index) => {
                const isLarge = index % 3 === 0;
                return (
                  <div 
                    key={sanctuary.id || sanctuary.name} 
                    className={`group cursor-pointer border border-white/5 rounded-[30px] md:rounded-[40px] overflow-hidden bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500 ${
                      isLarge ? 'lg:col-span-8' : 'lg:col-span-4'
                    }`}
                  >
                    <div className={`relative overflow-hidden ${isLarge ? 'h-[320px] md:h-[440px]' : 'h-[280px] md:h-[320px]'}`}>
                      <img src={sanctuary.img} alt={sanctuary.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-black/10 to-transparent" />
                      <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[8px] md:text-[9px] font-mono tracking-wider">
                        {sanctuary.coords}
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                      <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                        <span>{sanctuary.region}</span>
                        <span className="text-amber-500/80">{sanctuary.vibe}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-amber-400 transition-colors">{sanctuary.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">{sanctuary.desc}</p>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] md:text-[10px] font-mono text-slate-500">
                        <span>Crowd Index: <span className="text-slate-300">{sanctuary.density}</span></span>
                        <span className="group-hover:translate-x-1 transition-transform">Inquire →</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="lg:col-span-12 text-center py-24 border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
                <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">No results found.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="bg-[#08090a] border-t border-white/5 py-12 text-center text-xs text-slate-500 font-mono">
        <div>© 2026 YOLO CONNECT.TUPIGE LAP PAMOJA</div>
      </footer>
    </div>
  );
}