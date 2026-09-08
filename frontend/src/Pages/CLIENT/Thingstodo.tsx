import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Experience {
  title: string;
  energy: number;
  tag: string;
  text: string;
  length: string;
  focus: string;
}

export default function ThingsToDo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [kineticThreshold, setKineticThreshold] = useState(50);
  const [dayTrips, setDayTrips] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.94]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "64px"]);
  const textParallax = useTransform(scrollYProgress, [0, 0.25], [0, -40]);

  useEffect(() => {
    const fetchBackendDayTrips = async (selectedCategory= '') => {
      try {
        setLoading(true);
        const API_BASE = (import.meta as any).env.VITE_API_URL;
        const url = selectedCategory 
      ? `${API_BASE}/sherehe/?category=${selectedCategory}` 
      : `${API_BASE}/sherehe/`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Dropped sherehe frame stack");
        
        const data = await response.json();
        const mappedTrips = data.map((item: any) => {
          let energyScore = 45;
          const loc = (item.location || '').toLowerCase();
          const name = (item.name || '').toLowerCase();
          
      if (item.category === 'calm') {
        energyScore = 25;
      } else if (item.category === 'mid') {
        energyScore = 65;
      } else if (item.category === 'adrenaline') {
        energyScore = 85;
      }

          return {
            title: item.name || "Untitled Form",
            energy: energyScore,
            tag: item.category?.toUpperCase() || 'SHEREHE ARCHIVE',
            text: item.description || `Strictly unscripted behavior setup at ${item.location || 'the plot'}. No bad vibes allowed.`,
            length: item.duration || 'Full Day',
            focus: item.location || 'Nairobi Base'
          };
        });
        setDayTrips(mappedTrips);
      } catch (err) {
        console.error("Backend failed to sync sherehe logs.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBackendDayTrips();
  }, []);

  const filteredExperiences = dayTrips.filter(exp => {
    if (kineticThreshold < 40) return exp.energy <= 40;
    if (kineticThreshold > 70) return exp.energy >= 65;
    return exp.energy > 25 && exp.energy <= 65;
  });

  return (
    <div ref={containerRef} className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <motion.header 
        style={{ scale: heroScale, borderRadius: heroRadius }}
        className="relative h-[85vh] flex flex-col justify-end pb-24 px-12 lg:px-24 origin-top overflow-hidden bg-black"
      >
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-[0.38] pointer-events-none">
          <source src="/videos/Yolos.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-41614-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-black/10 to-black/60 z-10 pointer-events-none" />

        <nav className="absolute top-0 left-0 w-full px-8 md:px-16 py-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/70 via-black/20 to-transparent">
          <Link to="/" className="text-xl font-black tracking-[0.2em] text-amber-500 uppercase">
            Yolo<span className="text-white font-light">Connect</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] text-slate-300 font-bold">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <Link to="/c2/v1/placestogo" className="hover:text-amber-400 transition-colors">Places to Go</Link>
          </div>
        </nav>

        <motion.div style={{ y: textParallax }} className="relative z-10 max-w-7xl w-full mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono font-bold block mb-1">For The Brand , By The Brand , With the Brand.</span>
          <h1 className="text-[6.5vw] font-serif leading-[0.95] tracking-tight text-white max-w-5xl">
            Sherehe na Maform: <br />
            <span className="italic font-normal text-amber-400 font-serif">You Only Live Once.</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wide max-w-md pt-4 lowercase">
            Living life for the plot. Vibes on Vibes, unscripted behavior setups, and the art of flow curation.
          </p>
        </motion.div>
      </motion.header>

      {/* FILTER SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-8 text-center space-y-8">
        <div className="space-y-2">
          <h3 className="text-xl font-serif tracking-wide">Choose your own Vibe</h3>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Slide the line to choose your preferred vibe</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-6 shadow-2xl">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-mono font-bold px-2 text-slate-400">
            <span className={`${kineticThreshold <= 40 ? 'text-amber-400 font-bold' : ''}`}>Chill & Calm</span>
            <span className={`${kineticThreshold > 40 && kineticThreshold <= 70 ? 'text-amber-400 font-bold' : ''}`}>Mid</span>
            <span className={`${kineticThreshold > 70 ? 'text-amber-400 font-bold' : ''}`}>Adrenaline</span>
          </div>
          <input type="range" min="10" max="100" value={kineticThreshold} onChange={(e) => setKineticThreshold(Number(e.target.value))} className="w-full accent-amber-500 bg-zinc-800 h-1 rounded-full cursor-pointer appearance-none" />
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="pb-32 px-8 max-w-7xl mx-auto">
        <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-mono font-bold mb-12">Available Forms ({filteredExperiences.length})</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="text-sm font-mono text-zinc-500 animate-pulse">Scanning ...</div>
          ) : filteredExperiences.map((exp, idx) => (
            <div key={`${exp.title}-${idx}`} className="bg-[#101114] border border-white/5 h-[480px] rounded-[48px] p-10 flex flex-col justify-between shadow-2xl hover:border-amber-500/20 transition-all duration-300 group">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-mono opacity-40">Index: 0{exp.energy}</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider bg-white/5 text-amber-400 px-3 py-1 rounded-full">{exp.tag}</span>
                </div>
                <h4 className="text-2xl font-serif mb-4 text-zinc-100">{exp.title}</h4>
                <p className="text-xs opacity-75 font-light text-slate-300 line-clamp-3">{exp.text}</p>
              </div>

              <a 
                href={`https://wa.me/254111782146?text=Hi YOLO Connect! I'm interested in booking the ${encodeURIComponent(exp.title)} experience.`}
                target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-4 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all duration-300"
              >
                Secure Your Spot
              </a>

              <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                <span>Timeline: <span className="text-slate-300">{exp.length}</span></span>
                <span className="truncate text-right">Loc: <span className="text-slate-300">{exp.focus}</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#08090a] border-t border-white/5 py-12 text-center text-xs text-slate-500 font-mono">
        © 2026 YOLO CONNECT. NO BAD VIBES.
      </footer>
    </div>
  );
}
 