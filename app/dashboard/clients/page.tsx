'use client';

import { useState, useMemo, useCallback } from 'react';
import { useDashboard } from '../dashboard-context';
import { useDocuments, formatRelativeTime, formatCurrency } from '@/hooks/use-dashboard-data';
import type { DocumentFilters, ClientInfo } from '@/hooks/use-dashboard-data';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { EmptyState, CardGridSkeleton } from '@/components/dashboard/EmptyState';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { DocumentDetailModal } from '@/components/dashboard/DocumentDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, IndianRupee, Send, Building2, X, ArrowLeft, Eye, UserPlus, Loader2, Trash2, Edit3, Save, Plus } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export default function ClientsPage() {
  const { firmData, firmLoading, clients, clientsLoading: loading, refetchClients: refetch } = useDashboard();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredClients = useMemo(() => {
    let result = [...clients];
    if (search) { const q = search.toLowerCase(); result = result.filter(c => c.name.toLowerCase().includes(q)); }
    if (sortBy === 'docs') result.sort((a, b) => b.documentCount - a.documentCount);
    else if (sortBy === 'amount') result.sort((a, b) => b.totalAmount - a.totalAmount);
    else if (sortBy === 'recent') result.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
    return result;
  }, [clients, search, sortBy]);

  const isLoading = firmLoading || loading;

  if (selectedClient) {
    return <ClientDetailView clientName={selectedClient.name} clientId={selectedClient.id || null} firmId={firmData?.id || ''} onBack={() => setSelectedClient(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Clients</h1>
          <p className="text-[#615d59] text-sm">{clients.length > 0 ? `${clients.length} CA client${clients.length !== 1 ? 's' : ''} found` : "Manage your firm's clients"}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0075de] text-white text-[13px] font-bold hover:bg-[#005fb8] transition-all active:scale-95 shadow-sm border border-[#0075de]/10">
          <UserPlus className="w-4 h-4" />Add Client
        </button>
      </div>

      {clients.length > 0 && (
        <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search clients by name..."
          filters={[{
            key: 'sort', label: 'Sort By', options: [
              { value: 'docs', label: 'Most Documents' }, { value: 'amount', label: 'Highest Value' }, { value: 'recent', label: 'Most Recent' },
            ], value: sortBy, onChange: setSortBy
          }]} resultCount={filteredClients.length}
        />
      )}

      {isLoading ? <CardGridSkeleton cards={6} /> : clients.length === 0 ? (
        <div className="space-y-6">
          <EmptyState icon={Users} title="No Clients Yet" description="Add clients manually or they'll appear automatically when documents are processed through the Enma bot."
            action={{ label: 'Add Your First Client', onClick: () => setShowAddModal(true) }} />
          <div className="max-w-2xl mx-auto bg-white border border-[#e6e6e6] rounded-[20px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-black mb-6 text-center">How to Add Clients</h3>
            <div className="space-y-6">
              <HowToStep num="1" title="Add Manually" description='Click "Add Client" above to create a client record directly.' icon={UserPlus} />
              <HowToStep num="2" title="Via Telegram" description="Forward client documents to the Enma bot — clients are auto-detected from invoices." icon={Send} />
              <HowToStep num="3" title="Auto-Detection" description="Enma extracts vendor/buyer names from documents and creates client entries." icon={Building2} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, i) => (
            <motion.div key={client.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setSelectedClient(client)}
              className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 group hover:border-[#ddd] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 cursor-pointer shadow-sm">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0075de]/10 to-[#0075de]/20 border border-[#0075de]/20 flex items-center justify-center font-bold text-sm text-[#0075de] shrink-0">
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-black truncate group-hover:text-[#0075de] transition-colors">{client.name}</h3>
                  <p className="text-[11px] text-[#615d59]/70 mt-0.5">Last active {formatRelativeTime(client.lastActivity)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#f6f5f4] rounded-xl p-3 border border-[#e6e6e6]">
                  <div className="flex items-center gap-1.5 mb-1"><FileText className="w-3 h-3 text-[#615d59]/40" /><span className="text-[10px] text-[#615d59]/70 uppercase font-bold tracking-wider">Docs</span></div>
                  <p className="text-lg font-bold text-black">{client.documentCount}</p>
                </div>
                <div className="bg-[#f6f5f4] rounded-xl p-3 border border-[#e6e6e6]">
                  <div className="flex items-center gap-1.5 mb-1"><IndianRupee className="w-3 h-3 text-[#615d59]/40" /><span className="text-[10px] text-[#615d59]/70 uppercase font-bold tracking-wider">Value</span></div>
                  <p className="text-lg font-bold text-black">{client.totalAmount > 0 ? formatCurrency(client.totalAmount) : '—'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">{client.documentTypes.map(type => <StatusBadge key={type} status={type} />)}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && <AddClientModal firmId={firmData?.id || ''} onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); refetch(); }} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Client Detail View ──────────────────────────────────────────────────────

function ClientDetailView({ clientName, clientId, firmId, onBack }: { clientName: string; clientId: string | null; firmId: string; onBack: () => void }) {
  const filters = useMemo(() => ({
    search: '',
    documentType: null,
    processingStatus: null,
    dateFrom: null,
    dateTo: null,
    vendor: clientName,
    clientId: clientId
  }), [clientName, clientId]);
  const { documents, loading } = useDocuments(firmId, filters);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const totalAmount = documents.reduce((s, d) => s + (d.total_amount || 0), 0);
  const extracted = documents.filter(d => d.processing_status === 'extracted').length;
  const failed = documents.filter(d => d.processing_status === 'failed').length;

  return (
    <div className="max-w-7xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-[#615d59] hover:text-black text-sm mb-6 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" />Back to Clients
      </button>

      <div className="flex items-start gap-6 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0075de]/10 to-[#0075de]/20 border border-[#0075de]/20 flex items-center justify-center font-bold text-xl text-[#0075de] shrink-0">
          {clientName.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">{clientName}</h1>
          <p className="text-[#615d59] text-sm">{documents.length} documents • Total value: {totalAmount > 0 ? formatCurrency(totalAmount) : '₹0'}</p>
        </div>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 shadow-sm"><p className="text-[10px] text-[#615d59]/70 uppercase font-bold mb-1">Documents</p><p className="text-2xl font-bold text-black">{documents.length}</p></div>
        <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 shadow-sm"><p className="text-[10px] text-[#615d59]/70 uppercase font-bold mb-1">Total Value</p><p className="text-2xl font-bold text-black">{totalAmount > 0 ? formatCurrency(totalAmount) : '—'}</p></div>
        <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 shadow-sm"><p className="text-[10px] text-[#615d59]/70 uppercase font-bold mb-1">Extracted</p><p className="text-2xl font-bold text-emerald-600">{extracted}</p></div>
        <div className="bg-white border border-[#e6e6e6] rounded-xl p-4 shadow-sm"><p className="text-[10px] text-[#615d59]/70 uppercase font-bold mb-1">Failed</p><p className="text-2xl font-bold text-[#dd5b00]">{failed}</p></div>
      </div>

      {/* Documents Table */}
      <h2 className="text-xl font-bold text-black mb-4">Documents</h2>
      {loading ? (
        <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-8 text-center"><Loader2 className="w-6 h-6 text-[#0075de] animate-spin mx-auto" /></div>
      ) : documents.length === 0 ? (
        <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-12 shadow-sm"><EmptyState icon={FileText} title="No Documents" description={`No documents found for ${clientName}.`} /></div>
      ) : (
        <div className="bg-white border border-[#e6e6e6] rounded-[20px] overflow-hidden shadow-sm">
          <div className="divide-y divide-[#e6e6e6]">
            {documents.map((doc, i) => (
              <div key={doc.id} onClick={() => setSelectedDoc(doc)} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.01] transition-all cursor-pointer group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0075de]/5 border border-[#0075de]/15 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-[#0075de]" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black truncate group-hover:text-[#0075de] transition-colors">{doc.original_file_name}</p>
                    <p className="text-[11px] text-[#615d59]/70 mt-0.5">{formatRelativeTime(doc.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap sm:shrink-0 w-full sm:w-auto border-t border-[#e6e6e6]/60 pt-3 sm:border-t-0 sm:pt-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={doc.document_type || 'unknown'} />
                    <StatusBadge status={doc.processing_status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-black">{doc.total_amount ? formatCurrency(doc.total_amount) : '—'}</span>
                    <Eye className="w-4 h-4 text-[#615d59]/30 group-hover:text-[#615d59]/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DocumentDetailModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}

// ─── Add Client Modal ────────────────────────────────────────────────────────

function AddClientModal({ firmId, onClose, onSuccess }: { firmId: string; onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) { setError('Client name is required'); return; }
    setSaving(true);
    setError('');
    try {
      const supabase = getSupabase();
      const { error: err } = await supabase.from('clients').insert([{ trade_name: name.trim(), ca_firm_id: firmId }]);
      if (err) throw err;
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed to add client');
    } finally { setSaving(false); }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-[#e6e6e6] rounded-[20px] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Add New Client</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-black/[0.03] flex items-center justify-center text-[#615d59] hover:text-black"><X className="w-4 h-4" /></button>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#615d59]/80 block mb-2">Client / Vendor Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nykaa E-Retail Limited"
                className="w-full bg-white border border-[#e6e6e6] rounded-xl text-black text-sm px-4 py-3 focus:outline-none focus:border-[#0075de] focus:ring-2 focus:ring-[#0075de]/10 transition-all placeholder:text-[#615d59]/40" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0075de] text-white text-sm font-bold hover:bg-[#005fb8] transition-all disabled:opacity-50 shadow-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{saving ? 'Adding...' : 'Add Client'}
            </button>
            <button onClick={onClose} className="px-5 py-3 rounded-xl bg-black/[0.03] border border-[#e6e6e6] text-sm text-[#615d59] hover:text-black hover:bg-black/[0.08] transition-all">Cancel</button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function HowToStep({ num, title, description, icon: Icon }: { num: string; title: string; description: string; icon: any }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-black/[0.03] border border-[#e6e6e6] flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-[#615d59]/70" /></div>
      <div>
        <h4 className="text-sm font-semibold text-black">{title}</h4>
        <p className="text-xs text-[#615d59] mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
