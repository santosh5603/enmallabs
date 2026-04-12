'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/GlassButton';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firmName: '',
    caName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const { data: existingUser } = await supabase
        .from('ca_firms')
        .select('firebase_uid')
        .eq('firebase_uid', user.uid)
        .single();

      if (existingUser) {
        const { error: supabaseError } = await supabase
          .from('ca_firms')
          .update({
            email: user.email,
            firm_name: formData.firmName,
            ca_name: formData.caName,
            phone: formData.phone,
            last_login: new Date().toISOString(),
          })
          .eq('firebase_uid', user.uid);
        if (supabaseError) throw supabaseError;
      } else {
        const { error: supabaseError } = await supabase
          .from('ca_firms')
          .insert([{
            firebase_uid: user.uid,
            email: user.email,
            firm_name: formData.firmName,
            ca_name: formData.caName,
            phone: formData.phone,
            last_login: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }]);
        if (supabaseError) throw supabaseError;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="lg:w-1/2 p-8 lg:p-20 flex flex-col justify-between relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,78,0,0.05),transparent)] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group mb-24 inline-flex">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(255,78,0,0.8)]" />
            <span className="text-white font-bold text-xl tracking-tight">Enma.</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl lg:text-6xl font-medium leading-[1.1] mb-12">
              Your firm&apos;s AI Chief of Staff is one step away.
            </h1>

            <div className="space-y-8">
              {[
                'DPA signed before any data flows',
                'Zero LLM training on your clients\' data',
                'Secure Telegram connection in under 2 minutes',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span className="text-white/70 text-lg font-sans">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="lg:w-1/2 p-8 lg:p-20 flex items-center justify-center bg-black border-l border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,78,0,0.03),transparent)] pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="mb-12">
            <h2 className="font-serif text-4xl font-medium mb-3">Create Your Account</h2>
            <p className="text-white/50">Set up your CA firm in under 2 minutes.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="firmName"
                placeholder="Firm Name (required)"
                required
                value={formData.firmName}
                onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white px-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
              />
            </div>
            <div>
              <input
                type="text"
                name="caName"
                placeholder="CA Name (required)"
                required
                value={formData.caName}
                onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white px-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20 hover:bg-white/[0.06] hover:border-white/20"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Admin Email (required)"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white px-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (required)"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white px-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password (required)"
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
            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password (required)"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white px-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
              />
            </div>

            {/* DPA Summary */}
            <div className="h-[160px] overflow-y-auto bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-sm text-white/40 space-y-4 custom-scrollbar">
              <div>
                <strong className="text-white block mb-1">Purpose:</strong>
                Enma Labs uses uploaded documents strictly for OCR extraction, tax reconciliation, and authorized CA operations.
              </div>
              <div>
                <strong className="text-white block mb-1">Isolation:</strong>
                Your firm&apos;s data is logically isolated and encrypted at rest.
              </div>
              <div>
                <strong className="text-white block mb-1">No LLM Training:</strong>
                Your client data is never used to train any public AI model.
              </div>
            </div>

            <label className="flex items-start gap-4 cursor-pointer group py-2">
              <div className="relative flex items-center justify-center mt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded-lg bg-white/5 checked:bg-accent checked:border-accent transition-all cursor-pointer"
                />
                <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-white/50 group-hover:text-white transition-colors leading-relaxed">
                I have read and legally agree to the Data Processing Agreement.
              </span>
            </label>

            <GlassButton
              type="submit"
              variant="white"
              className="w-full mt-4"
              disabled={!agreed || loading}
            >
              {loading ? 'Creating Account...' : 'Create Account & Sign DPA'}
            </GlassButton>
          </form>

          <div className="mt-10 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-accent transition-colors font-bold">
              Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
