'use client';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { dot: string; text: string; bg: string; label: string }> = {
  extracted: { dot: 'bg-[#1aae39]', text: 'text-[#1aae39]', bg: 'bg-[#1aae39]/8 border-[#1aae39]/15', label: 'Extracted' },
  failed: { dot: 'bg-[#dd5b00]', text: 'text-[#dd5b00]', bg: 'bg-[#dd5b00]/8 border-[#dd5b00]/15', label: 'Failed' },
  received: { dot: 'bg-[#0075de]', text: 'text-[#0075de]', bg: 'bg-[#0075de]/8 border-[#0075de]/15', label: 'Received' },
  processing: { dot: 'bg-[#dd5b00] animate-pulse', text: 'text-[#dd5b00]', bg: 'bg-[#dd5b00]/8 border-[#dd5b00]/15', label: 'Processing' },
  // Intent tags
  gst_query: { dot: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-500/8 border-purple-500/15', label: 'GST Query' },
  consultant_query: { dot: 'bg-[#0075de]', text: 'text-[#0075de]', bg: 'bg-[#0075de]/8 border-[#0075de]/15', label: 'Consultant' },
  general_chat: { dot: 'bg-gray-400', text: 'text-[#615d59]', bg: 'bg-gray-100 border-gray-200', label: 'Chat' },
  news_search: { dot: 'bg-cyan-600', text: 'text-cyan-600', bg: 'bg-cyan-500/8 border-cyan-500/15', label: 'News' },
  golden_correction: { dot: 'bg-[#dd5b00]', text: 'text-[#dd5b00]', bg: 'bg-[#dd5b00]/8 border-[#dd5b00]/15', label: 'Correction' },
  audit: { dot: 'bg-[#dd5b00]', text: 'text-[#dd5b00]', bg: 'bg-[#dd5b00]/8 border-[#dd5b00]/15', label: 'Audit' },
  task: { dot: 'bg-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-500/8 border-indigo-500/15', label: 'Task' },
  // Document types
  purchase_invoice: { dot: 'bg-[#0075de]', text: 'text-[#0075de]', bg: 'bg-[#0075de]/8 border-[#0075de]/15', label: 'Purchase Invoice' },
  sale_invoice: { dot: 'bg-[#1aae39]', text: 'text-[#1aae39]', bg: 'bg-[#1aae39]/8 border-[#1aae39]/15', label: 'Sale Invoice' },
  bank_statement: { dot: 'bg-purple-600', text: 'text-purple-600', bg: 'bg-purple-500/8 border-purple-500/15', label: 'Bank Statement' },
  unknown: { dot: 'bg-gray-400', text: 'text-[#615d59]', bg: 'bg-gray-100 border-gray-200', label: 'Unknown' },
  chat: { dot: 'bg-gray-400', text: 'text-[#615d59]', bg: 'bg-gray-100 border-gray-200', label: 'Chat' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['unknown'];
  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-0.5 text-[10px]'
    : 'px-3 py-1 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function getStatusConfig(status: string) {
  return statusConfig[status] || statusConfig['unknown'];
}

