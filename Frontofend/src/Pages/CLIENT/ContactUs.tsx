import React, { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    console.log("Sending message:", formData);
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen py-32 px-8">
      <div className="max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 font-bold uppercase">Get in Touch</span>
        <h1 className="text-4xl font-serif mt-4 mb-8">Connect with <span className="italic font-normal text-amber-400">Us</span></h1>
        
       
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <a href="https://wa.me/254111782146" target="_blank" rel="noreferrer" className="p-6 rounded-3xl bg-[#0f1115] border border-white/5 hover:border-amber-500/30 transition-all">
            <span className="block text-[9px] text-slate-500 font-mono uppercase mb-1">WhatsApp</span>
            <span className="font-bold">+254 111 782 146</span>
          </a>
          <a href="mailto:yoloconnect@gmail.com" className="p-6 rounded-3xl bg-[#0f1115] border border-white/5 hover:border-amber-500/30 transition-all">
            <span className="block text-[9px] text-slate-500 font-mono uppercase mb-1">Email</span>
            <span className="font-bold">yoloconnect@gmail.com</span>
          </a>
        </div>

        {status === 'success' ? (
          <div className="p-8 border border-amber-500/30 bg-amber-500/5 rounded-3xl text-center">
            <h2 className="text-xl font-serif">Message Received.</h2>
            <p className="text-slate-400 mt-2 text-sm">We will process your inquiry and get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-500">Full Name</label>
              <input required type="text" className="w-full bg-[#0f1115] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none transition-all" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-500">Email Address</label>
              <input required type="email" className="w-full bg-[#0f1115] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-500">Message</label>
              <textarea required rows={5} className="w-full bg-[#0f1115] border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none transition-all" onChange={(e) => setFormData({...formData, message: e.target.value})} />
            </div>
            <button disabled={status === 'sending'} className="w-full bg-amber-500 text-black font-bold uppercase text-xs py-4 rounded-2xl hover:bg-white transition-all disabled:opacity-50">
              {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}