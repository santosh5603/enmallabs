'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ArrowLeft, Loader2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f5f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0075de] animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabase();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (authError) throw authError;
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabase();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: 'email',
      });

      if (verifyError) throw verifyError;

      // Verification succeeded. The auth-context will pick up the session change.
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
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
          Already have an account?{' '}
          <Link href="/login" className="text-[#0075de] font-semibold hover:underline">
            Sign In
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
          <AnimatePresence mode="wait">
            {otpSent ? (
              /* OTP Verification State */
              <motion.div
                key="otp-verify"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#0075de]/10 border border-[#0075de]/20 flex items-center justify-center text-[#0075de]">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h1 className="text-[32px] font-bold tracking-[-0.625px] leading-tight text-black mb-2">Verify Code</h1>
                  <p className="text-[#615d59] text-sm">
                    We sent a 6-digit verification code to
                  </p>
                  <p className="text-[#0075de] font-bold text-sm mt-1">{email}</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm text-center flex items-center gap-2 justify-center">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-[#ddd] rounded-md px-4 py-3.5 text-center text-2xl font-mono tracking-[0.5em] focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 outline-none transition-all placeholder:text-[#a39e98] placeholder:text-sm placeholder:font-sans placeholder:tracking-normal text-black"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 px-4 bg-[#0075de] hover:bg-[#005bb5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium text-[15px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <button
                    onClick={() => handleSendOtp(null as any)}
                    className="text-xs text-[#0075de] hover:underline font-semibold block mx-auto cursor-pointer"
                  >
                    Resend verification code
                  </button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="flex items-center gap-2 mx-auto text-xs text-[#615d59] hover:text-black transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Use a different email
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Sign In Form State */
              <motion.div
                key="signin-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mb-8">
                  <h1 className="text-[32px] font-bold tracking-[-0.625px] leading-tight text-black mb-2">Create Account</h1>
                  <p className="text-[15px] text-[#615d59]">Register your CA firm with Enma Labs.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm text-center flex items-center gap-2 justify-center">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Google OAuth Signup */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-[#e6e6e6] rounded-full text-black text-[15px] font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer mb-6"
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
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="flex-1 h-[1px] bg-[#e6e6e6]" />
                  <span className="text-[11px] text-[#a39e98] font-bold tracking-wider uppercase">or with email</span>
                  <div className="flex-1 h-[1px] bg-[#e6e6e6]" />
                </div>

                {/* Email OTP Input Form */}
                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">Email address</label>
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

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full mt-2 py-3 px-4 bg-[#0075de] hover:bg-[#005bb5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium text-[15px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      <>
                        Send verification code
                        <ArrowRight className="w-4 h-4 text-white stroke-[2.4]" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
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
