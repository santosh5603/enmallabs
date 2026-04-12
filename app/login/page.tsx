'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/GlassButton';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Ensure user exists in Supabase
      const { data: existingUser } = await supabase
        .from('ca_firms')
        .select('firebase_uid')
        .eq('firebase_uid', user.uid)
        .single();

      let supabaseError;
      if (existingUser) {
        const { error } = await supabase
          .from('ca_firms')
          .update({
            email: user.email,
            last_login: new Date().toISOString(),
          })
          .eq('firebase_uid', user.uid);
        supabaseError = error;
      } else {
        const { error } = await supabase
          .from('ca_firms')
          .insert({
            firebase_uid: user.uid,
            email: user.email,
            last_login: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        supabaseError = error;
      }

      if (supabaseError) {
        console.error('Supabase sync error:', supabaseError);
        // We don't block login if sync fails, but we log it
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,78,0,0.05),transparent)] pointer-events-none" />

      <Link href="/" className="flex items-center gap-2 group mb-12 relative z-10">
        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(255,78,0,0.8)]" />
        <span className="text-white font-bold text-xl tracking-tight">Enma.</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-3xl p-10 relative z-10"
      >
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-medium mb-3">Welcome Back</h1>
          <p className="text-white/50 text-sm">Sign in to your Enma Labs firm dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white px-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
            />
          </div>
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white px-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-3">
              <a href="#" className="text-[13px] text-accent hover:text-accent-hover transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <GlassButton
            type="submit"
            variant="white"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </GlassButton>
        </form>

        <div className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-white/20 text-xs uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="text-center text-sm text-white/40">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:text-accent transition-colors font-bold">
            Register your CA firm →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
