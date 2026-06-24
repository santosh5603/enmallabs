'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Calendar, IndianRupee, Building2, Hash, Shield, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatRelativeTime, formatDocType } from '@/hooks/use-dashboard-data';
import type { DocumentRecord } from '@/hooks/use-dashboard-data';

interface DocumentDetailModalProps {
  document: DocumentRecord | null;
  onClose: () => void;
}

export function DocumentDetailModal({ document: doc, onClose }: DocumentDetailModalProps) {
  if (!doc) return null;

  const extracted = doc.extraction_data?.invoice || doc.extraction_data || {};
  const lineItems = extracted?.line_items || [];
  const taxSlabs = extracted?.tax_slabs || [];
  const itcEligible = extracted?.itc_eligible ?? null;
  const processingError = extracted?.processing_error || null;


  return (
    <AnimatePresence>
      {doc && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-[#e6e6e6] z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e6e6e6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0075de]/5 border border-[#0075de]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#0075de]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">Document Details</h2>
                  <p className="text-xs text-[#615d59]/70 truncate max-w-[280px]">{doc.original_file_name}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-black/[0.03] flex items-center justify-center text-[#615d59] hover:text-black hover:bg-black/[0.08] transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* Status & Type */}
              <div className="flex items-center gap-3">
                <StatusBadge status={doc.processing_status} size="md" />
                <StatusBadge status={doc.document_type || 'unknown'} size="md" />
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {doc.vendor_name && (
                  <InfoCard icon={Building2} label="Vendor" value={doc.vendor_name} />
                )}
                {doc.buyer_name && (
                  <InfoCard icon={Building2} label="Buyer" value={doc.buyer_name} />
                )}
                {doc.total_amount && (
                  <InfoCard icon={IndianRupee} label="Total Amount" value={formatCurrency(doc.total_amount)} />
                )}
                {doc.invoice_number && (
                  <InfoCard icon={Hash} label="Invoice #" value={doc.invoice_number} />
                )}
                <InfoCard icon={Calendar} label="Received" value={formatRelativeTime(doc.created_at)} />
                {doc.vendor_gstin && (
                  <InfoCard icon={Shield} label="Vendor GSTIN" value={doc.vendor_gstin} />
                )}
              </div>

              {/* ITC Eligibility */}
              {itcEligible !== null && (
                <div className={`p-4 rounded-2xl border ${itcEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {itcEligible ? (
                      <Shield className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wider ${itcEligible ? 'text-emerald-700' : 'text-red-700'}`}>
                      {itcEligible ? 'ITC Eligible' : 'ITC Not Eligible'}
                    </span>
                  </div>
                  {extracted?.itc_reason && (
                    <p className="text-xs text-[#615d59]/70 mt-1">{extracted.itc_reason}</p>
                  )}
                </div>
              )}

              {/* Line Items */}
              {lineItems.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#615d59] mb-3">Line Items</h3>
                  <div className="bg-white border border-[#e6e6e6] rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-[#e6e6e6]">
                      {lineItems.map((item: any, i: number) => (
                        <div key={i} className="px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-black font-semibold">{item.item_name}</p>
                            {item.hsn_code && <p className="text-[10px] text-[#615d59]/60 mt-0.5">HSN: {item.hsn_code}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-black">{item.total_amount ? formatCurrency(item.total_amount) : '—'}</p>
                            {item.cgst_rate && (
                              <p className="text-[10px] text-[#615d59]/60">GST: {(item.cgst_rate || 0) + (item.sgst_rate || 0)}%</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tax Slabs */}
              {taxSlabs.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#615d59] mb-3">Tax Breakdown</h3>
                  <div className="bg-white border border-[#e6e6e6] rounded-2xl p-4 space-y-3 shadow-sm">
                    {taxSlabs.map((slab: any, i: number) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#615d59]">Taxable Value</span>
                          <span className="text-black font-semibold">{slab.taxable_value ? formatCurrency(slab.taxable_value) : '—'}</span>
                        </div>
                        {slab.cgst_amount && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[#615d59]">CGST ({slab.cgst_rate}%)</span>
                            <span className="text-black font-semibold">{formatCurrency(slab.cgst_amount)}</span>
                          </div>
                        )}
                        {slab.sgst_amount && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[#615d59]">SGST ({slab.sgst_rate}%)</span>
                            <span className="text-black font-semibold">{formatCurrency(slab.sgst_amount)}</span>
                          </div>
                        )}
                        {slab.igst_amount && (
                          <div className="flex justify-between text-xs">
                            <span className="text-[#615d59]">IGST ({slab.igst_rate}%)</span>
                            <span className="text-black font-semibold">{formatCurrency(slab.igst_amount)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Error */}
              {processingError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Processing Error</span>
                  </div>
                  <p className="text-xs text-red-700/80">{processingError}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-[#f6f5f4] border border-[#e6e6e6] rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-[#615d59]/50" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#615d59]/70">{label}</span>
      </div>
      <p className="text-sm text-black font-semibold truncate">{value}</p>
    </div>
  );
}
