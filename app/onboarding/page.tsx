'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Loader2, Building2, User, Phone, Shield, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/GlassButton';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dpaAgreed, setDpaAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [dataTrainingConsent, setDataTrainingConsent] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      // Update the user's password credential in Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password,
      });

      if (passwordError) throw passwordError;

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
            dpa_consented: dpaAgreed,
            dpa_consented_at: new Date().toISOString(),
            privacy_policy_consented: privacyAgreed,
            privacy_policy_consented_at: new Date().toISOString(),
            data_training_consent: dataTrainingConsent,
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
            dpa_consented: dpaAgreed,
            dpa_consented_at: new Date().toISOString(),
            privacy_policy_consented: privacyAgreed,
            privacy_policy_consented_at: new Date().toISOString(),
            data_training_consent: dataTrainingConsent,
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

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: 'Weak', colorClass: 'bg-[#e6e6e6]' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', colorClass: 'bg-red-500' };
    if (score === 2) return { score: 2, text: 'Medium', colorClass: 'bg-orange-500' };
    if (score === 3) return { score: 3, text: 'Strong', colorClass: 'bg-green-500' };
    return { score: 4, text: 'Very Strong · 12+ characters, mixed case, numbers', colorClass: 'bg-[#1aae39]' };
  };

  const strength = getPasswordStrength();

  // Twinkle positions
  const stars = [
    { top: '12%', left: '12%', delay: '0s', size: 'w-[2px] h-[2px]' },
    { top: '18%', left: '42%', delay: '0.8s', size: 'w-[3px] h-[3px]' },
    { top: '8%', left: '72%', delay: '1.4s', size: 'w-[2px] h-[2px]' },
    { top: '54%', left: '8%', delay: '0.4s', size: 'w-[3px] h-[3px]' },
    { top: '64%', left: '84%', delay: '1.8s', size: 'w-[2px] h-[2px]' },
    { top: '84%', left: '32%', delay: '1.1s', size: 'w-[2px] h-[2px]' },
    { top: '88%', left: '62%', delay: '0.3s', size: 'w-[3px] h-[3px]' },
  ];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f6f5f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0075de] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] bg-[#f6f5f4] font-sans selection:bg-[#0075de]/20">
      {/* ============ LEFT: NIGHT PANEL ============ */}
      <aside className="relative bg-[#213183] text-white p-10 lg:p-16 flex flex-col justify-between overflow-hidden">
        {/* Starfield */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {stars.map((star, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full bg-white animate-[twinkle_3.4s_ease-in-out_infinite] ${star.size}`}
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
              }}
            />
          ))}
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none" />
        </div>

        {/* Floating stickers */}
        <div className="absolute top-[32%] right-[14%] hidden xl:flex w-[60px] h-[60px] rounded-2xl bg-gradient-to-b from-[#d6b6f6] to-[#b48be0] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-[8deg] animate-[float_6s_ease-in-out_infinite] z-10">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#391c57" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </div>
        <div className="absolute top-[60%] right-[8%] hidden xl:flex w-[48px] h-[48px] rounded-[11px] bg-gradient-to-b from-[#4dc8c4] to-[#2a9d99] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center rotate-[6deg] animate-[float_6s_ease-in-out_infinite] [animation-delay:1.8s] z-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0e3d3b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
        </div>
        <div className="absolute bottom-[22%] right-[36%] hidden xl:flex w-[44px] h-[44px] rounded-xl bg-gradient-to-b from-[#ff8a3b] to-[#dd5b00] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-[4deg] animate-[float_6s_ease-in-out_infinite] [animation-delay:2.6s] z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"></path></svg>
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2 self-start">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white text-[#213183] font-extrabold text-[15px] tracking-tighter">E</span>
          <span className="font-bold text-[17px] tracking-tight text-white">Enma</span>
        </Link>

        <div className="relative z-10 mt-auto pt-16">
          <div className="inline-block px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold tracking-wider text-[#d6b6f6] uppercase mb-6">
            Step 1 of 1 · Almost done
          </div>
          <h1 className="font-sans text-[48px] lg:text-[54px] font-bold leading-[1.04] tracking-[-1.875px] mb-5 text-white">
            Set up your<br />firm in 2 minutes.
          </h1>
          <p className="text-[17px] leading-[1.55] text-white/75 max-w-[420px] mb-9">
            A few details, two consent boxes, and you&apos;re ready to connect Enma to Telegram.
          </p>

          <div className="flex flex-col gap-4.5 mb-12">
            {[
              'DPA signed before any data flows',
              "Zero LLM training on your clients' data",
              'Secure Telegram bind in under 2 minutes',
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d6b6f6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-[16px] text-white/90">{point}</span>
              </div>
            ))}
          </div>

          {/* Testimonial block */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[15px] leading-[1.55] text-white mb-4 font-medium italic">
              &quot;We cut document chasing by 14 hours a week. The DPA workflow alone was worth the switch — our auditor finally has a clean trail.&quot;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff8fd6] to-[#d6b6f6] text-white flex items-center justify-center font-bold text-[13px]">
                PV
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">Priya Verma, FCA</div>
                <div className="text-[12px] text-white/60">Managing Partner · Verma LLP</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ============ RIGHT: FORM PANEL ============ */}
      <section className="p-10 lg:p-16 flex flex-col justify-between bg-[#f6f5f4] text-black">
        {/* User context top right */}
        <div className="flex justify-end items-center gap-1.5 text-[13px] text-[#615d59] mb-8">
          <span>Signed in as</span>
          <span className="font-semibold text-black">{user.email}</span>
          <button
            onClick={async () => {
              const supabase = getSupabase();
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="text-[#0075de] hover:underline ml-2"
          >
            Switch
          </button>
        </div>

        <div className="max-w-[520px] w-full mx-auto my-auto">
          <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] mb-2 text-black">
            Complete your firm profile.
          </h2>
          <p className="text-[15px] text-[#615d59] mb-9">
            This is what your clients will see when Enma talks to them on Telegram.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            <div>
              <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">CA firm name</label>
              <div className="relative">
                <input
                  type="text"
                  name="firmName"
                  placeholder="e.g. Sharma & Co"
                  required
                  value={formData.firmName}
                  onChange={handleChange}
                  className="w-full pl-[38px] pr-3.5 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">Your name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="caName"
                    placeholder="Suresh Sharma"
                    required
                    value={formData.caName}
                    onChange={handleChange}
                    className="w-full pl-[38px] pr-3.5 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">Phone</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-[38px] pr-3.5 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">Create login password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-[38px] pr-10 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a39e98] hover:text-black transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* Password strength visualizer */}
              {password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${
                          index <= strength.score ? strength.colorClass : 'bg-[#e6e6e6]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[12px] text-[#615d59] mt-1.5">
                    {strength.text}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#31302e] mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-[38px] pr-10 py-2.5 border border-[#ddd] rounded-md text-[15px] text-black bg-white outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98]"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a39e98]" />
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

            {/* Consent Card */}
            <div className="bg-white border border-[#e6e6e6] rounded-xl p-5 mt-1.5 flex flex-col gap-3.5">
              <div className="text-[11px] font-bold tracking-wider text-[#615d59] uppercase mb-0.5">
                Consent (Legally Logged)
              </div>

              {/* DPA Consent */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    required
                    checked={dpaAgreed}
                    onChange={(e) => setDpaAgreed(e.target.checked)}
                    className="peer appearance-none w-[18px] h-[18px] border border-[#ddd] rounded bg-white checked:bg-[#0075de] checked:border-[#0075de] transition-all cursor-pointer"
                  />
                  <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[14px] text-[#31302e] group-hover:text-black transition-colors leading-relaxed">
                  I agree to the{' '}
                  <Link href="/dpa" target="_blank" rel="noopener noreferrer" className="text-[#0075de] hover:underline underline-offset-2 font-medium">
                    Data Processing Agreement (DPA)
                  </Link>
                  . Consent will be timestamped and IP‑logged server‑side.
                </span>
              </label>

              {/* Privacy Policy Consent */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    required
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="peer appearance-none w-[18px] h-[18px] border border-[#ddd] rounded bg-white checked:bg-[#0075de] checked:border-[#0075de] transition-all cursor-pointer"
                  />
                  <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[14px] text-[#31302e] group-hover:text-black transition-colors leading-relaxed">
                  I agree to the{' '}
                  <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0075de] hover:underline underline-offset-2 font-medium">
                    Privacy Policy
                  </Link>{' '}
                  and consent to my firm&apos;s data being processed for Enma&apos;s authorized operations.
                </span>
              </label>

              {/* optional training consent */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={dataTrainingConsent}
                    onChange={(e) => setDataTrainingConsent(e.target.checked)}
                    className="peer appearance-none w-[18px] h-[18px] border border-[#ddd] rounded bg-white checked:bg-[#0075de] checked:border-[#0075de] transition-all cursor-pointer"
                  />
                  <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[14px] text-[#615d59] group-hover:text-[#31302e] transition-colors leading-relaxed">
                  <span className="text-black font-medium">Optional —</span> I consent to use of anonymized, aggregated data to improve Enma&apos;s AI models. <span className="text-[#a39e98]">(Default: off.)</span>
                </span>
              </label>
            </div>

            {/* Submit button matching design rounded blue pill */}
            <button
              type="submit"
              disabled={!dpaAgreed || !privacyAgreed || loading}
              className="w-full mt-2.5 py-3.5 px-4 bg-[#0075de] hover:bg-[#005bb5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium text-[15px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Complete setup & enter dashboard
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.4]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 font-medium text-[12px] text-[#615d59] mt-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1aae39" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Your data is encrypted at rest with AES‑256</span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
