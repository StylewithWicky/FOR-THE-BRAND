// src/components/PublicNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface PublicNavbarProps {
  onSignUpClick: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onSignUpClick }) => {
  return (
    <nav className="absolute top-0 left-0 w-full px-8 md:px-16 py-8 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 via-black/10 to-transparent">
      {/* Brand Logo Identity */}
      <Link to="/" className="text-lg font-black tracking-[0.3em] text-amber-500 uppercase font-sans">
        Yolo<span className="text-white font-light tracking-[0.1em]">Connect</span>
      </Link>
      
      {/* Global Desktop Directory Links */}
      <div className="hidden lg:flex items-center gap-10 text-[9px] uppercase tracking-[0.3em] text-slate-300 font-bold">
        <Link to="/c2/v1/about" className="hover:text-amber-400 transition-colors">About Yolo</Link>
        <Link to="/c2/v1/placestogo" className="hover:text-amber-400 transition-colors">Places to Go</Link>
        <Link to="/c2/v1/tings" className="hover:text-amber-400 transition-colors">Things to Do</Link>
        <Link to="/c2/v1/experiences" className="hover:text-amber-400 transition-colors">Experiences</Link>
        <Link to="/c2/v1/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
        <Link to="/c2/v1/plan-trip" className="hover:text-amber-400 transition-colors">Plan Your Trip</Link>
        <Link to="/c2/v1/events" className="bg-amber-500 text-black px-5 py-2.5 rounded-full text-[9px] font-black tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-amber-500/10">
          Events
        </Link>
      </div>

      {/* Auxiliary Deck */}
        <div className="flex items-center gap-6 text-slate-400 text-[11px] relative">
        
        
        <button 
          onClick={onSignUpClick}
          className="text-[9px] tracking-[0.2em] font-mono uppercase font-bold text-slate-300 border border-white/10 hover:border-white/40 bg-white/5 px-4 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          Join the Family
        </button>

        
      </div>
    </nav>
  );
};