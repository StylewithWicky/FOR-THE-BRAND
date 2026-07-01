import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function ClientHomepage() {
  const router = useNavigate();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ 
    name: string; 
    points: number; 
    tier: string; 
    nextTier: string; 
    pointsToNext: number; 
  } | null>(null);

  
  const handleSimulatedSignup = () => {
    setCurrentUser({
      name: "CHRIS",
      points: 4250,
      tier: "Gold Elite",
      nextTier: "Platinum Horizon",
      pointsToNext: 750
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('Art & Culture');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax and canvas morph metrics
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.15], ["0px", "56px"]);
  const textParallax = useTransform(scrollYProgress, [0, 0.25], [0, -80]);

  // Local Background Video Resources Setup
  const videoSourcePrimary = "/videos/relax.mp4";
  const videoSourceFallback = "/videos/relaxs.mp4";

  const facts = [
    { 
      title: 'The Soft Win', 
      text: "Forcing it is a rookie mistake. True social killers know the ultimate paradox: rigid force breaks, but quiet, unbothered elegance bends the room to its will. Soft power wins every single time.", 
      bg: 'bg-[#0f1115]', 
      rotate: -2 
    },
    { 
      title: 'Zero Friction', 
      text: "Loudness is just disguised desperation. The most magnetic presence in any space is always the person operating with absolute ease—unforced, self-contained, and completely detached from the noise.", 
      bg: 'bg-[#1c1917]', 
      rotate: 3 
    },
    { 
      title: 'Pure Subtext', 
      text: "Nobody cares about your hyper-detailed itineraries or calculated plans. People only remember the raw energy of how a moment made them feel. Real connection lives entirely in the unsaid.", 
      bg: 'bg-[#061c16]', 
      rotate: -1 
    },
    { 
      title: 'The Silent Read', 
      text: "Real charm is an unspoken game. It’s the sophisticated art of observing the room, reading the micro-interactions between the lines, and making one single, flawless move while everyone else is talking.", 
      bg: 'bg-[#1e112a]', 
      rotate: 2 
    },
    { 
      title: 'Unmapped Chemistry', 
      text: "You only live this exact night once. The real magic happens when you stop fighting the current, throw away the rigid grid, and just run with the chaos. Real synergy cannot be scheduled.", 
      bg: 'bg-[#1c0d11]', 
      rotate: -1.5 
    }
  ];

  const categoryCards: Record<string, Array<{ name: string; img: string; paragraph: string }>> = {
    'Art & Culture': [
      { 
        name: 'Lamu Old Town', 
        img: '/image/Lamu.png',
        paragraph: 'Step into a living UNESCO sanctuary where time is dictated by monsoonal winds and the quiet lap of dhows. Wander through winding coral-stone alleyways beneath world-famous, hand-carved wooden portals that tell centuries of maritime trade history.'
      },
      { 
        name: 'Ruins of Gedi', 
        img: '/image/Gedi.png',
        paragraph: 'Explore a hauntingly beautiful, 12th-century Swahili walled city reclaimed by the emerald canopy of the Arabuko Sokoke Forest. Uncover advanced ancient engineering, coral palaces, and deep historical riddles preserved in stone.'
      },
      { 
        name: 'Coastal Architecture', 
        img: '/image/FortJesus.png',
        paragraph: 'Witness the imposing, raw architectural lines of historic military fortresses looking out over the old ports. A masterclass in 16th-century coral-rock masonry where global empires collided to guard the gateway of East African trade.'
      }
    ],
    'Rhythms & Roots': [
      { 
        name: 'Lake Victoria Soundscapes', 
        img: '/image/kisumu.png',
        paragraph: 'Trace the literal origins of modern Benga music along the vibrant shores of the lake basin. Experience the rapid, hypnotic syncopation of electric guitars modeled precisely after the ancient, eight-stringed Nyatiti lyre.'
      },
      { 
        name: 'Loita Hills Drumming', 
        img: '/image/loita.png',
        paragraph: 'Journey deep into hallowed highlands to witness the deep, sacred power of pastoralist polyphonic vocal arrangements. An intense, acoustic cadence carried entirely by collective human breath and disciplined, earthly movement.'
      },
      { 
        name: 'Kilifi Creek Acoustic Vibes', 
        img: '/image/Kilifi.png',
        paragraph: 'Immerse your senses in Kenya’s premier alternative creative sanctuary. Relax to low-tempo, open-air live sets where traditional heritage strings effortlessly cross-pollinate with ambient Afro-house and midnight forest frequencies.'
      }
    ],
    'Trails & Frontiers': [
      { 
        name: 'Chyulu Hills Wilderness', 
        img: '/image/chyuluhills.png',
        paragraph: 'Navigate the rolling, deep-green volcanic crests that Ernest Hemingway called the "Green Hills of Africa." A stark, untouched frontier where ancient lava tubes slice through rugged landscapes shaped for raw exploration.'
      },
      { 
        name: 'Mount Kenya Alpine Peaks', 
        img: '/image/mtkenya.png',
        paragraph: 'Scale the jagged, mist-shrouded glacial ridges of Africa’s second-highest summit. An uncompromising high-altitude expedition moving through Afro-alpine moorlands into a silent, wind-swept world of rock and ice.'
      },
      { 
        name: 'Suguta Valley Horizons', 
        img: '/image/sugutahills.png',
        paragraph: 'Journey into the true northern frontier—one of the deepest, hottest, and most visually arresting rifts on Earth. A vast playground of volcanic cones and desert dunes crafted for those who command spatial presence.'
      }
    ],
  };

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ clientName, clientPhone, clientEmail });
    router('/c2/v1/plan-trip');
  };

  return (
    <div ref={containerRef} className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      
      {/* 1. FINESSED UNINTERRUPTED VIDEO CANVAS */}
      <motion.header 
        style={{ scale: heroScale, borderRadius: heroRadius }}
        className="relative h-screen flex flex-col justify-end pb-16 md:pb-24 px-8 lg:px-20 origin-top overflow-hidden bg-[#07080a]"
      >
        {/* Base Layer: Widescreen Cinematic Atmosphere */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105 brightness-[0.45] contrast-[1.02]"
          >
            <source src={videoSourcePrimary} type="video/mp4" />
            <source src={videoSourceFallback} type="video/mp4" />
            
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
        </div>
        
        <motion.div style={{ y: textParallax }} className="relative z-30 max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-12 pointer-events-none">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-500 font-mono block mb-4 font-bold">#FOR THE LOVE OF YOLO</span>
            <h1 className="text-[8.5vw] font-serif leading-[0.85] tracking-tight text-white font-light selection:bg-amber-500">
              FIND YOUR<br /><span className="italic font-normal text-amber-400">P</span>LACE
            </h1>
          </div>
          <div className="max-w-[280px] md:text-right flex flex-col md:items-end pointer-events-auto mb-2">
            <p className="text-xs opacity-75 font-light leading-relaxed text-slate-300">
              Dreaming about a captivating destination operating on quiet power and hidden wonders? You've hit the spot.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-slate-500 font-mono font-bold">
              <span>EXPLORE</span>
              <span className="w-8 h-px bg-slate-800 inline-block animate-pulse" />
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* 2. VALUE STATEMENT */}
      <section className="py-32 max-w-[1400px] mx-auto px-8">
        <h2 className="text-3xl md:text-5xl font-serif text-center max-w-4xl mx-auto leading-snug">
          Stop Watching. Start Living - <span className="italic text-amber-400">Why wait for "someday" when the world’s most magnetic rhythm is calling right now?</span>
        </h2>
      </section>

      {/* 3. ASYMMETRIC COLLAGE GRID LAYOUT */}
      <section className="pb-24 max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-6 justify-between">
            {/* CARD 1: TASTE - Sundowners in the Bush */}
            <div className="h-[260px] rounded-[32px] overflow-hidden relative group cursor-pointer shadow-lg border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600" 
                alt="Luxury Kenyan Sundowner" 
                className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">ADVENTURE</span>
                <h4 className="text-lg font-serif text-white">Explore the Mara</h4>
              </div>
            </div>
            
            {/* CARD 2: ESCAPE - The Diani Coastline */}
            <div className="h-[210px] rounded-[32px] overflow-hidden relative group cursor-pointer shadow-lg border border-white/5">
              <img 
                src="/image/diani.jpg"
                alt="Diani Beach Coastline" 
                className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">ESCAPE</span>
                <h4 className="text-lg font-serif text-white">The White Sands</h4>
              </div>
            </div>
          </div>

          {/* CENTER HERO CARD */}
          <div className="lg:col-span-6 h-[500px] rounded-[40px] overflow-hidden relative group cursor-pointer shadow-2xl border border-white/5">
            <img 
              src="/image/tree.png"
              alt="Epic Kenyan Savannah" 
              className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-[1200ms] ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight font-light">
                  The Heart of <br /><span className="italic font-normal text-amber-200">The Rift Valley</span>
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-light max-w-xs leading-relaxed md:text-right">
                Expansive horizons curated seamlessly for a presence that commands attention through quiet, effortless rhythm.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-6 justify-between">
            {/* CARD 3: STAY */}
            <div className="h-[220px] rounded-[32px] overflow-hidden relative group cursor-pointer shadow-lg border border-white/5">
              <img 
                src="/image/naks.png"
                alt="Luxury Eco-Lodge Villa" 
                className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">STAY</span>
                <h4 className="text-lg font-serif text-white">Lake Nakuru Serenity</h4>
              </div>
            </div>
            
            {/* CARD 4: HERITAGE */}
            <div className="h-[250px] rounded-[32px] overflow-hidden relative group cursor-pointer shadow-lg border border-white/5">
              <img 
                src="/image/mtkenya.png"
                alt="Kenyan Heritage Exploration" 
                className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 block mb-1">HERITAGE</span>
                <h4 className="text-lg font-serif text-white">Trails of Mount Kenya</h4>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* 4. CATEGORIZED NAVIGATION TAB SYSTEM */}
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

        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {categoryCards[activeTab].map((card, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="h-[440px] rounded-[40px] overflow-hidden relative border border-white/5 shadow-xl">
                <img 
                  src={card.img} 
                  alt={card.name} 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-95" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col justify-end min-h-[50%]">
                  <h4 className="text-2xl font-serif text-white">
                    {card.name}
                  </h4>
                  <p className="text-[12px] text-slate-300/90 italic font-light leading-relaxed mt-2.5 max-w-[95%]">
                    &ldquo;{card.paragraph}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 5. EXPERIENTIAL CONCIERGE INTAKE SYSTEM */}
      <section id="plan-trip" className="bg-white text-slate-900 py-32 rounded-[72px] -mx-4 px-12 relative z-10 my-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-amber-600 font-bold block mb-3">// Wagwan Traveller</span>
            <h3 className="text-5xl md:text-6xl font-serif font-light leading-tight text-slate-950">
              Initialize Your <br /><span className="italic text-amber-600">Track Blueprint</span>
            </h3>
            <p className="mt-6 text-base text-slate-500 max-w-md leading-relaxed font-light">
              Submit your contact coordinates to lock in your agency profile. Our intake concierge mapping system bypasses standard tourism models to prepare your unbothered route itinerary.
            </p>
          </div>
          
          <form onSubmit={handleIntakeSubmit} className="bg-slate-50 p-8 md:p-12 rounded-[44px] border border-slate-100 shadow-2xl space-y-8">
            <div className="border-b border-slate-200 pb-2 focus-within:border-amber-500 transition-colors">
              <label className="block text-[9px] uppercase font-mono text-slate-400 tracking-widest font-bold mb-1">Identity Coordinates</label>
              <input 
                type="text" 
                value={clientName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)}
                placeholder="Your full name" 
                className="w-full bg-transparent border-none text-slate-900 focus:outline-none placeholder-slate-300 font-serif text-lg" 
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b border-slate-200 pb-2 focus-within:border-amber-500 transition-colors">
                <label className="block text-[9px] uppercase font-mono text-slate-400 tracking-widest font-bold mb-1">Direct Line</label>
                <input 
                  type="tel" 
                  value={clientPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientPhone(e.target.value)}
                  placeholder="+254 700 000000"
                  className="w-full bg-transparent border-none text-slate-900 focus:outline-none placeholder-slate-300 font-serif text-lg mt-1"
                  required
                />
              </div>
              
              <div className="border-b border-slate-200 pb-2 focus-within:border-amber-500 transition-colors">
                <label className="block text-[9px] uppercase font-mono text-slate-400 tracking-widest font-bold mb-1">Digital Correspondence</label>
                <input 
                  type="email" 
                  value={clientEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-transparent border-none text-slate-900 focus:outline-none placeholder-slate-300 font-serif text-lg mt-1"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#0b0c0e] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-amber-500 hover:text-black transition-all shadow-xl font-mono">
              Continue to Track Blueprint →
            </button>
          </form>
        </div>
      </section>

      {/* 7. SWIPE & ROTATE KINETIC FACTS DECK */}
      <section className="py-24 overflow-visible">
        <div className="max-w-7xl mx-auto px-8 mb-12">
          <h3 className="text-4xl font-serif">The Blueprint of Flow</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-2 font-mono font-bold">Swipe or drag horizontally to slide the card layers</p>
        </div>

        <div className="overflow-x-auto scrollbar-none select-none active:cursor-grabbing">
          <motion.div 
            drag="x"
            dragConstraints={{ right: 0, left: -900 }}
            className="flex gap-8 px-8 md:px-24 pb-12 w-max"
          >
            {facts.map((fact, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, rotate: 0, y: -8 }}
                initial={{ rotate: fact.rotate }}
                className={`${fact.bg} border border-white/5 w-[290px] md:w-[360px] h-[440px] rounded-[48px] p-10 flex flex-col justify-between shadow-2xl relative transition-shadow`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono opacity-40">0{index + 1} / 05</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs opacity-50">✦</div>
                </div>
                <div>
                  <h4 className="text-2xl font-serif mb-4 text-amber-400">{fact.title}</h4>
                  <p className="text-xs opacity-75 leading-relaxed font-light text-slate-300">{fact.text}</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest opacity-40 font-mono">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">→</div>
                  <span>Continuous track</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. SEASONAL EDITORIAL FEATURE REDIRECTS */}
      <section className="py-16 max-w-7xl mx-auto px-8 space-y-8 relative z-10">
        <div className="rounded-[48px] overflow-hidden relative h-[380px] flex items-center px-12 group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=1200')] bg-cover bg-center brightness-[0.4] group-hover:scale-102 transition-transform duration-1000" />
          <div className="relative z-10 max-w-xl">
            <h3 className="text-4xl font-serif mb-4">Summer Tracks in Kenya</h3>
            <p className="text-sm opacity-80 mb-6 font-light leading-relaxed text-slate-300">Kenya welcomes everyone this summer season. From unscripted wild safaris to boutique coastal retreats, chart paths that exist outside the grid.</p>
            <Link to="/c2/v1/blog" className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest hover:text-amber-300 transition font-mono">
              More journal entries →
            </Link>
          </div>
        </div>

        <div className="bg-[#0e271f] border border-emerald-500/10 rounded-[48px] p-16 text-center max-w-5xl mx-auto relative overflow-hidden">
          <h3 className="text-3xl md:text-4xl font-serif max-w-2xl mx-auto leading-snug text-white">
            Explore Kenya Like Never Before
          </h3>
          <p className="text-xs text-emerald-200/70 mt-4 max-w-xs mx-auto font-light">Find the coolest off-the-beaten-track spots to plan your escape your own way.</p>
          <Link to="/c2/v1/experiences" className="mt-8 inline-block bg-white text-slate-950 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 hover:text-slate-950 transition-all shadow-xl font-mono">
            Explore →
          </Link>
        </div>
      </section>

      {/* 9. MATRIX CURATED LIVE ASSEMBLIES CARDS */}
      <section id="events" className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono font-bold">// Sherehe Calendar</span>
            <h3 className="text-4xl font-serif mt-2">Upcoming Events</h3>
          </div>
          <Link to="/c2/v1/events" className="text-xs font-mono uppercase tracking-widest text-amber-400 hover:text-white transition-colors">
            View Live Directory →
          </Link>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Lamu Cultural Circuit", date: "Mon, Jun 01", loc: "Lamu Archipelago" },
            { title: "Rift Rhythm Assemblies 2026", date: "Fri, Jun 05 - Sun, Jun 07", loc: "Naivasha Crater Rim" },
            { title: "Boutique Craft Matrix", date: "Fri, Jun 05 - Sun, Jun 07", loc: "Nairobi Design District" },
            { title: "Suns & Horizons Assembly", date: "Sat, Jun 06", loc: "Diani Coastal Track" }
          ].map((evt, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[36px] flex flex-col justify-between min-h-[230px] hover:border-amber-500/30 transition duration-300">
              <div>
                <span className="text-[9px] bg-white/10 text-amber-400 px-3 py-1 rounded-full uppercase tracking-wider font-mono font-bold">{evt.date}</span>
                <h4 className="text-xl font-serif mt-5 text-white/90 leading-snug">{evt.title}</h4>
              </div>
              <p className="text-xs text-slate-400 font-light tracking-wide font-mono">{evt.loc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. UTILITY QUICK LINK BUTTON MODULES */}
      <section className="py-12 max-w-5xl mx-auto px-8 flex flex-wrap justify-center gap-4 text-xs font-semibold tracking-wider text-slate-400">
        {['Private Charters', 'Concierge Information', 'Transit & Logistics', 'Travel Philosophy', 'Boutique Stays'].map(link => (
          <button key={link} className="border border-white/5 rounded-2xl px-6 py-4 hover:bg-white/5 hover:text-white transition text-[10px] uppercase tracking-widest font-mono font-bold">{link}</button>
        ))}
      </section>


    </div>
  );
}