'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f4] text-black font-sans flex flex-col selection:bg-[#0075de]/20">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden bg-white md:bg-[#f6f5f4]">
        {/* Decorative background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,117,222,0.03),transparent)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Back Button */}
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-[#615d59] hover:text-black transition-colors mb-10 group font-medium text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Onboarding
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-[40px] md:text-[48px] font-bold mb-3 leading-tight tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-[#615d59] text-sm font-medium">Last updated: June 7, 2026</p>
          </div>

          {/* Core Info Icons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] shadow-sm">
              <Lock className="w-8 h-8 text-[#0075de] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-black">Secure Encryption</h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                All data, documents, and client records are encrypted in transit and at rest.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] shadow-sm">
              <Shield className="w-8 h-8 text-[#0075de] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-black">Strict Isolation</h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                Logical database isolation guarantees your firm&apos;s data can never leak to another.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] shadow-sm">
              <Eye className="w-8 h-8 text-[#0075de] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-black">Data Transparency</h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                We only process data required for OCR extraction and authorized CA operations.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-none space-y-10 font-sans text-[#31302e] leading-[1.7] text-[16px]">
            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                1. Scope & Applicability
              </h2>
              <p>
                This Privacy Policy applies to the processing of personal and business data by Enma Labs
                (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) in connection with the provision of the Enma CA automation platform.
                As a cloud service provider, we act primarily as a <strong>Processor</strong> of data uploaded by
                Chartered Accountants (&quot;Firms&quot;) and their clients.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                2. Information We Collect
              </h2>
              <p>
                To provide our automation services, we collect and process several categories of information:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Account Credentials:</strong> Name, business email, firm name, phone number, and
                  authenticated profile data from authentication services (e.g., Google login).
                </li>
                <li>
                  <strong>Financial & Tax Documents:</strong> PDF, image, and text files uploaded via the Telegram
                  bot interface or the dashboard. This includes B2B/B2C invoices, freight bills, import manifests,
                  and professional services bills containing details like GSTIN, PAN, tax amounts, and trade names.
                </li>
                <li>
                  <strong>System Logs & Usage Statistics:</strong> IP address, device metadata, processing latency,
                  API token usage, and client error logs generated during your usage of the platform.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                3. How We Process and Use Information
              </h2>
              <p>
                We use the collected information solely to perform our contractual duties:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>OCR Data Extraction:</strong> Extracting structured data fields (e.g., invoice numbers,
                  reconciliation variables, vendor names) from uploaded documents.
                </li>
                <li>
                  <strong>Automated Tax Reconciliation:</strong> Providing five optimization variables: claim, defer,
                  block, RCM (Reverse Charge Mechanism), and TDS (Tax Deducted at Source).
                </li>
                <li>
                  <strong>AI Assitant Support:</strong> Responding to natural language tax and client-specific questions
                  prompted inside the secure chat portal.
                </li>
                <li>
                  <strong>Improving Models (Optional):</strong> With your explicit consent, we may utilize anonymized,
                  aggregated data (with personal identifying details scrubbed) to retrain our local extraction models.
                  We never train models on raw client files or personal identifiers.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                4. Data Sharing & Sub-processors
              </h2>
              <p>
                We do not sell, rent, or trade your firm&apos;s or clients&apos; data to third parties. We only share information
                with trusted sub-processors necessary to run the infrastructure (e.g., hosting services, secure database
                platforms, and isolated API runtimes) under strict contractual terms. A list of current sub-processors is
                maintained in our Data Processing Addendum (DPA).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                5. Security and Logical Isolation
              </h2>
              <p>
                We implement industry-standard technical and organizational security measures:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>End-to-End Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest
                  using AES-256.
                </li>
                <li>
                  <strong>Logical Data Isolation:</strong> Every firm&apos;s dataset is isolated inside our PostgreSQL schema
                  and governed by rigorous Row-Level Security (RLS) policies at the database engine level.
                </li>
                <li>
                  <strong>Access Control:</strong> Administrative and telegram bot tokens are encrypted at rest and accessible
                  only to authorized server components.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                6. Data Retention & Deletion
              </h2>
              <p>
                We retain your records only as long as your account remains active or as required by law. Upon termination
                of your subscription, all document records, transaction logs, and firm data will be permanently and securely
                deleted from our active systems within 30 days.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                7. Contact Us
              </h2>
              <p>
                If you have questions about our data processing, security controls, or this Privacy Policy, please
                reach out to our privacy officer at:
              </p>
              <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] mt-4 inline-block shadow-sm">
                <p className="text-black font-bold">Enma Labs Privacy Team</p>
                <a
                  href="mailto:privacy@enmalabs.com"
                  className="text-[#0075de] hover:text-[#005bb5] font-bold transition-colors mt-1 inline-block"
                >
                  privacy@enmalabs.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
