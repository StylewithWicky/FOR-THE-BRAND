import React, { useState } from 'react';

const faqData = [
  {
    q: "How do I gain structural clearance?",
    a: "You can sign up via our portal at signup. Once registered, your account is verified, and you will receive access to the member dashboard."
  },
  {
    q: "What is the point system?",
    a: "Points are earned by attending events, completing trips, and contributing to the community. They determine your tier status and unlock exclusive access."
  },
  {
    q: "Can I cancel a scheduled trip?",
    a: "Yes, cancellations are governed by our Cancellation Policy, which you can review in the dashboard or via the footer link."
  },
  {
    q: "How do I contact support?",
    a: "For technical issues or event inquiries, contact us directly via the support channel listed in your member profile , you can also reach out through the 'Contact Us' link in the footer,text us at Whatsapp +254 111 782 146 or email us at yoloconnect@gmail.com"
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen py-32 px-8">
      <div className="max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 font-bold uppercase">FAQ'S</span>
        <h1 className="text-4xl font-serif mt-4 mb-16">Frequently Asked <span className="italic font-normal text-amber-400">Queries</span></h1>

        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <div key={idx} className="border border-white/5 rounded-2xl bg-white/[0.02]">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center"
              >
                <span className="font-mono text-xs">{item.q}</span>
                <span className="text-amber-500">{openIndex === idx ? '−' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-sm text-slate-400 font-light leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}