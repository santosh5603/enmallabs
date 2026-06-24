'use client';

import { useDashboard } from '../dashboard-context';
import { formatCurrency } from '@/hooks/use-dashboard-data';
import { useState } from 'react';
import { BarChart3, Download, FileText, CheckCircle, Clock, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const { firmData, stats, clients, documentCount, clientCount } = useDashboard();
  const [downloading, setDownloading] = useState<string | null>(null);

  const totalAmount = stats?.totalAmount || 0;
  const processingRate = stats?.processingRate || 0;

  // Generate and download client-side CSV
  const handleExport = (type: 'documents' | 'clients') => {
    setDownloading(type);
    setTimeout(() => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      
      if (type === 'clients') {
        csvContent += 'Client Name,Documents Count,Total Reconciled Amount,Last Activity,Document Types\n';
        clients.forEach(c => {
          csvContent += `"${c.name}",${c.documentCount},${c.totalAmount},"${new Date(c.lastActivity).toLocaleDateString('en-IN')}",${c.documentTypes.join('; ')}\n`;
        });
      } else {
        csvContent += 'Metric,Value\n';
        csvContent += `Total Documents,${stats?.totalDocuments || 0}\n`;
        csvContent += `Extracted Documents,${stats?.extractedDocuments || 0}\n`;
        csvContent += `Failed Documents,${stats?.failedDocuments || 0}\n`;
        csvContent += `Pending Documents,${stats?.pendingDocuments || 0}\n`;
        csvContent += `Success Rate,${processingRate}%\n`;
        csvContent += `Total Amount Reconciled,₹${totalAmount}\n`;
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `enma_report_${type}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(null);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2" style={{ letterSpacing: '-0.75px' }}>Reports & Analytics</h1>
        <p className="text-[#615d59] text-sm">Analyze your firm&apos;s data, track compliance metrics, and download financial reports.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0075de]/10 flex items-center justify-center text-[#0075de] shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#615d59]/70 mb-0.5">Success Rate</div>
            <div className="text-2xl font-bold text-black">{processingRate}%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">System operational</div>
          </div>
        </div>

        <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ff8a3b]/10 flex items-center justify-center text-[#ff8a3b] shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#615d59]/70 mb-0.5">Reconciled Value</div>
            <div className="text-2xl font-bold text-black">{formatCurrency(totalAmount)}</div>
            <div className="text-[11px] text-[#615d59]/70 mt-0.5">Across {clientCount} active clients</div>
          </div>
        </div>

        <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#d6b6f6]/15 flex items-center justify-center text-[#391c57] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#615d59]/70 mb-0.5">Total processed</div>
            <div className="text-2xl font-bold text-black">{documentCount} docs</div>
            <div className="text-[11px] text-[#615d59]/70 mt-0.5">Trial plan resets in 13 days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Download Panel */}
        <div className="lg:col-span-2 bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-1.5 text-black">Available Reports</h3>
          <p className="text-[#615d59] text-xs mb-6">Generate and export spreadsheet-compatible CSV files of your firm&apos;s activity.</p>
          
          <div className="space-y-4">
            <ReportItem 
              title="Overview & Summarized Stats" 
              description="A summary sheet containing processing rates, document counts, and value reconciliation figures."
              loading={downloading === 'documents'}
              onExport={() => handleExport('documents')}
            />
            <ReportItem 
              title="Client Reconcile & Directory" 
              description="Full breakdown of all registered clients, their document counts, total value, and latest activity logs."
              loading={downloading === 'clients'}
              onExport={() => handleExport('clients')}
            />
          </div>
        </div>

        {/* Right Info Box */}
        <div className="bg-[#213183] text-white rounded-[20px] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div>
            <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase block mb-2">TAX RECONCILIATION</span>
            <h3 className="text-xl font-bold mb-3">Audit Readiness</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              All processed data is automatically indexed and cross-referenced with your clients. You can download the reports to prepare for monthly GST audits.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Compliance Index</span>
              <span className="font-bold text-emerald-400">100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportItem({ title, description, loading, onExport }: { title: string; description: string; loading: boolean; onExport: () => void }) {
  return (
    <div className="flex items-start justify-between p-4 border border-[#e6e6e6] rounded-xl hover:bg-black/[0.01] transition-all">
      <div className="min-w-0 pr-4">
        <h4 className="text-sm font-bold text-black mb-1">{title}</h4>
        <p className="text-xs text-[#615d59] leading-relaxed">{description}</p>
      </div>
      <button 
        onClick={onExport} 
        disabled={loading}
        className="px-4 py-2 bg-[#f6f5f4] border border-[#e6e6e6] rounded-lg text-xs font-semibold text-black hover:bg-black/[0.04] transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5" />
        {loading ? 'Exporting...' : 'Export CSV'}
      </button>
    </div>
  );
}
