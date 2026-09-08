import React, { useState } from 'react';
import { AuthValues } from '../lib/auth-schema';

interface MemberFormProps {
  onSuccess: (data: AuthValues & { isSignup: boolean; full_name?: string; phone_number?: string }) => Promise<any>;
}

export default function MemberForm({ onSuccess }: MemberFormProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);


  const handleModeToggle = () => {
    setIsSignup(!isSignup);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhone('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSignup) {
      if (!fullName.trim() || !phone.trim()) {
        setError('Please fill in all registration fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Verification failed.');
        return;
      }
    }

    setSubmitting(true);
    try {
      await onSuccess({
        email,
        password,
        isSignup,
        full_name: isSignup ? fullName.trim() : undefined,
        phone_number: isSignup ? phone.trim() : undefined,
      });
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'An authentication error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
          [!] {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <>
            <div className="border-b border-white/10 pb-1">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="e.g., Brent " 
                className="w-full bg-transparent border-none text-white focus:outline-none text-sm placeholder:text-slate-600 py-1" 
                disabled={submitting}
                required 
              />
            </div>
            <div className="border-b border-white/10 pb-1">
              <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+254 700 000000" 
                className="w-full bg-transparent border-none text-white focus:outline-none text-sm placeholder:text-slate-600 py-1" 
                disabled={submitting}
                required 
              />
            </div>
          </>
        )}

        <div className="border-b border-white/10 pb-1">
          <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="name@domain.com" 
            className="w-full bg-transparent border-none text-white focus:outline-none text-sm placeholder:text-slate-600 py-1" 
            disabled={submitting}
            required 
          />
        </div>

        <div className="border-b border-white/10 pb-1">
          <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="w-full bg-transparent border-none text-white focus:outline-none text-sm placeholder:text-slate-600 py-1" 
            disabled={submitting}
            required 
          />
        </div>

        {isSignup && (
          <div className="border-b border-white/10 pb-1">
            <label className="block text-[9px] uppercase font-mono text-slate-500 tracking-widest mb-1">Verify Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full bg-transparent border-none text-white focus:outline-none text-sm placeholder:text-slate-600 py-1" 
              disabled={submitting}
              required 
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-white text-black hover:bg-amber-500 transition-all py-4 rounded-xl text-xs uppercase font-mono font-bold tracking-widest disabled:opacity-50 mt-4"
        >
          {submitting ? 'Processing Network Data...' : isSignup ? 'Claim Membership Blueprint →' : 'Authorize Grid Access →'}
        </button>
      </form>

      <div className="text-center pt-2">
        <button 
          type="button"
          onClick={handleModeToggle}
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors font-light"
        >
          {isSignup ? "Already have structural clearance? Log in" : "Don't have a profile matrix? Create an account"}
        </button>
      </div>
    </div>
  );
}