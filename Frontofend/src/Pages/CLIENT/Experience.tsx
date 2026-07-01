import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExperiencesPage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const token = localStorage.getItem('yolo_token');
    
    if (token) { 
      navigate('/c2/v1/plan-trip');
    } else {
      navigate('/kufika');
    }
  };

  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-8">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 font-bold uppercase">Curate your own Experience</span>
        <h1 className="text-[7vw] font-serif leading-[0.9] tracking-tight text-white mt-4">
          DESIGN YOUR <br /><span className="italic font-normal text-amber-400">O</span>WN VIBE
        </h1>
        <p className="mt-8 text-sm text-slate-400 max-w-md font-light leading-relaxed">
          Skip the standard tourist grids. Tell us your pace, and we will build a tailored track around your personal social energy.
        </p>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-8">
        
        <div 
          onClick={handleNavigate}
          className="border border-white/5 bg-white/[0.01] p-12 rounded-[48px] flex flex-col justify-between h-[450px] hover:border-amber-500/30 transition duration-500 group cursor-pointer"
        >
          <span className="font-mono text-xs opacity-40">Chill Vibes</span>
          <div>
            <h3 className="text-3xl font-serif text-white group-hover:text-amber-400 transition-colors">Calm experience</h3>
            <p className="text-xs text-slate-400 font-light mt-4 leading-relaxed max-w-xs">
              We’re moving away from the rush. Instead, we offer a collection of slow-paced retreats designed for you to truly settle in—whether that means a quiet morning wandering through the ancient, vine-covered ruins of Gedi, a deliberate hike to a hidden waterfall, or simply finding a space that feels like it grew directly out of the landscape.
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold">Choose your vibe →</span>
        </div>

       
        <div 
          onClick={handleNavigate}
          className="border border-white/5 bg-white/[0.01] p-12 rounded-[48px] flex flex-col justify-between h-[450px] hover:border-amber-500/30 transition duration-500 group cursor-pointer"
        >
          <span className="font-mono text-xs opacity-40">Fast Paced Vibes</span>
          <div>
            <h3 className="text-3xl font-serif text-white group-hover:text-amber-400 transition-colors">Adrenaline Rush</h3>
            <p className="text-xs text-slate-400 font-light mt-4 leading-relaxed max-w-xs">
              We’re ripping up the rulebook on the standard weekend. This is high-velocity exploration: throttle-heavy road trips through the wild plains of Namanga, precision-focused sessions at the shooting range, and full-throttle jet-ski sprints across the blue. We handle the logistics so you can focus on the adrenaline.
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-bold">Choose your vibe →</span>
        </div>
      </section>
    </div>
  );
}