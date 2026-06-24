'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FileText, Link as LinkIcon, ShieldCheck, ScrollText, Lock, Zap, Check, X, Sparkles, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { TelegramPreview } from '@/components/TelegramPreview';
import { GlassButton } from '@/components/GlassButton';
import { ScrollProgressBar } from '@/components/FramerAnimations';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import SmoothScroll from '@/components/SmoothScroll';
import { useRef } from 'react';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const howItWorksRef = useRef<HTMLElement>(null);

  // Twinkle positions
  const stars = [
    { top: '14%', left: '8%', delay: '0s', size: 'w-[2px] h-[2px]' },
    { top: '24%', left: '18%', delay: '0.6s', size: 'w-[3px] h-[3px]' },
    { top: '8%', left: '32%', delay: '1.2s', size: 'w-[2px] h-[2px]' },
    { top: '18%', left: '52%', delay: '1.8s', size: 'w-[2px] h-[2px]' },
    { top: '30%', left: '72%', delay: '0.4s', size: 'w-[3px] h-[3px]' },
    { top: '12%', left: '88%', delay: '2.4s', size: 'w-[2px] h-[2px]' },
    { top: '62%', left: '6%', delay: '1.1s', size: 'w-[2px] h-[2px]' },
    { top: '78%', left: '24%', delay: '2.0s', size: 'w-[3px] h-[3px]' },
    { top: '84%', left: '46%', delay: '0.9s', size: 'w-[2px] h-[2px]' },
    { top: '72%', left: '78%', delay: '1.6s', size: 'w-[2px] h-[2px]' },
    { top: '90%', left: '92%', delay: '0.3s', size: 'w-[3px] h-[3px]' },
  ];

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-black selection:bg-accent/20 font-sans">
      <Navbar />

      <SmoothScroll>
        {/* SECTION 2 — HERO (DARK INDIGO NIGHT BAND) */}
        <section className="relative overflow-hidden bg-[#213183] text-white py-24 md:py-32 px-6">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none" />
          </div>

          {/* Floating Stickers - Left Side */}
          <div className="absolute top-[18%] left-[7%] hidden xl:flex w-16 h-16 rounded-2xl bg-gradient-to-b from-[#d6b6f6] to-[#b48be0] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-8 animate-[float_6s_ease-in-out_infinite] z-10">
            <FileText className="w-7 h-7 text-[#391c57]" />
          </div>
          <div className="absolute top-[60%] left-[11%] hidden xl:flex w-14 h-14 rounded-2xl bg-gradient-to-b from-[#ff8fd6] to-[#ff64c8] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center rotate-6 animate-[float_6s_ease-in-out_infinite] [animation-delay:1.4s] z-10">
            <Sparkles className="w-6 h-6 text-[#5b1a3e]" />
          </div>
          <div className="absolute top-[36%] left-[2%] hidden xl:flex w-12 h-12 rounded-xl bg-gradient-to-b from-[#44c97f] to-[#1aae39] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.35)] items-center justify-center -rotate-4 animate-[float_6s_ease-in-out_infinite] [animation-delay:2.6s] z-10">
            <Check className="w-5 h-5 text-[#0a3d18] stroke-[3]" />
          </div>

          {/* Floating Stickers - Right Side */}
          <div className="absolute top-[14%] right-[8%] hidden xl:flex w-16 h-16 rounded-2xl bg-gradient-to-b from-[#ff8a3b] to-[#dd5b00] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center rotate-8 animate-[float_6s_ease-in-out_infinite] [animation-delay:0.8s] z-10">
            <Zap className="w-7 h-7 text-[#793400] fill-[#793400] stroke-none" />
          </div>
          <div className="absolute top-[52%] right-[6%] hidden xl:flex w-14 h-14 rounded-2xl bg-gradient-to-b from-[#4dc8c4] to-[#2a9d99] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-6 animate-[float_6s_ease-in-out_infinite] [animation-delay:2.0s] z-10">
            <ShieldCheck className="w-7 h-7 text-[#0e3d3b]" />
          </div>
          <div className="absolute top-[30%] right-[2%] hidden xl:flex w-12 h-12 rounded-xl bg-gradient-to-b from-[#8cc6f5] to-[#62aef0] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center rotate-4 animate-[float_6s_ease-in-out_infinite] [animation-delay:1.2s] z-10">
            <MessageSquare className="w-5 h-5 text-[#0e3a66]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <motion.div variants={fadeUpVariant} className="mb-8">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-white">
                  <span className="bg-white text-[#213183] px-1.5 py-0.5 rounded font-bold text-[10px]">NEW</span>
                  First commercial AI agent for CA firms
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUpVariant}
                className="text-5xl md:text-7xl lg:text-[84px] font-bold leading-[1.0] tracking-tight mb-8 text-white max-w-4xl"
              >
                Meet Enma —<br />
                your firm&apos;s <span className="italic font-semibold text-[#d6b6f6]">night shift.</span>
              </motion.h1>

              <motion.p
                variants={fadeUpVariant}
                className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed mb-10"
              >
                The AI Chief of Staff that reads invoices, reconciles bank statements, answers tax queries, and onboards clients — all through Telegram. Enterprise‑secure. Legally compliant.
              </motion.p>

              <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-16">
                <GlassButton
                  href="/signin"
                  variant="white"
                  className="px-8 py-4 text-[16px] w-full sm:w-auto"
                >
                  Get Enma free
                </GlassButton>
                <GlassButton
                  href="/book-demo"
                  variant="secondary"
                  className="px-8 py-4 text-[16px] border-white/25 hover:border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Request a demo
                </GlassButton>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="flex flex-col items-center gap-4">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/50">
                  Trusted by CA firms across India
                </span>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-70">
                  {['SHARMA & CO', 'VERMA LLP', 'KP TAX', 'MEHTA ASSOCIATES', 'NAIR & PATEL'].map((logo) => (
                    <span key={logo} className="text-sm md:text-base font-bold tracking-wider text-white">
                      {logo}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2.5 — TELEGRAM PREVIEW DEMO */}
        <section className="relative bg-white py-24 md:py-32 border-b border-[#e6e6e6] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,117,222,0.02),transparent)] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-[#f6f5f4] text-[#0075de] text-xs font-semibold tracking-wider rounded-full mb-4 uppercase">
                A Seamless Experience
              </span>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 text-black">
                Lives where your clients<br />already are.
              </h2>
              <p className="text-base md:text-lg text-[#615d59] max-w-xl mx-auto">
                Clients forward documents directly to Enma on Telegram. No new app to learn. No new login. It just works.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-[#e6e6e6] rounded-[24px] p-8 md:p-12 shadow-[0_4px_18px_rgba(0,0,0,0.03)]">
              {/* Telegram App Mock */}
              <div className="flex justify-center">
                <TelegramPreview />
              </div>

              {/* Text Description */}
              <div className="space-y-8">
                <span className="inline-block px-3 py-1 bg-[#f6f5f4] text-[#0075de] text-xs font-semibold tracking-wider rounded-full uppercase">
                  Live Example
                </span>
                <h3 className="text-3xl md:text-4xl font-bold leading-none tracking-tight text-black">
                  From a forwarded PDF<br />to a reconciled entry<br />
                  <span className="text-[#0075de]">in 3 seconds.</span>
                </h3>
                <p className="text-[#615d59] leading-relaxed text-base">
                  Enma reads the invoice, pulls the vendor, amount, GSTIN, and GST breakdown, matches it against the bank, and posts it to your dashboard — without anyone in your team typing a thing.
                </p>

                <div className="flex flex-col gap-4 font-medium">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#d6b6f6] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-[#391c57]" />
                    </span>
                    <span>OCR extraction · zero manual entry</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#4dc8c4] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-[#0e3d3b]" />
                    </span>
                    <span>GST + bank reconciliation, instant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#ff8a3b] flex items-center justify-center shrink-0">
                      <ScrollText className="w-4 h-4 text-[#793400]" />
                    </span>
                    <span>Auto‑filed to the right ledger</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — SOCIAL PROOF MARQUEE */}
        <section className="py-12 bg-white border-b border-[#e6e6e6] overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-6 mb-6 text-center">
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#a39e98]">
              Built on infrastructure you trust
            </span>
          </div>
          <div className="flex whitespace-nowrap overflow-hidden relative w-full">
            {/* Marquee Track */}
            <div className="flex animate-[marquee_45s_linear_infinite] min-w-max">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-16 px-8">
                  {['Supabase', 'Telegram', 'PostgreSQL', 'FastAPI', 'n8n', 'Firebase', 'Vercel', 'Anthropic'].map((badge, j) => (
                    <div key={j} className="text-xl font-bold tracking-wider text-[#a39e98] px-2">
                      {badge}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — PROBLEM STATEMENT */}
        <section className="py-24 md:py-32 relative bg-white overflow-hidden border-b border-[#e6e6e6]">
          <div className="absolute inset-0 bg-noise pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeUpVariant} className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#f6f5f4] text-[#0075de] text-xs font-semibold tracking-wider rounded-full uppercase">
                    The Problem
                  </span>
                </motion.div>
                <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-black tracking-tight">
                  Traditional CA<br />workflows are<br />broken.
                </motion.h2>
                <motion.p variants={fadeUpVariant} className="text-lg text-[#615d59] leading-relaxed mb-10">
                  Your team spends more time chasing documents than doing actual CA work. That&apos;s not a people problem — it&apos;s a systems problem.
                </motion.p>

                <div className="flex flex-col gap-6">
                  {[
                    { title: 'Hours lost daily to document chasing', desc: 'WhatsApp threads and email chains with no audit trail.' },
                    { title: 'Zero consent logging', desc: 'No legal record of when clients agreed to share data.' },
                    { title: 'Inconsistent client onboarding', desc: 'Every CA does it differently. Nothing is repeatable.' },
                    { title: 'Manual responses to every tax query', desc: 'Repetitive GST questions consume senior CA time.' },
                  ].map((point, i) => (
                    <motion.div key={i} variants={fadeUpVariant} className="flex items-start gap-4">
                      <div className="mt-1 w-5.5 h-5.5 rounded-full bg-[#fbe9e0] flex items-center justify-center shrink-0">
                        <X className="w-3 h-3 text-[#dd5b00] stroke-[3]" />
                      </div>
                      <div>
                        <span className="font-bold text-black text-base">{point.title}</span>
                        <p className="text-[#615d59] text-sm mt-0.5 leading-relaxed">{point.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Mock Inbox Visual */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                className="relative h-[560px] w-full"
              >
                <div className="absolute top-0 right-0 w-[90%] h-full bg-white border border-[#e6e6e6] rounded-2xl p-6 flex flex-col gap-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] z-10">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#e6e6e6]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c940]" />
                    <span className="font-medium text-xs text-[#615d59] ml-2">Inbox — 247 unread</span>
                  </div>

                  {/* Mail Mockups */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-[#fff8eb] border border-orange-200/50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-[#ff64c8] text-white flex items-center justify-center font-bold text-sm">A</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13px] text-black">Anita — re: invoice June</div>
                      <div className="text-xs text-[#615d59] mt-0.5 truncate">Hi, sending PDF...</div>
                    </div>
                    <span className="bg-[#dd5b00] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">URGENT</span>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e6e6e6] rounded-xl opacity-90">
                    <div className="w-9 h-9 rounded-full bg-[#62aef0] text-white flex items-center justify-center font-bold text-sm">R</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-black">Rohit — bank stmt Q2</div>
                      <div className="text-xs text-[#615d59] mt-0.5 truncate">Forwarded to you yest...</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e6e6e6] rounded-xl opacity-80">
                    <div className="w-9 h-9 rounded-full bg-[#1aae39] text-white flex items-center justify-center font-bold text-sm">S</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-black">Sneha — quick GST Q</div>
                      <div className="text-xs text-[#615d59] mt-0.5 truncate">Is RCM applicable...</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e6e6e6] rounded-xl opacity-60">
                    <div className="w-9 h-9 rounded-full bg-[#d6b6f6] text-[#391c57] flex items-center justify-center font-bold text-sm">M</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] text-black">Manish — receipts attached</div>
                      <div className="text-xs text-[#615d59] mt-0.5 truncate">17 photos · please...</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#e6e6e6] rounded-xl opacity-40">
                    <div className="w-9 h-9 rounded-full bg-[#a39e98] text-white flex items-center justify-center font-bold text-sm">+</div>
                    <div className="flex-grow text-[13px] text-[#615d59]">242 more...</div>
                  </div>
                </div>

                {/* Floating Stamp */}
                <div className="absolute bottom-4 left-0 bg-white border border-[#e6e6e6] rounded-xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex items-center gap-4 -rotate-3 z-20">
                  <div className="w-9 h-9 rounded-lg bg-[#dd5b00] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#a39e98] tracking-widest block uppercase">YOUR TEAM</span>
                    <span className="font-bold text-base text-black mt-0.5 block">14 hrs / week chasing docs</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — KEY FEATURES */}
        <section id="features" className="py-24 md:py-32 bg-white border-b border-[#e6e6e6] relative overflow-hidden">
          <div className="glowing-orb-blue animate-float-delayed top-[20%] -right-[15%] opacity-40" />
          <div className="absolute inset-0 bg-noise pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUpVariant} className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#f6f5f4] text-[#0075de] text-xs font-semibold tracking-wider rounded-full uppercase">
                  Features
                </span>
              </motion.div>
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-black">
                Everything your firm needs.<br />
                Nothing it doesn&apos;t.
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-[#615d59] max-w-xl mx-auto mt-4 leading-relaxed">
                Built specifically for the way Indian CA firms actually run — through Telegram, with strict consent boundaries, and zero room for IDOR risk.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Card spanning 2 cols */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                whileHover={{ y: -4 }}
                className="md:col-span-2 bg-white border border-[#e6e6e6] rounded-2xl p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden group shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
              >
                {/* Header visual */}
                <div className="h-36 rounded-lg bg-gradient-to-br from-[#d6b6f6] to-[#b48be0] flex items-center justify-center relative overflow-hidden mb-6">
                  <span className="absolute top-4 left-4 bg-white/70 text-[#391c57] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase z-10">
                    OCR + LLM
                  </span>
                  
                  {/* Floating invoice card mock */}
                  <div className="bg-white rounded-xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-[75%] -rotate-2">
                    <div className="flex justify-between items-center text-[10px] text-[#a39e98] mb-1 font-bold">
                      <span>INVOICE #4291</span>
                      <span>26 Jun 2026</span>
                    </div>
                    <div className="font-bold text-sm text-black mb-1.5 truncate">TechVista Pvt Ltd</div>
                    <div className="flex justify-between items-center border-t border-[#f0efed] pt-2 mt-2">
                      <span className="text-[10px] text-[#615d59]">Amount due</span>
                      <span className="font-bold text-sm text-black">₹1,24,500</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1aae39]" />
                      <span className="text-[10px] font-bold text-[#1aae39] uppercase">RECONCILED · GST 18%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Instant invoice &amp; statement processing</h3>
                  <p className="text-sm text-[#615d59] leading-relaxed">
                    Clients forward PDFs to Enma on Telegram. OCR extraction and GST reconciliation happen automatically — no manual data entry, no copy-paste, no errors.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#e6e6e6] rounded-2xl p-8 flex flex-col justify-between min-h-[340px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
              >
                <div className="h-36 rounded-lg bg-gradient-to-br from-[#4dc8c4] to-[#2a9d99] flex items-center justify-center relative mb-6">
                  <span className="absolute top-4 left-4 bg-white/70 text-[#0e3d3b] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                    V2 ARCH
                  </span>
                  <Lock className="w-14 h-14 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Token‑based auth. Zero IDOR risk.</h3>
                  <p className="text-sm text-[#615d59] leading-relaxed">
                    Every onboarding link is a cryptographic one‑time token that expires in 30 minutes. Raw firm IDs are never exposed in any URL.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#e6e6e6] rounded-2xl p-8 flex flex-col justify-between min-h-[340px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
              >
                <div className="h-36 rounded-lg bg-gradient-to-br from-[#ff8a3b] to-[#dd5b00] flex items-center justify-center relative mb-6">
                  <span className="absolute top-4 left-4 bg-white/70 text-[#793400] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                    ONE‑CLICK
                  </span>
                  <LinkIcon className="w-14 h-14 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Secure Telegram onboarding</h3>
                  <p className="text-sm text-[#615d59] leading-relaxed">
                    Clients tap a single deep link — identity verified, Telegram bound to your firm. No passwords, no confusion, no cross‑firm leakage.
                  </p>
                </div>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#e6e6e6] rounded-2xl p-8 flex flex-col justify-between min-h-[340px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
              >
                <div className="h-36 rounded-lg bg-gradient-to-br from-[#8cc6f5] to-[#62aef0] flex items-center justify-center relative mb-6">
                  <span className="absolute top-4 left-4 bg-white/70 text-[#0e3a66] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                    LEGAL
                  </span>
                  <ScrollText className="w-14 h-14 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Built‑in DPA workflow</h3>
                  <p className="text-sm text-[#615d59] leading-relaxed">
                    Every firm digitally signs a Data Processing Agreement before any data flows. Consent is timestamped, IP‑logged, and stored server‑side — permanently auditable.
                  </p>
                </div>
              </motion.div>

              {/* Card 5 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#e6e6e6] rounded-2xl p-8 flex flex-col justify-between min-h-[340px] shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
              >
                <div className="h-36 rounded-lg bg-gradient-to-br from-[#ff8fd6] to-[#ff64c8] flex items-center justify-center relative mb-6">
                  <span className="absolute top-4 left-4 bg-white/70 text-[#5b1a3e] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                    REAL‑TIME
                  </span>
                  <Zap className="w-14 h-14 text-white fill-white stroke-none" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Tax queries answered in seconds</h3>
                  <p className="text-sm text-[#615d59] leading-relaxed">
                    Clients ask GST, TDS, and reconciliation questions directly to Enma. Standard queries are handled instantly — freeing your senior CAs for the hard ones.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — SECURITY DEEP DIVE */}
        <section id="security" className="py-24 md:py-32 relative bg-white overflow-hidden border-b border-[#e6e6e6]">
          <div className="glowing-orb animate-float bottom-0 -left-[10%] opacity-40" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeUpVariant} className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#f6f5f4] text-[#0075de] text-xs font-semibold tracking-wider rounded-full uppercase">
                    Security
                  </span>
                </motion.div>
                <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-black tracking-tight">
                  Security you can<br />actually explain<br />to clients.
                </motion.h2>
                <motion.p variants={fadeUpVariant} className="text-base text-[#615d59] leading-relaxed mb-10">
                  We didn&apos;t bolt security on after the fact. The V2 architecture was rebuilt from the ground up to eliminate every known attack surface — including the IDOR issue present in V1.
                </motion.p>

                <div className="flex flex-col gap-6">
                  {[
                    { title: 'Token‑based Telegram handshake', desc: 'Raw firm IDs never transmitted in any link or URL.' },
                    { title: '30‑minute one‑time tokens', desc: 'Cryptographically invalidated immediately after use.' },
                    { title: 'Server‑side consent logging', desc: 'IP, timestamp, firm ID captured at the moment of DPA acceptance.' },
                    { title: 'Logical data isolation, per firm', desc: 'Every CA firm\'s data sits in a fully separated logical partition.' },
                    { title: 'Zero LLM training guarantee', desc: 'Client documents are never used to train any public AI model.' },
                  ].map((point, i) => (
                    <motion.div key={i} variants={fadeUpVariant} className="flex items-start gap-4">
                      <div className="mt-1 w-5.5 h-5.5 rounded-full bg-[#e7f3e9] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#1aae39] stroke-[3]" />
                      </div>
                      <div>
                        <span className="font-bold text-black text-base">{point.title}</span>
                        <p className="text-[#615d59] text-sm mt-0.5 leading-relaxed">{point.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Security Visual */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariant}
                className="hidden lg:block bg-white border border-[#e6e6e6] rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-center gap-2.5 pb-4 border-b border-[#e6e6e6] mb-4">
                  <Lock className="w-4 h-4 text-[#a39e98]" />
                  <span className="text-[10px] font-bold tracking-widest text-[#615d59] uppercase">SECURITY AUDIT LOG · LIVE</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-[#1aae39] font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1aae39] animate-pulse" />STREAMING
                  </span>
                </div>
                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    { time: '14:23:01', action: 'TOKEN_GENERATED', status: 'VALID', bg: 'bg-[#e0effc] text-[#0075de]' },
                    { time: '14:24:12', action: 'DPA_CONSENT_LOGGED', status: 'SECURE', bg: 'bg-[#e7f3e9] text-[#1aae39]' },
                    { time: '14:24:15', action: 'TELEGRAM_HANDSHAKE', status: 'SUCCESS', bg: 'bg-[#e7f3e9] text-[#1aae39]' },
                    { time: '14:24:16', action: 'TOKEN_STATUS', status: 'INVALIDATED', bg: 'bg-[#fef0e9] text-[#dd5b00]' },
                    { time: '14:30:00', action: 'DATA_PARTITION', status: 'ISOLATED', bg: 'bg-[#e7f3e9] text-[#1aae39]' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#f6f5f4]">
                      <div className="flex items-center gap-4">
                        <span className="text-[#a39e98]">{log.time}</span>
                        <span className="text-[#31302e] font-medium">{log.action}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.bg}`}>{log.status}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-6 border-t border-[#e6e6e6] pt-6 mt-6">
                  <div>
                    <span className="text-[10px] font-bold text-[#a39e98] tracking-widest block uppercase">UPTIME</span>
                    <span className="font-bold text-xl text-black mt-0.5 block">99.99%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#a39e98] tracking-widest block uppercase">SOC2</span>
                    <span className="font-bold text-xl text-black mt-0.5 block">In progress</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#a39e98] tracking-widest block uppercase">ENCRYPTION</span>
                    <span className="font-bold text-xl text-black mt-0.5 block">AES‑256</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — HOW IT WORKS */}
        <section id="how-it-works" ref={howItWorksRef} className="py-24 md:py-32 bg-white border-b border-[#e6e6e6] relative overflow-hidden">
          <div className="absolute inset-0 bg-noise pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            {/* Progress Bar */}
            <div className="absolute -left-12 top-0 bottom-0 hidden lg:block">
              <ScrollProgressBar containerRef={howItWorksRef} />
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUpVariant} className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#f6f5f4] text-[#0075de] text-xs font-semibold tracking-wider rounded-full uppercase">
                  How It Works
                </span>
              </motion.div>
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight text-black">
                Up and running in 3 steps.
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="flex flex-col gap-6"
            >
              {[
                { num: '01', title: 'Register & sign the DPA', desc: 'Create your CA firm account. Digitally sign the legally binding Data Processing Agreement. Consent is logged server‑side instantly — with timestamp and IP for a permanent audit trail.', right: (
                  <div className="bg-white border border-[#e6e6e6] rounded-xl p-4.5 flex flex-col gap-2.5 max-w-[240px] w-full font-medium">
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-4.5 h-4.5 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-xs text-black">Firm details</span>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-4.5 h-4.5 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-xs text-black">DPA signed</span>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="w-4.5 h-4.5 rounded-full bg-[#f6f5f4] border border-[#e6e6e6] shrink-0" />
                      <span className="text-xs text-[#a39e98]">Telegram bound</span>
                    </div>
                  </div>
                )},
                { num: '02', title: 'Connect Enma to Telegram', desc: 'Click Connect Enma to Telegram. A cryptographically secure one‑time deep link is generated, embedded with a 30‑minute token. Click it — Telegram is bound to your firm and the link self‑destructs after first use.', right: (
                  <div className="bg-white border border-[#e6e6e6] rounded-xl p-4.5 font-mono text-[11px] max-w-[240px] w-full">
                    <div className="text-[#a39e98] mb-2 font-bold tracking-tight">deep link · 27:43</div>
                    <div className="color-black word-break-all leading-normal text-slate-800">t.me/enma12bot?start=<span className="text-accent font-bold">tok_d1f4a8...</span></div>
                    <div className="mt-3 pt-3 border-t border-[#e6e6e6] flex items-center gap-1.5 text-[9px] font-bold text-[#1aae39] uppercase font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1aae39]" />ONE‑TIME · SIGNED
                    </div>
                  </div>
                )},
                { num: '03', title: 'Let Enma handle the rest', desc: 'Clients forward invoices, bank statements, and tax queries directly to Enma. Your AI Chief of Staff processes, reconciles, files, and responds — instantly. Your team only sees the exceptions that need human judgment.', right: (
                  <div className="bg-white border border-[#e6e6e6] rounded-xl p-4.5 flex flex-col gap-2.5 max-w-[240px] w-full">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#615d59] font-medium">Autopilot</span>
                      <span className="text-[#1aae39] font-bold">▲ 23%</span>
                    </div>
                    <div className="text-2xl font-bold text-black tracking-tight">142 docs</div>
                    <div className="flex gap-1.5">
                      <div className="flex-1 h-1 bg-[#1aae39] rounded-full" />
                      <div className="flex-1 h-1 bg-[#1aae39] rounded-full" />
                      <div className="flex-1 h-1 bg-[#1aae39] rounded-full" />
                      <div className="flex-1 h-1 bg-[#e6e6e6] rounded-full" />
                    </div>
                    <div className="text-[10px] text-[#615d59] leading-tight">126 auto‑filed · 12 review · 4 flagged</div>
                  </div>
                )},
              ].map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUpVariant}
                  className="bg-[#f6f5f4] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center"
                >
                  <span className="text-7xl md:text-8xl font-black text-accent/20 leading-none shrink-0 tracking-tighter">{step.num}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-black tracking-tight">{step.title}</h3>
                    <p className="text-[#615d59] leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </div>
                  <div className="shrink-0 flex justify-center w-full md:w-auto">
                    {step.right}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 8 — PRICING COMING SOON */}
        <section id="pricing" className="py-24 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center"
            >
              <motion.div variants={fadeUpVariant} className="mb-5">
                <span className="inline-block px-3 py-1 bg-[#f6f5f4] text-[#0075de] text-xs font-semibold tracking-wider rounded-full uppercase">
                  Pricing
                </span>
              </motion.div>
              <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
                Pricing coming soon.
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-[#615d59] max-w-lg mx-auto leading-relaxed mb-10">
                We&apos;re finalising our plans. Early access is free — sign up now and be the first to know when pricing goes live.
              </motion.p>
              <motion.div variants={fadeUpVariant}>
                <GlassButton href="/signin" variant="primary" className="px-8 py-3 text-[15px]">
                  Get early access — it&apos;s free
                </GlassButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 9 — FINAL CTA BANNER (DARK INDIGO NIGHT BAND) */}
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="relative overflow-hidden bg-[#213183] text-white rounded-[24px] py-20 px-8 md:px-16 text-center shadow-2xl"
            >
              {/* Starfield */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[18%] left-[14%] w-[2px] h-[2px] rounded-full bg-white animate-twinkle" />
                <div className="absolute top-[36%] left-[22%] w-[3px] h-[3px] rounded-full bg-white animate-twinkle [animation-delay:1.2s]" />
                <div className="absolute top-[62%] left-[8%] w-[2px] h-[2px] rounded-full bg-white animate-twinkle [animation-delay:0.4s]" />
                <div className="absolute top-[22%] right-[18%] w-[3px] h-[3px] rounded-full bg-white animate-twinkle [animation-delay:1.8s]" />
                <div className="absolute top-[72%] right-[10%] w-[2px] h-[2px] rounded-full bg-white animate-twinkle [animation-delay:0.7s]" />
              </div>

              {/* Floating Stickers */}
              <div className="absolute top-[18%] left-[8%] hidden lg:flex w-13 h-13 rounded-2xl bg-gradient-to-b from-[#d6b6f6] to-[#b48be0] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-6 animate-float z-10">
                <FileText className="w-5.5 h-5.5 text-[#391c57]" />
              </div>
              <div className="absolute bottom-[14%] right-[8%] hidden lg:flex w-13 h-13 rounded-2xl bg-gradient-to-b from-[#4dc8c4] to-[#2a9d99] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center rotate-6 animate-float [animation-delay:1.5s] z-10">
                <Check className="w-5.5 h-5.5 text-[#0e3d3b] stroke-[3]" />
              </div>
              <div className="absolute top-[62%] right-[18%] hidden lg:flex w-11 h-11 rounded-xl bg-gradient-to-b from-[#ff8a3b] to-[#dd5b00] shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_2px_0_rgba(255,255,255,0.4)] items-center justify-center -rotate-4 animate-float [animation-delay:2.8s] z-10">
                <Zap className="w-5 h-5 text-[#793400] fill-[#793400] stroke-none" />
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 relative z-10 text-white tracking-tight">
                Give your firm<br />
                an AI Chief of Staff.
              </h2>
              <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto leading-relaxed mb-10 relative z-10">
                Join Indian CA firms automating their busiest weeks — without hiring more staff.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10 w-full max-w-md mx-auto">
                <GlassButton
                  href="/signin"
                  variant="white"
                  className="px-8 py-4 text-[15px] w-full sm:w-auto"
                >
                  Create your free account
                </GlassButton>
                <GlassButton
                  href="/book-demo"
                  variant="secondary"
                  className="px-8 py-4 text-[15px] border-white/25 hover:border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Talk to us first
                </GlassButton>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
      <ChatWidget />
    </div>
  );
}
