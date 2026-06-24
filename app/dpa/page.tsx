'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Users, Activity } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DPAPage() {
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
              Data Processing Addendum (DPA)
            </h1>
            <p className="text-[#615d59] text-sm font-medium">Last updated: June 7, 2026</p>
          </div>

          {/* Core Info Icons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] shadow-sm">
              <Users className="w-8 h-8 text-[#0075de] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-black">Controller / Processor</h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                Clarifies roles: your firm is the Data Controller, Enma Labs is the Data Processor.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] shadow-sm">
              <Shield className="w-8 h-8 text-[#0075de] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-black">Security Measures</h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                We implement industry-grade technical safeguards to prevent unauthorized data access.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#e6e6e6] shadow-sm">
              <Activity className="w-8 h-8 text-[#0075de] mb-4" />
              <h3 className="text-lg font-bold mb-2 text-black">Compliance Assured</h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                Enables firms to demonstrate compliance with standard data protection regulations.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-none space-y-10 font-sans text-[#31302e] leading-[1.7] text-[16px]">
            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                1. Scope and Applicability
              </h2>
              <p>
                This Data Processing Addendum (&quot;DPA&quot;) governs the processing of personal and business data
                provided by the Chartered Accountant Firm (&quot;Customer&quot; or &quot;Controller&quot;) to Enma Labs
                (&quot;Processor&quot;) in connection with the Enma automation services. This DPA is integrated into,
                and forms part of, our Terms of Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                2. Roles and Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Controller:</strong> The Customer determines the purposes and means of processing personal
                  data, controls files uploaded to the Telegram bot or dashboard, and ensures the necessary consents
                  are in place before processing begins.
                </li>
                <li>
                  <strong>Processor:</strong> Enma Labs processes personal and business data solely on the Customer&apos;s
                  written instructions, including the metadata extraction, OCR processing, and automated auditing
                  requested through the platform dashboard.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                3. Processor Obligations
              </h2>
              <p>
                As Processor, Enma Labs agrees to:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Process data only on documented instructions from the Controller, including with respect to transfer
                  of data outside the originating country.
                </li>
                <li>
                  Ensure that all personnel authorized to process personal data have committed themselves to confidentiality
                  agreements or are under an appropriate statutory obligation of confidentiality.
                </li>
                <li>
                  Implement technical and organizational measures to assist the Controller in responding to requests
                  from data subjects exercising their legal rights (e.g., access, deletion, correction).
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                4. Security Measures
              </h2>
              <p>
                Enma Labs will maintain appropriate technical and organizational safeguards to protect data from
                accidental loss, alteration, unauthorized disclosure, or access:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Pseudonymization & Encryption:</strong> All client records are logically isolated using Postgres
                  Row-Level Security. Database tables and storage buckets are encrypted using AES-256 at rest and HTTPS/TLS
                  in transit.
                </li>
                <li>
                  <strong>System Resilience:</strong> Automated backups, distributed container services, and physical
                  redundancies to ensure continuous service availability.
                </li>
                <li>
                  <strong>Incident Response:</strong> Regular vulnerability scanning and immediate incident logging in
                  our system logs.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                5. Sub-processors
              </h2>
              <p>
                Customer authorizes Processor to engage sub-processors to perform infrastructure services necessary
                to deliver the platform. We bind all sub-processors to standard contractual clauses ensuring
                an equivalent level of data protection. Our primary sub-processor list includes:
              </p>
              <table className="w-full text-left border-collapse border border-[#e6e6e6] mt-4 text-sm text-[#615d59]">
                <thead>
                  <tr className="bg-[#f6f5f4] text-black">
                    <th className="p-3 border border-[#e6e6e6] font-bold">Sub-processor</th>
                    <th className="p-3 border border-[#e6e6e6] font-bold">Service Description</th>
                    <th className="p-3 border border-[#e6e6e6] font-bold">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 border border-[#e6e6e6] font-semibold text-black">Supabase Inc.</td>
                    <td className="p-3 border border-[#e6e6e6]">Database Hosting, Auth, and Storage</td>
                    <td className="p-3 border border-[#e6e6e6]">United States (AWS)</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3 border border-[#e6e6e6] font-semibold text-black">Vercel Inc.</td>
                    <td className="p-3 border border-[#e6e6e6]">Frontend Application Hosting & Deployment</td>
                    <td className="p-3 border border-[#e6e6e6]">Global CDN</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                6. Incident Notification & Audit Rights
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Breach Notification:</strong> In the event of a verified security incident affecting Controller
                  data, Enma Labs will notify the Customer within 72 hours of detection and provide regular updates.
                </li>
                <li>
                  <strong>Audits:</strong> Enma Labs will provide reasonable compliance summaries, configuration reports,
                  and documentation to allow the Customer to verify compliance with this DPA.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl text-black font-bold mb-3 border-b border-[#e6e6e6] pb-2">
                7. Data Return and Deletion
              </h2>
              <p>
                Upon termination of the service agreement, Enma Labs will delete all Customer-provided personal and
                financial documents, along with all associated database records, within 30 days, unless statutory
                storage obligations require longer retention.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
