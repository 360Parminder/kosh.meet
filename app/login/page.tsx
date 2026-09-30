"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Sparkles, Check, AlertCircle, Video } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('kosh@secure123');
    setError(null);
  };

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
    <div className="relative z-50 min-h-screen w-full bg-[#f0f4f9] text-[#1f1f1f] flex flex-col justify-between items-center p-4 sm:p-6 font-sans select-none">
      {/* Centered Sign-In Card */}
      <div className="my-auto w-full max-w-[448px] bg-white rounded-3xl p-8 sm:p-10 border border-[#dadce0] shadow-sm flex flex-col">
        {/* Kosh Meet Logo & Header */}
        <div className="flex flex-col items-start mb-6">
          <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[#0b57d0] rounded-xl text-white">
            <Video className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-[#444746] mt-1.5 font-normal">
            to continue to <span className="font-medium text-[#1f1f1f]">Kosh Meet</span>
          </p>
        </div>

        {/* Quick Login Auto-fill Chip */}
        <div className="mb-6 p-3 rounded-2xl bg-[#c2e7ff]/30 border border-[#c2e7ff] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[#001d35]">
            <Sparkles className="w-4 h-4 text-[#0b57d0] shrink-0" />
            <span>
              Demo user: <strong>parminder@kosh.com</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickLogin('parminder@kosh.com')}
            className="text-[11px] font-semibold text-[#0b57d0] hover:bg-[#c2e7ff] px-2.5 py-1 rounded-full transition-colors shrink-0"
          >
            Autofill
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Input */}
          <div>
            <label className="block text-xs font-medium text-[#444746] mb-1.5">
              Email or phone
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. parminder@kosh.com"
              className="w-full h-13 px-4 rounded-xl border border-[#747775] focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/20 outline-none text-[#1f1f1f] text-sm transition-all bg-white"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-medium text-[#444746] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-13 px-4 pr-12 rounded-xl border border-[#747775] focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/20 outline-none text-[#1f1f1f] text-sm transition-all bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#5f6368] hover:text-[#1f1f1f] transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs text-[#0b57d0] hover:underline cursor-pointer font-medium">
              Forgot password?
            </span>
          </div>

          {/* Notice */}
          <div className="pt-3 text-xs text-[#444746] leading-relaxed">
            Not your computer? Use Guest mode to sign in privately.{' '}
            <span className="text-[#0b57d0] hover:underline cursor-pointer">Learn more</span>
          </div>

          {/* Bottom Form Actions */}
          <div className="pt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleQuickLogin('parminder@kosh.com')}
              className="text-sm font-medium text-[#0b57d0] hover:text-[#0842a0] hover:underline cursor-pointer"
            >
              Create account
            </button>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="h-11 px-7 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] active:bg-[#06337a] disabled:opacity-50 text-white font-medium text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Next</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Page Footer */}
      <footer className="w-full max-w-[448px] flex items-center justify-between text-xs text-[#444746] py-3">
        <span>English (United States)</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#1f1f1f] cursor-pointer">Help</span>
          <span className="hover:text-[#1f1f1f] cursor-pointer">Privacy</span>
          <span className="hover:text-[#1f1f1f] cursor-pointer">Terms</span>
        </div>
      </footer>
    </div>
  );
}
