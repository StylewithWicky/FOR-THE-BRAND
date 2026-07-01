import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0b0c0e] text-white min-h-screen font-sans selection:bg-amber-500 py-32">
      <div className="max-w-3xl mx-auto px-8">
        <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 font-bold uppercase">
          Legal Docs
        </span>
        <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-12">
          Privacy <span className="italic font-normal text-amber-400">Policy</span>
        </h1>

        <div className="space-y-8 text-slate-400 text-sm leading-relaxed font-light">
          

          <section>
            <h3 className="text-white font-bold mb-2 font-mono uppercase tracking-wider text-[11px]">1. Introduction</h3>
            <p>Welcome to YOLO CONNECT. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2 font-mono uppercase tracking-wider text-[11px]">2. Information We Collect</h3>
            <p>We collect information that you voluntarily provide to us, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Identity Data:</strong> Full name, email address, and phone number.</li>
              <li><strong>Authentication Data:</strong> Securely stored credentials required for account access.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our platform.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2 font-mono uppercase tracking-wider text-[11px]">3. How We Use Your Data</h3>
            <p>We use the information we collect to manage your member account, facilitate your trip planning experiences, communicate event updates, and maintain the integrity of our platform security.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2 font-mono uppercase tracking-wider text-[11px]">4. Data Protection</h3>
            <p>We take the security of your data seriously. We do not sell your personal information. Data is only shared with trusted service providers who assist in our operations or when required by law.</p>
          </section>

          <section>
            <h3 className="text-white font-bold mb-2 font-mono uppercase tracking-wider text-[11px]">5. Contact Us</h3>
            <p>If you have questions or concerns about this Privacy Policy, please reach out through our contact channels available on the platform dashboard.</p>
          </section>
        </div>
      </div>
    </div>
  );
}