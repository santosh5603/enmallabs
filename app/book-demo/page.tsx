'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Loader2, Calendar, Clock, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function BookDemoPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    firmName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload: any = {
        name: formData.fullName,
        firm_name: formData.firmName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        created_at: new Date().toISOString(),
      };
      
      if (formData.message.trim()) {
        payload.message = formData.message.trim();
      }

      const { error } = await supabase
        .from('demo_requests')
        .insert(payload);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        fullName: '',
        firmName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting demo request:', error);
      alert('Failed to submit demo request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-black font-sans flex flex-col selection:bg-[#0075de]/20">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 flex items-center relative overflow-hidden bg-white md:bg-[#f6f5f4]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,117,222,0.03),transparent)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-4"
            >
              <h1 className="text-[48px] md:text-[56px] font-bold leading-[1.08] tracking-[-1.5px] mb-6 text-black">
                See Enma in Action
              </h1>
              <p className="text-[18px] md:text-[20px] text-[#615d59] leading-[1.6] mb-10 font-sans">
                Book a free 30-minute walkthrough. We&apos;ll show you Enma handling real CA workflows — live.
              </p>

              <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-black">What you&apos;ll see in the demo:</h3>
                <ol className="space-y-6">
                  {[
                    'Full secure Telegram onboarding flow with live token handshake',
                    'Enma processing a real invoice via OCR — live',
                    'DPA consent logging and audit trail walkthrough',
                    'Dashboard overview and client management',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4.5">
                      <div className="w-9 h-9 rounded-full bg-white border border-[#e6e6e6] flex items-center justify-center shrink-0 text-[#0075de] font-bold text-[15px] shadow-sm">
                        {i + 1}
                      </div>
                      <span className="text-[#31302e] mt-1.5 font-sans text-[15px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] shadow-sm inline-block">
                <p className="text-[#615d59] text-xs mb-1 font-medium">Prefer to email us directly?</p>
                <a href="mailto:reach@enmalabs.com" className="text-[#0075de] hover:text-[#005bb5] font-bold text-lg transition-colors">
                  reach@enmalabs.com
                </a>
              </div>
            </motion.div>

            {/* Right Form Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white border border-[#e6e6e6] rounded-[32px] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#0075de]/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8 text-black tracking-tight">Book Your Free Demo</h2>

                {success ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-emerald-600 stroke-[2.5]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-black">Demo Requested!</h3>
                    <p className="text-[#615d59] mb-8 font-sans">We&apos;ve received your request and will be in touch shortly to confirm your slot.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-6 py-2.5 bg-[#f6f5f4] hover:bg-[#e6e6e6] text-black border border-[#e6e6e6] rounded-full text-sm font-medium transition-colors cursor-pointer"
                    >
                      Book Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name (required)"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#ddd] rounded-md text-black px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98] text-[15px]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="firmName"
                        placeholder="Firm Name (required)"
                        required
                        value={formData.firmName}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#ddd] rounded-md text-black px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98] text-[15px]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email (required)"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#ddd] rounded-md text-black px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98] text-[15px]"
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
                        className="w-full bg-white border border-[#ddd] rounded-md text-black px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98] text-[15px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full bg-white border border-[#ddd] rounded-md text-black px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98] text-[15px] [color-scheme:light]"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="time"
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full bg-white border border-[#ddd] rounded-md text-black px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98] text-[15px] [color-scheme:light]"
                        />
                      </div>
                    </div>
                    <div>
                      <textarea
                        name="message"
                        placeholder="Message / Specific questions (optional)"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#ddd] rounded-md text-black px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#a39e98] text-[15px] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 px-4 bg-[#0075de] hover:bg-[#005bb5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium text-[15px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Book My Free Demo'
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-[#615d59] text-[13px] font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      We&apos;ll confirm your slot within 24 hours via email.
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
