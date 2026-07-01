import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/PublicNavbar';
export const VisitorHome: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('Art & Culture');

 
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "56px"]);
  const textParallax = useTransform(scrollYProgress, [0, 0.25], [0, -80]);

  const videoSourcePrimary = "/videos/relax.mp4";
  const videoSourceFallback = "/videos/relaxs.mp4";

  const facts = [
    { title: 'The Soft Win', text: "Forcing it is a rookie mistake. True social killers know the ultimate paradox: rigid force breaks, but quiet, unbothered elegance bends the room to its will. Soft power wins every single time.", bg: 'bg-[#0f1115]', rotate: -2 },
    { title: 'Zero Friction', text: "Loudness is just disguised desperation. The most magnetic presence in any space is always the person operating with absolute ease—unforced, self-contained, and completely detached from the noise.", bg: 'bg-[#1c1917]', rotate: 3 },
    { title: 'Pure Subtext', text: "Nobody cares about your hyper-detailed itineraries or calculated plans. People only remember the raw energy of how a moment made them feel. Real connection lives entirely in the unsaid.", bg: 'bg-[#061c16]', rotate: -1 },
    { title: 'The Silent Read', text: "Real charm is an unspoken game. It’s the sophisticated art of observing the room, reading the micro-interactions between the lines, and making one single, flawless move while everyone else is talking.", bg: 'bg-[#1e112a]', rotate: 2 },
    { title: 'Unmapped Chemistry', text: "You only live this exact night once. The real magic happens when you stop fighting the current, throw away the rigid grid, and just run with the chaos. Real synergy cannot be scheduled.", bg: 'bg-[#1c0d11]', rotate: -1.5 }
  ];

  const categoryCards: Record<string, Array<{ name: string; img: string; paragraph: string }>> = {
    'Art & Culture': [
      { name: 'Lamu Old Town', img: '/image/Lamu.png', paragraph: 'Step into a living UNESCO sanctuary where time is dictated by monsoonal winds and the quiet lap of dhows. Wander through winding coral-stone alleyways beneath world-famous, hand-carved wooden portals.' },
      { name: 'Ruins of Gedi', img: '/image/Gedi.png', paragraph: 'Explore a hauntingly beautiful, 12th-century Swahili walled city reclaimed by the emerald canopy of the Arabuko Sokoke Forest. Uncover advanced ancient engineering.' },
      { name: 'Coastal Architecture', img: '/image/FortJesus.png', paragraph: 'Witness the imposing, raw architectural lines of historic military fortresses looking out over the old ports. A masterclass in 16th-century coral-rock masonry.' }
    ],
    'Rhythms & Roots': [
      { name: 'Lake Victoria Soundscapes', img: '/image/kisumu.png', paragraph: 'Trace the literal origins of modern Benga music along the vibrant shores of the lake basin. Experience the rapid, hypnotic syncopation of electric guitars.' },
      { name: 'Loita Hills Drumming', img: '/image/loita.png', paragraph: 'Journey deep into hallowed highlands to witness the deep, sacred power of pastoralist polyphonic vocal arrangements. An intense, acoustic cadence.' },
      { name: 'Kilifi Creek Acoustic Vibes', img: '/image/Kilifi.png', paragraph: 'Immerse your senses in Kenya’s premier alternative creative sanctuary. Relax to low-tempo, open-air live sets where traditional heritage strings cross-pollinate.' }
    ],
    'Trails & Frontiers': [
      { name: 'Chyulu Hills Wilderness', img: '/image/chyuluhills.png', paragraph: 'Navigate the rolling, deep-green volcanic crests that Ernest Hemingway called the "Green Hills of Africa." A stark, untouched frontier.' },
      { name: 'Mount Kenya Alpine Peaks', img: '/image/mtkenya.png', paragraph: 'Scale the jagged, mist-shrouded glacial ridges of Africa’s second-highest summit. An uncompromising high-altitude expedition moving through moorlands.' },
      { name: 'Suguta Valley Horizons', img: '/image/sugutahills.png', paragraph: 'Journey into the true northern frontier—one of the deepest, hottest, and most visually arresting rifts on Earth. A vast playground of volcanic cones.' }
    ]
  };

  const handleVisitorGatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    navigate('/kufika');
  };

  return (
    <div ref={containerRef} className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      
      
      <motion.div 
        style={{ scale: heroScale, borderRadius: heroRadius }}
        className="relative h-screen flex flex-col justify-end pb-16 md:pb-24 px-8 lg:px-20 origin-top overflow-hidden bg-[#07080a]"
      >
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 brightness-[0.45] contrast-[1.02]">
            <source src={videoSourcePrimary} type="video/mp4" />
            <source src={videoSourceFallback} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
        </div>
        
      
        <motion.div style={{ y: textParallax }} className="relative z-30 max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-12 pointer-events-none">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-mono block mb-4 font-bold">#For The Love of The Brand</span>
            <h1 className="text-[8.5vw] font-serif leading-[0.85] tracking-tight text-white font-light">
              FIND YOUR<br /><span className="italic font-normal text-amber-400">P</span>LACE
            </h1>
          </div>
          <div className="max-w-[280px] md:text-right flex flex-col md:items-end pointer-events-auto mb-2">
            <p className="text-xs opacity-75 font-light leading-relaxed text-slate-300">
              Dreaming about a captivating destination operating on quiet power and hidden wonders? Unlock the full grid.
            </p>
            <button onClick={() => navigate('/kufika')} className="mt-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-amber-500 font-mono font-bold bg-transparent border-none cursor-pointer">
              <span>JOIN THE CLUB TO ACCESS</span>
              <span className="w-8 h-px bg-amber-500 inline-block animate-pulse" />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* 2. VALUE STATEMENT */}
      <section className="py-32 max-w-[1400px] mx-auto px-8">
        <h2 className="text-3xl md:text-5xl font-serif text-center max-w-4xl mx-auto leading-snug">
          Stop Watching. Start Living - <span className="italic text-amber-400">Why wait for "someday" when the world’s most magnetic rhythm is calling right now?</span>
        </h2>
      </section>

      
      <section className="pb-24 max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-3 flex flex-col gap-6 justify-between">
            <div onClick={() => navigate('/kufika')} className="h-[260px] rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg">
              <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600" alt="Safar" className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">🔒 LOCKED</span>
                <h4 className="text-lg font-serif text-white">Explore the Mara</h4>
              </div>
            </div>
            <div onClick={() => navigate('/kufika')} className="h-[210px] rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg">
              <img src="/image/diani.jpg" alt="Coast" className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">🔒 LOCKED</span>
                <h4 className="text-lg font-serif text-white">The White Sands</h4>
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/kufika')} className="lg:col-span-6 h-[500px] rounded-[40px] overflow-hidden relative group cursor-pointer border border-white/5 shadow-2xl">
            <img src="/image/tree.png" alt="Rift" className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-[1200ms]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight font-light">
                  The Heart of <br /><span className="italic font-normal text-amber-200">The Rift Valley</span>
                </h3>
              </div>
              <p className="text-xs text-amber-400 font-mono tracking-wider">Members Only Area →</p>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6 justify-between">
            <div onClick={() => navigate('/kufika')} className="h-[220px] rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg">
              <img src="/image/naks.png" alt="Lodge" className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">🔒 LOCKED</span>
                <h4 className="text-lg font-serif text-white">Lake Nakuru Serenity</h4>
              </div>
            </div>
            <div onClick={() => navigate('/kufika')} className="h-[250px] rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg">
              <img src="/image/mtkenya.png" alt="Peaks" className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">🔒 LOCKED</span>
                <h4 className="text-lg font-serif text-white">Trails of Mount Kenya</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap gap-4 justify-center mb-16 border-b border-white/5 pb-8 relative z-10">
          {Object.keys(categoryCards).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-full uppercase tracking-widest text-[10px] font-bold transition-all ${
                activeTab === tab ? 'bg-amber-500 text-black shadow-xl' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div layout className="grid md:grid-cols-3 gap-8">
          {categoryCards[activeTab].map((card, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => navigate('/kufika')}>
              <div className="h-[440px] rounded-[40px] overflow-hidden relative border border-white/5 shadow-xl">
                <img src={card.img} alt={card.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-95" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col justify-end min-h-[50%]">
                  <h4 className="text-2xl font-serif text-white flex items-center gap-2">
                    {card.name} <span className="text-xs text-amber-400">🔒</span>
                  </h4>
                  <p className="text-[12px] text-slate-400 italic font-light leading-relaxed mt-2.5">
                    Sign up to view detailed route specifications, coordination tracking, and accommodation maps.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      
      <section id="plan-trip" className="bg-white text-slate-900 py-32 rounded-[72px] -mx-4 px-12 relative z-10 my-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-amber-600 font-bold block mb-3">// Wagwan Traveller</span>
            <h3 className="text-5xl md:text-6xl font-serif font-light leading-tight text-slate-950">
              Create Your <br /><span className="italic text-amber-600"> Blueprint</span>
            </h3>
            <p className="mt-6 text-base text-slate-500 max-w-md leading-relaxed font-light">
              Join YoloConnect to claim your member point tracker profile and bypass standard tourism templates.
            </p>
          </div>
          
          <form onSubmit={handleVisitorGatedSubmit} className="bg-slate-50 p-8 md:p-12 rounded-[44px] border border-slate-100 shadow-2xl space-y-8">
            <div className="border-b border-slate-200 pb-2">
              <label className="block text-[9px] uppercase font-mono text-slate-400 tracking-widest font-bold mb-1">Your Name</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Your full name" className="w-full bg-transparent border-none text-slate-900 focus:outline-none font-serif text-lg" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b border-slate-200 pb-2">
                <label className="block text-[9px] uppercase font-mono text-slate-400 tracking-widest font-bold mb-1">Your Phone Number</label>
                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+254 700 000000" className="w-full bg-transparent border-none text-slate-900 focus:outline-none font-serif text-lg mt-1" required />
              </div>
              <div className="border-b border-slate-200 pb-2">
                <label className="block text-[9px] uppercase font-mono text-slate-400 tracking-widest font-bold mb-1">Your Email</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-transparent border-none text-slate-900 focus:outline-none font-serif text-lg mt-1" required />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#0b0c0e] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-amber-500 hover:text-black transition-all shadow-xl font-mono">
              Register Account to Continue →
            </button>
          </form>
        </div>
      </section>

      {/* 6. BLUEPRINT KINETIC DECK */}
      <section className="py-24 overflow-visible">
        <div className="max-w-7xl mx-auto px-8 mb-12">
          <h3 className="text-4xl font-serif">The Blueprint of Flow</h3>
        </div>
        <div className="overflow-x-auto scrollbar-none select-none">
          <div className="flex gap-8 px-8 md:px-24 pb-12 w-max">
            {facts.map((fact, index) => (
              <div key={index} className={`${fact.bg} border border-white/5 w-[290px] md:w-[360px] h-[440px] rounded-[48px] p-10 flex flex-col justify-between shadow-2xl`}>
                <span className="text-[11px] font-mono opacity-40">0{index + 1} / 05</span>
                <div>
                  <h4 className="text-2xl font-serif mb-4 text-amber-400">{fact.title}</h4>
                  <p className="text-xs opacity-75 leading-relaxed font-light text-slate-300">{fact.text}</p>
                </div>
                <button onClick={() => navigate('/kufika')} className="bg-transparent border-none text-left font-mono text-[9px] uppercase tracking-widest text-amber-500 cursor-pointer">
                  Unlock Philosophy perks →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};