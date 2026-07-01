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
  const [kineticThreshold, setKineticThreshold] = useState(50); // Dial slider state from 10 to 100
  const [dayTrips, setDayTrips] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.94]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "64px"]);
  const textParallax = useTransform(scrollYProgress, [0, 0.25], [0, -40]);

  // Fetching live data from the /api/v1/sherehe endpoint
  useEffect(() => {
    const fetchBackendDayTrips = async () => {
      try {
        setLoading(true);
        const API_BASE = (import.meta as any).env.VITE_API_URL 
        
        // Clean trailing slash to bypass the 307 redirect latency loop
        const response = await fetch(`${API_BASE}/sherehe/`);
        if (!response.ok) throw new Error("Dropped sherehe frame stack");
        
        const data = await response.json();
        
        const mappedTrips = data.map((item: any) => {
          // Dynamic energy scale mapping based on typical Kenyan locations or tags
          let energyScore = 45; 
          const loc = (item.location || '').toLowerCase();
          const name = (item.name || '').toLowerCase();
          
          if (loc.includes('kilifi') || loc.includes('lamu') || name.includes('chill') || name.includes('sunset')) {
            energyScore = 25; // Chill coastal rhythms & hidden sanctuaries
          } else if (loc.includes('nairobi') || name.includes('club') || name.includes('circuit')) {
            energyScore = 65; // Active urban energy
          } else if (loc.includes('crater') || loc.includes('rift') || name.includes('hike') || name.includes('safari')) {
            energyScore = 85; // Out-of-town active maform
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

  // Filter backend day trips using the custom energy thresholds
  const filteredExperiences = dayTrips.filter(exp => {
    if (kineticThreshold < 40) {
      return exp.energy <= 40; 
    }
    if (kineticThreshold > 70) {
      return exp.energy >= 65; 
    }
    return exp.energy > 25 && exp.energy <= 65; 
  });

  return (
    <div ref={containerRef} className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      
      {/* HERO SECTION WITH DUAL SOURCE VIDEO FALLBACK PIPELINE */}
      <motion.header 
        style={{ scale: heroScale, borderRadius: heroRadius }}
        className="relative h-[85vh] flex flex-col justify-end pb-24 px-12 lg:px-24 origin-top overflow-hidden bg-black"
      >
        {/* GPU-Accelerated HTML5 Video Container */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.38] pointer-events-none"
        >
          {/* PRIMARY VIDEO SOURCE: Your local downloaded Instagram Reel asset */}
          <source src="/videos/Yolos.mp4" type="video/mp4" />
          
          {/* FALLBACK VIDEO SOURCE: Direct web stream network option */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-41614-large.mp4" type="video/mp4" />
          
          Your browser does not support the video tag.
        </video>
        
        {/* Dark Vignette Overlay Matrix to preserve textual legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-black/10 to-black/60 z-10 pointer-events-none" />

        <nav className="absolute top-0 left-0 w-full px-8 md:px-16 py-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/70 via-black/20 to-transparent">
          <Link to="/" className="text-xl font-black tracking-[0.2em] text-amber-500 uppercase font-sans">
            Yolo<span className="text-white font-light">Connect</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] text-slate-300 font-bold">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home </Link>
            <Link to="/c2/v1/placestogo" className="hover:text-amber-400 transition-colors">Places to Go</Link>
          </div>
        </nav>

        <motion.div style={{ y: textParallax }} className="relative z-10 max-w-7xl w-full mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-mono font-bold block mb-1">
            For The Brand , By The Brand , With the Brand.
          </span>
          <h1 className="text-[6.5vw] font-serif leading-[0.95] tracking-tight text-white max-w-5xl">
            Sherehe na Maform: <br />
            <span className="italic font-normal text-amber-400 font-serif">You Only Live Once.</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wide max-w-md pt-4 lowercase">
            wacha ikae ngumu. Living life for the plot . Vibes on Vibes , unscripted behavior setups, and the art of flow curation. This is your gateway to the most dynamic, unscripted, and vibe-rich experiences across Kenya.
          </p>
        </motion.div>
      </motion.header>

      {/* THE VIBE CALIBRATION DIAL */}
      <section className="py-20 max-w-4xl mx-auto px-8 text-center space-y-8">
        <div className="space-y-2">
          <h3 className="text-xl font-serif tracking-wide">Calibrate Your Sherehe Horizon</h3>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Slide the vector line to map out your current mood profile</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-6 shadow-2xl">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-mono font-bold px-2 text-slate-400">
            <span className={`${kineticThreshold <= 40 ? 'text-amber-400 font-bold' : ''}`}>Rhythm & Roots</span>
            <span className={`${kineticThreshold > 40 && kineticThreshold <= 70 ? 'text-amber-400 font-bold' : ''}`}>Active Form Baseline</span>
            <span className={`${kineticThreshold > 70 ? 'text-amber-400 font-bold' : ''}`}>Out-of-Town Energy</span>
          </div>
          
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={kineticThreshold} 
            onChange={(e) => setKineticThreshold(Number(e.target.value))}
            className="w-full accent-amber-500 bg-zinc-800 h-1 rounded-full cursor-pointer appearance-none"
          />
        </div>
      </section>

      {/* DYNAMIC SWIPEABLE CARDS LAYOUT */}
      <section className="pb-32 overflow-visible">
        <div className="max-w-7xl mx-auto px-8 mb-8">
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-mono font-bold">
            Day Trips ({filteredExperiences.length})
          </h4>
        </div>

        <div className="overflow-x-auto scrollbar-none select-none active:cursor-grabbing">
          <div className="flex gap-8 px-8 md:px-24 pb-12 w-max">
            {loading && dayTrips.length === 0 ? (
              <div className="text-sm font-mono text-zinc-500 pl-4 animate-pulse">Scanning backend database logs for active forms...</div>
            ) : filteredExperiences.length === 0 ? (
              <div className="text-sm font-mono text-zinc-500 pl-4">Hakuna plot hapa right now. Adjust the slider to see different energy tiers.</div>
            ) : (
              filteredExperiences.map((exp, idx) => (
                <div
                  key={`${exp.title}-${idx}`}
                  className="bg-[#101114] border border-white/5 w-[310px] md:w-[380px] h-[420px] rounded-[48px] p-10 flex flex-col justify-between shadow-2xl hover:border-amber-500/20 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono opacity-40 group-hover:text-amber-500/60 transition-colors">
                      Vibe Index: 0{exp.energy}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider bg-white/5 text-amber-400 px-3 py-1 rounded-full">
                      {exp.tag}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-serif mb-4 text-zinc-100 leading-snug group-hover:text-white transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-xs opacity-75 leading-relaxed font-light text-slate-300 line-clamp-4">
                      {exp.text}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                    <span>Timeline: <span className="text-slate-300">{exp.length}</span></span>
                    <span className="max-w-[180px] truncate text-right">Location: <span className="text-slate-300">{exp.focus}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#08090a] border-t border-white/5 py-12 text-center text-xs text-slate-500 font-mono">
        <div>© 2026 YOLO CONNECT. NO BAD VIBES.</div>
      </footer>

    </div>
  );
}
 