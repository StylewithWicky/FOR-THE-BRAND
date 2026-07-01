import React from 'react';
import { Link } from 'react-router-dom'; // Or your respective framework router

export const VisitorFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#08090a] border-t border-white/5 pt-44 pb-16 relative overflow-hidden z-20">
      
      {/* Massive Accent Watermark Backdrop */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full text-center overflow-hidden pointer-events-none select-none z-0 px-4">
        <h2 className="text-[11vw] font-black tracking-tighter opacity-[0.02] text-white leading-none uppercase">
          #YOLOCONNECT
        </h2>
      </div>
      
      {/* Main Grid Deck */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative z-10 mb-24 items-start">
        
        {/* Column 1: Newsletter Intake */}
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-bold font-mono">// Stay Updated</h4>
          <p className="text-xs font-light text-slate-400 leading-relaxed max-w-xs">
            Signup to our newsletter. Get exclusive paths, design drops, and hidden track coordinates to make your experience unforgettable.
          </p>
          <div className="flex gap-2 max-w-sm">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs w-full focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-white placeholder-slate-600" 
            />
            <button className="bg-amber-500 text-black font-bold px-6 rounded-xl text-[10px] uppercase tracking-wider hover:bg-white hover:text-black transition-colors whitespace-nowrap font-mono">
              Subscribe
            </button>
          </div>
        </div>

        
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold font-mono">// Quick Navigation</h4>
          <div className="grid grid-cols-2 gap-8 text-xs text-slate-400 font-light">
            <div className="space-y-4 flex flex-col">
              <Link to="/c2/v1/events" className="hover:text-amber-400 transition-colors">Events</Link>
              <Link to="/c2/v1/experiences" className="hover:text-amber-400 transition-colors">Experiences</Link>
              <Link to="/c2/v1/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
              <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
            </div>
            <div className="space-y-4 flex flex-col">
              <Link to="/c2/v1/about" className="hover:text-amber-400 transition-colors">About Story</Link>
              <a href="#contact" className="hover:text-amber-400 transition-colors">Contact Us</a>
              <a href="#terms" className="hover:text-amber-400 transition-colors">Privacy Rules</a>
            </div>
          </div>
        </div>

        {/* Column 3: Live Metadata Widget */}
        <div className="space-y-6 md:justify-self-end w-full max-w-xs">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold md:text-right font-mono">// Vibes and Inshallah</h4>
          <div className="bg-gradient-to-br from-white/[0.03] to-transparent p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-36 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono">
              <span>SYSTEM STATUS</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> OPERATIONAL
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-mono">Current Track Horizon</span>
              <span className="text-lg font-serif text-white mt-1 block">Naivasha Assembly</span>
            </div>
          </div>
        </div>
        
      </div>

      {/* Base Copyright Alignment Bar */}
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 border-t border-white/5 pt-8 text-[10px] uppercase tracking-widest text-slate-600 font-mono">
        <p>© {currentYear} YOLO CONCIERGE SUITE. ALL RIGHTS RESERVED.</p>
        <p>BUILT FOR COMFORT. CRAFTED FOR THE UNBOTHERED.</p>
      </div>

    </footer>
  );
};