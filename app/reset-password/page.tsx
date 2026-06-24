'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock as LockIcon, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f5f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0075de] animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();

      // Update the user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      // Force sign out after successful reset to clear active recovery session
      await supabase.auth.signOut();

      // Redirect to login with success flag
      router.push('/login?reset=success');
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-black font-sans flex flex-col justify-between selection:bg-[#0075de]/20">
      {/* Top Bar Header */}
      <header className="py-5 px-8 md:px-12 flex justify-between items-center bg-[#f6f5f4]">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/enma-logo.svg" alt="Enma" width={28} height={28} className="rounded-lg" />
          <span className="font-bold text-[17px] tracking-tight text-black">Enma</span>
        </Link>
        <div className="text-sm text-[#615d59]">
          Back to{' '}
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

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] bg-white border border-[#e6e6e6] rounded-2xl p-8 md:p-10 relative z-10 shadow-[0_4px_18px_rgba(0,0,0,0.04)]"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-7">
            <Image src="/enma-logo.svg" alt="Enma" width={36} height={36} className="rounded-xl" />
            <span className="font-bold text-[20px] tracking-tight text-black">Enma</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[32px] font-bold tracking-[-0.625px] leading-tight text-black mb-2">New Password</h1>
            <p className="text-[15px] text-[#615d59]">Please set your new password below.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm text-center flex items-center gap-2 justify-center">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="min 8 characters"
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

            <div>
              <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                />
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a39e98] hover:text-black transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full mt-3.5 py-3 px-4 bg-[#0075de] hover:bg-[#005bb5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium text-[15px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.4]" />
                </>
              )}
            </button>
          </form>
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
