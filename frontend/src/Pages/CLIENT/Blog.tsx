import React, { useState, useEffect } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetch('/api/v1/blog') 
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      setPosts(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to load journal:", err);
      setLoading(false);
    });
}, []);
  const getGridSize = (idx: number) => {
    return (idx % 2 === 0) ? "md:col-span-7" : "md:col-span-5";
  };

  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 overflow-x-hidden">
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-8 border-b border-white/5">
        <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white">
          The <span className="italic font-normal text-amber-400">Yolo</span> Journal
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mt-4 font-bold">Essays on human dynamics, aesthetics, and uncharted flow.</p>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {loading ? (
          <p className="text-white/20 font-mono text-sm col-span-12 text-center">ReLaX NiKuPaNgE...</p>
        ) : (
          posts.map((post, idx) => (
            <div 
              key={post.id} 
              className={`${getGridSize(idx)} bg-white/[0.02] border border-white/5 rounded-[40px] p-10 flex flex-col justify-between min-h-[380px] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 group cursor-pointer`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-slate-500">
                <span className="uppercase text-amber-500 font-bold">// {post.category || "General"}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white/90 leading-snug group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 font-light mt-4 line-clamp-2 max-w-md">
                  {post.excerpt || "Exploring the subtle undercurrents..."}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 group-hover:text-white transition-colors">Read Entry →</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}