"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Save user to localStorage for instant client hydration
      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem('kosh_meet_user', JSON.stringify(data.user));
        localStorage.setItem('kosh_meet_username', data.user.name || data.user.username);
      }

      // Smoothly navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
      {/* Left Panel - Hidden on small screens */}
      <div className="hidden lg:flex w-1/2 p-4">
        <div className="relative w-full h-full rounded-[32px] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#9a3412]">
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
          ></div>
          
          {/* Radial glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/20 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-orange-500 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.88 12.88L14.46 16l-3.3-3.3-1.06 1.06V16H8V8h2.1v4.7l4.36-4.36L15.88 9l-3.3 3.3 3.3 2.58z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">Welcome Back</h1>
            <p className="text-white/90 text-[17px] max-w-sm leading-relaxed drop-shadow-sm font-medium">
              Sign in to access your dashboard, manage domains, and view your inbox.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-[400px]">
          <h2 className="text-[32px] font-bold text-white mb-2 tracking-tight">Sign In</h2>
          <p className="text-[#a1a1aa] text-[15px] mb-10">Enter your credentials to continue.</p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-white/90 tracking-wide">Email Address</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-12 px-4 rounded-xl bg-[#131316] border border-white/5 text-white placeholder-[#52525b] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors outline-none text-[15px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-white/90 tracking-wide">Password</label>
                <button type="button" className="text-[13px] font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-[#131316] border border-white/5 text-white placeholder-[#52525b] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors outline-none text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#52525b] hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full h-12 rounded-xl bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] transition-all mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
