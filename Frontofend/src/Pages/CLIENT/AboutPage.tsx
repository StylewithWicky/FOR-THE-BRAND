import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Viewport Scroll Engine Calculations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 2. Parallax maps for multi-speed visual element tracking
  const scaleHero = useTransform(scrollYProgress, [0, 0.15], [1, 0.94]);
  const radiusHero = useTransform(scrollYProgress, [0, 0.15], ["0px", "56px"]);
  const layerUp = useTransform(scrollYProgress, [0.1, 0.5], [60, -60]);
  const layerDown = useTransform(scrollYProgress, [0.1, 0.5], [-40, 40]);

  const clientPillars = [
    { num: '01', title: 'The Soft Current', text: 'We bypass the loud, generic tourist grids. Real magnetism is quiet, shifting you seamlessly into authentic cultural exchanges led by those who hold the keys.' },
    { num: '02', title: 'Curated Intimacy', text: 'Tailor-made itineraries built around lifestyle, timing, and unhurried rhythm. From secret coastal hideaways to private savanna expeditions.' },
    { num: '03', title: 'Uncompromising Comfort', text: 'Premium, understated hospitality. Safe, effortless transit and design-forward boutique lodging hand-picked for architectural character.' },
    { num: '04', title: 'Flawless Interface', text: 'One elegant dashboard. Track landmark bookings, coordinate seasonal trends, and handle your entire travel matrix in a single motion.' }
  ];

  return (
    <div ref={containerRef} className="bg-[#0b0c0e] text-white min-h-screen font-sans overflow-x-hidden selection:bg-amber-500">
      
      
      
      <motion.header 
        style={{ scale: scaleHero, borderRadius: radiusHero }}
        className="relative h-[85vh] flex flex-col justify-end pb-24 px-8 md:px-16 origin-top overflow-hidden z-10"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1500')] bg-cover bg-center brightness-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-transparent opacity-90" />
        
        <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 items-end gap-12">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-amber-500 font-bold block mb-4"> The Art of Gathering</span>
            <h1 className="text-[7vw] md:text-[5vw] font-serif tracking-tight leading-[0.9] text-white">
              Gather Outside<br /><span className="italic font-normal text-amber-400">The Known Lines</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm md:justify-self-end">
            YOLO Connect is an elite tour and events collective. We orchestrate unforgettable live experiences that bridge the gap between human curiosity and authentic cultural connection.
          </p>
        </div>
      </motion.header>

     
      <section className="py-32 max-w-7xl mx-auto px-8 relative z-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight">
              Whether you are a history addict, nature lover, a foodie, or adventure-seeker, <span className="italic text-amber-400">YOLO has something for you.</span>
            </h2>
            <p className="text-slate-400 font-light text-base leading-relaxed max-w-xl">
              From breathtaking high-altitude monastical horizons to artisan culinary workshops, we bypass the generic tourist grids to ground you directly with the people who know this land like the back of their hand. No filters, no loud itineraries—just pure, unforgettable connection.
            </p>
          </div>
          
          <motion.div 
            style={{ y: layerUp }}
            className="lg:col-span-5 h-[340px] rounded-[40px] overflow-hidden bg-cover bg-center shadow-2xl hidden lg:block bg-[url('https://images.unsplash.com/photo-1589979482837-e74f2e145060?q=80&w=600')]" // Diani Beach
          />
        </div>
      </section>

      {/* 4. ASYMMETRIC PICTURE PARALLAX MATRICES */}
      <section className="py-16 max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[280px]">
          
          {/* Left Column: Fort Jesus Historical Textures */}
          <motion.div 
            style={{ y: layerDown }}
            className="rounded-[44px] overflow-hidden bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1627589886749-de5cb0df70bc?q=80&w=600')]" // Fort Jesus coastal walls
          />
          
          {/* Center Column: Golden Maasai Mara Horizon */}
          <div className="rounded-[44px] overflow-hidden relative md:row-span-2 group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800" // Maasai Mara
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
              alt="Maasai Mara Horizon"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">// The Great Wilderness</span>
              <h4 className="text-xl font-serif text-white mt-1">Maasai Mara Core</h4>
            </div>
          </div>
          
          {/* Right Column: Diani White Sands Palm Drift */}
          <motion.div 
            style={{ y: layerUp }}
            className="rounded-[44px] overflow-hidden bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600')]" // Diani sandy tracks
          />
          
        </div>
      </section>

      {/* 5. THE SERVICE NUMERICAL SECTION */}
      <section className="py-32 max-w-7xl mx-auto px-8">
        <div className="mb-20">
          <span className="text-xs font-mono uppercase text-slate-500 tracking-widest">Our Guiding Matrix</span>
          <h3 className="text-4xl font-serif mt-2">The Philosophy of Flow</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientPillars.map((pillar, i) => (
            <div 
              key={i} 
              className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between min-h-[340px] hover:border-amber-500/20 transition-all duration-500 group hover:bg-white/[0.04]"
            >
              <span className="font-mono text-xs text-amber-500/60 font-bold group-hover:text-amber-400 transition-colors">
                // {pillar.num}
              </span>
              <div className="space-y-4">
                <h4 className="text-xl font-serif tracking-tight text-white/90">{pillar.title}</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{pillar.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION MODULE */}
      <section className="py-24 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-5xl mx-auto px-8 text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-amber-500 font-bold">Initiate Your Escape</span>
          <h2 className="text-4xl md:text-5xl font-serif max-w-3xl mx-auto leading-tight">
            Ready to experience the unwritten side of <span className="italic text-amber-400">the land?</span>
          </h2>
          <p className="text-sm text-slate-400 font-light max-w-xl mx-auto leading-relaxed">
            Get in touch with an elite travel liaison today. Whether charting private historical paths, designing coastal festivals, or accessing off-grid wildlife reserves, we handle the logistics so you can live the experience.
          </p>
          <div className="pt-6">
            <Link to ="/c2/v1/plan-trip" className="inline-block bg-white text-slate-950 px-10 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-amber-400 hover:text-black transition-all duration-300 shadow-xl">
              Start Building My Experience
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}