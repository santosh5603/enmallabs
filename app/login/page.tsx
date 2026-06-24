'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock as LockIcon, AlertCircle, Loader2, KeyRound, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f5f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0075de] animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // Check for search params warnings/successes
  useEffect(() => {
    const callbackError = searchParams.get('error');
    if (callbackError) {
      setError('Authentication failed. Please try again.');
    }

    const resetSuccess = searchParams.get('reset');
    if (resetSuccess === 'success') {
      setSuccessMsg('Your password has been successfully reset. Please log in with your new password.');
    }
  }, [searchParams]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const supabase = getSupabase();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Successful login will trigger useAuth redirect to /dashboard
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const supabase = getSupabase();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f6f5f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0075de] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-black font-sans flex flex-col justify-between selection:bg-[#0075de]/20">
      {/* Top Bar Header */}
      <header className="py-5 px-8 md:px-12 flex justify-between items-center bg-[#f6f5f4]">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0075de] text-white font-extrabold text-[15px] tracking-tighter">E</span>
          <span className="font-bold text-[17px] tracking-tight text-black">Enma</span>
        </Link>
        <div className="text-sm text-[#615d59]">
          New here?{' '}
          <Link href="/signin" className="text-[#0075de] font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden bg-white md:bg-[#f6f5f4]">
        {/* Decorative Floating Stickers */}
        <div className="absolute top-[18%] left-[18%] hidden xl:flex w-14 h-14 rounded-2xl bg-gradient-to-b from-[#d6b6f6] to-[#b48be0] shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-[10deg] animate-[float_6s_ease-in-out_infinite] pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#391c57" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </div>
        <div className="absolute top-[24%] right-[16%] hidden xl:flex w-13 h-13 rounded-[12px] bg-gradient-to-b from-[#4dc8c4] to-[#2a9d99] shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center rotate-[8deg] animate-[float_6s_ease-in-out_infinite] [animation-delay:1.6s] pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0e3d3b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
        </div>
        <div className="absolute bottom-[18%] left-[22%] hidden xl:flex w-12 h-12 rounded-[11px] bg-gradient-to-b from-[#ff8a3b] to-[#dd5b00] shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-[6deg] animate-[float_6s_ease-in-out_infinite] [animation-delay:2.4s] pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"></path></svg>
        </div>
        <div className="absolute bottom-[22%] right-[20%] hidden xl:flex w-12 h-12 rounded-[11px] bg-gradient-to-b from-[#8cc6f5] to-[#62aef0] shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center rotate-[6deg] animate-[float_6s_ease-in-out_infinite] [animation-delay:0.8s] pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e3a66" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] bg-white border border-[#e6e6e6] rounded-2xl p-8 md:p-10 relative z-10 shadow-[0_4px_18px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-8">
            <h1 className="text-3px font-bold text-[32px] tracking-[-0.625px] leading-tight text-black mb-2">Welcome back.</h1>
            <p className="text-[15px] text-[#615d59]">Sign in to your CA firm dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm text-center flex items-center gap-2 justify-center">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm text-center flex items-center gap-2 justify-center leading-relaxed">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google OAuth Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-[#e6e6e6] rounded-full text-black text-[15px] font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3.5 my-5">
            <div className="flex-1 h-[1px] bg-[#e6e6e6]" />
            <span className="text-[11px] text-[#a39e98] font-bold tracking-wider uppercase">or with email</span>
            <div className="flex-1 h-[1px] bg-[#e6e6e6]" />
          </div>

          {/* Form */}
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@firm.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[13px] font-medium text-[#31302e]">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#0075de] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                />
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a39e98] hover:text-black transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-3.5 py-3 px-4 bg-[#0075de] hover:bg-[#005bb5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium text-[15px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.4]" />
                </>
              )}
            </button>
          </form>

          {/* Trust Strip */}
          <div className="mt-7 pt-5 border-t border-[#e6e6e6] flex items-center justify-center gap-3.5 flex-wrap text-[11px] text-[#615d59]">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1aae39" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              End‑to‑end encrypted
            </span>
            <span className="text-[#e6e6e6]">·</span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1aae39" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              DPA signed
            </span>
            <span className="text-[#e6e6e6]">·</span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1aae39" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Zero LLM training
            </span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 md:px-12 flex justify-between gap-4 text-xs text-[#615d59] bg-[#f6f5f4] border-t border-[#e6e6e6]/60 flex-wrap">
        <span>© 2026 Enma Labs Pvt Ltd</span>
        <div className="flex gap-4.5">
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/dpa" className="hover:underline">DPA</Link>
          <Link href="/status" className="hover:underline">Status</Link>
        </div>
      </footer>
    </div>
  );
}
