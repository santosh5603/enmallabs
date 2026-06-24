'use client';

import { useState, useCallback } from 'react';
import { useDashboard } from '../dashboard-context';
import { useDocuments, formatRelativeTime, formatCurrency, formatDocType } from '@/hooks/use-dashboard-data';
import type { DocumentRecord, DocumentFilters } from '@/hooks/use-dashboard-data';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { EmptyState, TableSkeleton } from '@/components/dashboard/EmptyState';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { DocumentDetailModal } from '@/components/dashboard/DocumentDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, Eye, IndianRupee, Calendar, Send, ArrowUpDown } from 'lucide-react';

export default function DocumentsPage() {
  const { firmData, firmLoading } = useDashboard();
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '', documentType: null, processingStatus: null,
    dateFrom: null, dateTo: null, vendor: null,
  });
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortAsc, setSortAsc] = useState(false);

  const { documents, loading, totalCount } = useDocuments(firmData?.id || null, filters);

  const updateFilter = useCallback((key: keyof DocumentFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const sortedDocs = [...documents].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'created_at') {
      cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortField === 'total_amount') {
      cmp = (a.total_amount || 0) - (b.total_amount || 0);
    } else if (sortField === 'vendor_name') {
      cmp = (a.vendor_name || '').localeCompare(b.vendor_name || '');
    }
    return sortAsc ? cmp : -cmp;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const isLoading = firmLoading || loading;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Documents</h1>
          <p className="text-[#615d59] text-sm">
            {totalCount > 0
              ? `${totalCount} document${totalCount !== 1 ? 's' : ''} processed`
              : 'All documents processed by Enma appear here'}
          </p>
        </div>
      </div>

      {/* Filters */}
      {(documents.length > 0 || filters.search || filters.documentType || filters.processingStatus) && (
        <FilterBar
          search={filters.search}
          onSearchChange={(v) => updateFilter('search', v)}
          searchPlaceholder="Search by file name, vendor, buyer..."
          filters={[
            {
              key: 'type', label: 'Type',
              options: [
                { value: 'purchase_invoice', label: 'Purchase Invoice' },
                { value: 'sale_invoice', label: 'Sale Invoice' },
                { value: 'bank_statement', label: 'Bank Statement' },
                { value: 'unknown', label: 'Unknown' },
              ],
              value: filters.documentType,
              onChange: (v) => updateFilter('documentType', v),
            },
            {
              key: 'status', label: 'Status',
              options: [
                { value: 'extracted', label: 'Extracted' },
                { value: 'failed', label: 'Failed' },
                { value: 'received', label: 'Received' },
              ],
              value: filters.processingStatus,
              onChange: (v) => updateFilter('processingStatus', v),
            },
          ]}
          resultCount={totalCount}
        />
      )}

      {/* Content */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : documents.length === 0 && !filters.search && !filters.documentType && !filters.processingStatus ? (
        <div className="space-y-6">
          <EmptyState
            icon={FileText}
            title="No Documents Yet"
            description="Documents will appear here as they're processed by the Enma bot. Forward invoices, bills, or bank statements to get started."
          />
          <div className="max-w-lg mx-auto bg-white border border-[#e6e6e6] rounded-[20px] p-8 text-center shadow-sm">
            <h3 className="text-lg font-bold text-black mb-3">How to Add Documents</h3>
            <p className="text-xs text-[#615d59] mb-6 leading-relaxed">
              Forward any invoice, bill, or bank statement to the Enma Telegram bot. The AI will automatically extract data and categorize the document.
            </p>
            <a
              href={firmData?.id ? `https://t.me/enma12bot?start=${firmData.id}` : "https://t.me/enma12bot"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#229ED9] text-white text-sm font-bold hover:bg-[#1e8cc1] transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              Open Telegram Bot
            </a>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Results Found"
          description="Try adjusting your filters or search terms."
          action={{ label: 'Clear Filters', onClick: () => setFilters({ search: '', documentType: null, processingStatus: null, dateFrom: null, dateTo: null, vendor: null }) }}
        />
      ) : (
        /* Documents Table */
        <div className="w-full overflow-x-auto border border-[#e6e6e6] rounded-[20px] bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-[#615d59]/70 min-w-[768px]">
            <div className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-black transition-colors" onClick={() => handleSort('vendor_name')}>
              Vendor / File <ArrowUpDown className="w-3 h-3" />
            </div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-black transition-colors" onClick={() => handleSort('total_amount')}>
              Amount <ArrowUpDown className="w-3 h-3" />
            </div>
            <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-black transition-colors" onClick={() => handleSort('created_at')}>
              Date <ArrowUpDown className="w-3 h-3" />
            </div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#e6e6e6]">
            {sortedDocs.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedDoc(doc)}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-black/[0.01] transition-all cursor-pointer group min-w-[768px]"
              >
                <div className="col-span-3 min-w-0">
                  <p className="text-sm font-semibold text-black truncate group-hover:text-[#0075de] transition-colors">
                    {doc.vendor_name || doc.buyer_name || 'Unknown'}
                  </p>
                  <p className="text-[11px] text-[#615d59]/70 truncate mt-0.5">{doc.original_file_name}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <StatusBadge status={doc.document_type || 'unknown'} />
                </div>
                <div className="col-span-2 flex items-center">
                  <StatusBadge status={doc.processing_status} />
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm font-semibold text-black">
                    {doc.total_amount ? formatCurrency(doc.total_amount) : '—'}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-xs text-[#615d59]/80">{formatRelativeTime(doc.created_at)}</span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <button className="w-8 h-8 rounded-lg bg-black/[0.03] flex items-center justify-center text-[#615d59]/50 hover:text-black hover:bg-black/[0.08] transition-all opacity-0 group-hover:opacity-100">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      <DocumentDetailModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}
