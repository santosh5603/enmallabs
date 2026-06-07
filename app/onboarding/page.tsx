'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Loader2, Building2, User, Phone, Shield } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/GlassButton';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    firmName: '',
    caName: '',
    phone: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Check if onboarding is already completed
  useEffect(() => {
    if (!user) return;
    const checkOnboarding = async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('ca_firms')
        .select('onboarding_completed')
        .eq('supabase_user_id', user.id)
        .single();

      if (data?.onboarding_completed) {
        router.push('/dashboard');
      }
    };
    checkOnboarding();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabase();

      // Check if a ca_firms row already exists for this user
      const { data: existingFirm } = await supabase
        .from('ca_firms')
        .select('id')
        .eq('supabase_user_id', user.id)
        .single();

      if (existingFirm) {
        // Update existing row
        const { error: updateError } = await supabase
          .from('ca_firms')
          .update({
            firm_name: formData.firmName,
            ca_name: formData.caName,
            phone: formData.phone,
            email: user.email,
            onboarding_completed: true,
            dpa_consented: true,
            dpa_consented_at: new Date().toISOString(),
            data_training_consent: agreed,
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('supabase_user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Create new row
        const { error: insertError } = await supabase
          .from('ca_firms')
          .insert({
            supabase_user_id: user.id,
            email: user.email,
            firm_name: formData.firmName,
            ca_name: formData.caName,
            phone: formData.phone,
            onboarding_completed: true,
            is_active: true,
            subscription_plan: 'trial',
            dpa_consented: true,
            dpa_consented_at: new Date().toISOString(),
            data_training_consent: agreed,
            last_login: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

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
              Almost there! Set up your firm.
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
            <h2 className="font-serif text-4xl font-medium mb-3">Complete Your Profile</h2>
            <p className="text-white/50">
              Signed in as <span className="text-accent font-medium">{user.email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  name="firmName"
                  placeholder="CA Firm Name"
                  required
                  value={formData.firmName}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white pl-11 pr-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  name="caName"
                  placeholder="Your Name (CA Name)"
                  required
                  value={formData.caName}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white pl-11 pr-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl text-white pl-11 pr-4 py-4 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            {/* DPA & Data Training Consent */}
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
                <strong className="text-white block mb-1">Data Training:</strong>
                By consenting below, you allow anonymized, aggregated data to be used for improving our AI models. Your client&apos;s personally identifiable information is never used.
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
                I agree to the Data Processing Agreement and consent to anonymized data usage for AI model improvement.
              </span>
            </label>

            <GlassButton
              type="submit"
              variant="white"
              className="w-full mt-4"
              disabled={!agreed || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting Up...
                </span>
              ) : (
                'Complete Setup & Enter Dashboard'
              )}
            </GlassButton>
          </form>
        </div>
      </div>
    </div>
  );
}
