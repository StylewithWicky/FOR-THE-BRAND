import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ProtectedNavbarProps {
  user: { email: string; username?: string; points?: number; tier?: string; nextTier?: string; pointsToNext?: number; };
  onLogout: () => void;
}

export const ProtectedNavbar: React.FC<ProtectedNavbarProps> = ({ user, onLogout }) => {
  const [showMemberPanel, setShowMemberPanel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const memberName = user.username || user.email.split('@')[0].toUpperCase();
  const navLinks = [
    { name: 'About', path: '/c2/v1/about' },
    { name: 'Places to go', path: '/c2/v1/placestogo' },
    { name: 'Things to do', path: '/c2/v1/tings' },
    { name: 'Experiences', path: '/c2/v1/experiences' },
    { name: 'Blog', path: '/c2/v1/blog' },
    { name: 'Plan Trip', path: '/c2/v1/plan-trip' },
  ];

  return (
    <nav className="absolute top-0 left-0 w-full px-6 md:px-12 lg:px-16 py-8 flex justify-between items-center z-50">
      {/* Brand */}
      <Link to="/c2/v1/feed" className="text-lg font-black tracking-[0.3em] text-amber-500 uppercase z-50">
        YOLO<span className="text-white font-light">CONNECT</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-10 text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold">
        {navLinks.map((link) => (
          <Link key={link.name} to={link.path} className="hover:text-white transition-colors duration-300">
            {link.name}
          </Link>
        ))}
        <Link to="/c2/v1/events" className="border border-amber-500/50 text-amber-500 px-6 py-2.5 rounded-full hover:bg-amber-500 hover:text-black transition-all">
          Events
        </Link>
      </div>

      {/* Right Side: Identity & Mobile Toggle */}
      <div className="flex items-center gap-6 z-50">
        {/* Identity Button */}
        <button 
          onClick={() => setShowMemberPanel(!showMemberPanel)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all font-mono text-[9px] tracking-[0.2em] text-amber-500 uppercase font-bold"
        >
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse hidden md:block" />
          {memberName}
        </button>

        {/* Mobile Hamburger Toggle */}
        <button className="lg:hidden text-[10px] font-mono text-white tracking-widest" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0b0c0e] pt-32 px-8 flex flex-col gap-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white hover:text-amber-500">
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Dropdown Panel */}
      <AnimatePresence>
        {showMemberPanel && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute right-6 md:right-16 top-20 w-72 bg-[#0b0c0e]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 z-50"
          >
            <div className="border-b border-white/5 pb-6">
              <span className="text-[8px] font-mono opacity-40 uppercase tracking-[0.25em] block mb-1">Membership</span>
              <h5 className="text-base font-serif text-white">{user.tier || "Gold Elite"}</h5>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-mono tracking-widest opacity-60">
                <span>{user.points || 0} PTS</span>
                <span>{user.nextTier || "Platinum"}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full"><div className="h-full bg-amber-500 rounded-full" style={{ width: '82%' }} /></div>
            </div>
            <Link to="/c2/v1/memberdash" onClick={() => setShowMemberPanel(false)} className="block text-center border border-white/10 hover:bg-white hover:text-black text-white text-[9px] uppercase tracking-[0.2em] font-mono py-3 rounded-xl transition-all">
              View Profile
            </Link>
            <button onClick={() => { setShowMemberPanel(false); onLogout(); }} className="w-full text-center opacity-30 hover:opacity-100 text-[8px] tracking-widest font-mono uppercase transition-opacity">
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};