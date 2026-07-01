import React, { useState, useEffect } from 'react';

export default function EventsPage() {
  const [filter, setFilter] = useState('All Assemblies');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from the backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/v1/events'); // Adjust this path to your FastAPI route
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = filter === 'All Assemblies' 
    ? events 
    : events.filter((e: any) => e.category === filter);

  if (loading) return <div className="bg-[#0b0c0e] min-h-screen text-white flex items-center justify-center font-mono">LOADING ASSEMBLIES...</div>;

  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      <section className="pt-32 pb-12 max-w-7xl mx-auto px-8">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 font-bold uppercase">Party with The Brand</span>
        <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight mt-4">
          Party <span className="italic font-normal text-amber-400">After</span> Party
        </h1>
        <p className="text-sm text-slate-400 mt-4 max-w-md">
          Join us for a series of Events and Gatherings that celebrate The <span className="italic font-normal text-amber-400">You Only Live Once</span> experience.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-8 mb-16 flex flex-wrap gap-3 border-b border-white/5 pb-8">
        {['All Assemblies', 'Acoustics', 'Heritage', 'Craft'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 rounded-full uppercase tracking-widest text-[9px] font-mono font-bold transition-all ${
              filter === tab ? 'bg-amber-500 text-black shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {filteredEvents.map((evt: any, idx: number) => (
            <div 
              key={idx} 
              className={`group cursor-pointer ${
                evt.featured ? 'lg:col-span-8 h-[540px]' : 'lg:col-span-4 h-[440px]'
              } rounded-[44px] overflow-hidden relative border border-white/5 flex flex-col justify-end p-8 md:p-12`}
            >
              <img src={evt.img} alt={evt.title} className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-[1.03] transition-transform duration-1000 ease-out brightness-[0.45]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="relative z-10 space-y-4">
                <span className="text-[9px] bg-white/10 border border-white/10 text-amber-400 px-3 py-1 rounded-full uppercase font-mono tracking-wider font-bold">
                  {evt.date}
                </span>
                <h3 className={`${evt.featured ? 'text-3xl md:text-4xl' : 'text-2xl'} font-serif text-white leading-tight`}>
                  {evt.title}
                </h3>
                <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[11px] font-mono text-slate-400">
                  <span>{evt.loc}</span>
                  <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-[9px] font-bold">Inquire →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ); 
}
