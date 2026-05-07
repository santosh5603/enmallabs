'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalDocuments: number;
  extractedDocuments: number;
  failedDocuments: number;
  pendingDocuments: number;
  totalChatLogs: number;
  gstQueries: number;
  consultantQueries: number;
  processingRate: number; // percentage
  documentTypes: Record<string, number>;
  intentTags: Record<string, number>;
  totalAmount: number;
}

export interface DocumentRecord {
  id: string;
  ca_firm_id: string;
  client_id: string | null;
  document_type: string | null;
  original_file_name: string;
  processing_status: string;
  processing_error: string | null;
  total_amount: number | null;
  vendor_name: string | null;
  buyer_name: string | null;
  vendor_gstin: string | null;
  buyer_gstin: string | null;
  invoice_number: string | null;
  transaction_date: string | null;
  itc_eligible: boolean | null;
  compliance_flags: any;
  extracted_data: any;
  created_at: string;
  source_channel: string | null;
  tax_period_month: number | null;
  tax_period_year: number | null;
}

export interface ChatLogRecord {
  id: string;
  firm_id: string | null;
  ca_firm_id: string | null;
  client_id: string | null;
  telegram_chat_id: string | null;
  user_message: string;
  bot_response: string;
  intent_tag: string | null;
  tools_called: any;
  is_error: boolean | null;
  response_time_ms: number | null;
  created_at: string;
}

export interface ClientInfo {
  name: string;
  documentCount: number;
  totalAmount: number;
  lastActivity: string;
  documentTypes: string[];
  statuses: string[];
}

export interface DocumentFilters {
  search: string;
  documentType: string | null;
  processingStatus: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  vendor: string | null;
}

export interface FirmData {
  id: string;
  firebase_uid: string | null;
  firm_name: string;
  ca_name: string;
  email: string;
  phone: string | null;
  telegram_chat_id: string | null;
  telegram_linked_at: string | null;
  is_active: boolean;
  subscription_plan: string;
  onboarding_completed: boolean;
  dpa_consented: boolean;
  dpa_consented_at: string | null;
  created_at: string;
  updated_at: string | null;
  known_groups: any;
}

// ─── useFirmData ─────────────────────────────────────────────────────────────

export function useFirmData(firebaseUid: string | null) {
  const [firmData, setFirmData] = useState<FirmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!firebaseUid) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();

    const fetchFirm = async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('ca_firms')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .single();

      if (err) {
        setError(err.message);
      } else {
        setFirmData(data);
      }
      setLoading(false);
    };

    fetchFirm();

    // Realtime subscription
    channelRef.current = supabase
      .channel(`firm-${firebaseUid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ca_firms',
          filter: `firebase_uid=eq.${firebaseUid}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setFirmData(payload.new as FirmData);
          }
        }
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [firebaseUid]);

  return { firmData, loading, error };
}

// ─── useDashboardStats ───────────────────────────────────────────────────────

export function useDashboardStats(firmId: string | null) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchStats = useCallback(async () => {
    if (!firmId) return;
    const supabase = getSupabase();

    const [docsResult, chatsResult] = await Promise.all([
      supabase.from('documents').select('id, document_type, processing_status, total_amount, intent_tag').eq('ca_firm_id', firmId),
      supabase.from('chat_logs').select('id, intent_tag').or(`firm_id.eq.${firmId},ca_firm_id.eq.${firmId}`),
    ]);

    const docs = docsResult.data || [];
    const chats = chatsResult.data || [];

    const documentTypes: Record<string, number> = {};
    const statuses: Record<string, number> = {};
    let totalAmount = 0;

    docs.forEach((d: any) => {
      const dt = d.document_type || 'unknown';
      documentTypes[dt] = (documentTypes[dt] || 0) + 1;
      statuses[d.processing_status] = (statuses[d.processing_status] || 0) + 1;
      if (d.total_amount) totalAmount += d.total_amount;
    });

    const intentTags: Record<string, number> = {};
    chats.forEach((c: any) => {
      const tag = c.intent_tag || 'unknown';
      intentTags[tag] = (intentTags[tag] || 0) + 1;
    });

    const extracted = statuses['extracted'] || 0;
    const failed = statuses['failed'] || 0;
    const received = statuses['received'] || 0;

    setStats({
      totalDocuments: docs.length,
      extractedDocuments: extracted,
      failedDocuments: failed,
      pendingDocuments: received,
      totalChatLogs: chats.length,
      gstQueries: intentTags['gst_query'] || 0,
      consultantQueries: intentTags['consultant_query'] || 0,
      processingRate: docs.length > 0 ? Math.round((extracted / docs.length) * 100 * 10) / 10 : 0,
      documentTypes,
      intentTags,
      totalAmount,
    });
    setLoading(false);
  }, [firmId]);

  useEffect(() => {
    fetchStats();

    if (!firmId) return;
    const supabase = getSupabase();

    // Realtime: re-fetch stats when documents or chat_logs change
    channelRef.current = supabase
      .channel(`stats-${firmId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents', filter: `ca_firm_id=eq.${firmId}` },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_logs', filter: `ca_firm_id=eq.${firmId}` },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [firmId, fetchStats]);

  return { stats, loading };
}

// ─── useDocuments ────────────────────────────────────────────────────────────

export function useDocuments(firmId: string | null, filters: DocumentFilters) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!firmId) return;
    const supabase = getSupabase();
    setLoading(true);

    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('ca_firm_id', firmId)
      .order('created_at', { ascending: false });

    if (filters.documentType) {
      query = query.eq('document_type', filters.documentType);
    }
    if (filters.processingStatus) {
      query = query.eq('processing_status', filters.processingStatus);
    }
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo + 'T23:59:59');
    }
    if (filters.vendor) {
      query = query.ilike('vendor_name', `%${filters.vendor}%`);
    }
    if (filters.search) {
      query = query.or(
        `original_file_name.ilike.%${filters.search}%,vendor_name.ilike.%${filters.search}%,buyer_name.ilike.%${filters.search}%,invoice_number.ilike.%${filters.search}%`
      );
    }

    const { data, error, count } = await query;
    if (!error) {
      setDocuments(data as DocumentRecord[]);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [firmId, filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Realtime subscription
  useEffect(() => {
    if (!firmId) return;
    const supabase = getSupabase();

    channelRef.current = supabase
      .channel(`docs-${firmId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents', filter: `ca_firm_id=eq.${firmId}` },
        () => fetchDocuments()
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [firmId, fetchDocuments]);

  return { documents, loading, totalCount, refetch: fetchDocuments };
}

// ─── useClients ──────────────────────────────────────────────────────────────

export function useClients(firmId: string | null) {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchClients = useCallback(async () => {
    if (!firmId) return;
    const supabase = getSupabase();

    const [docsResult, clientsResult] = await Promise.all([
      supabase
        .from('documents')
        .select('vendor_name, buyer_name, document_type, processing_status, total_amount, created_at')
        .eq('ca_firm_id', firmId),
      supabase
        .from('clients')
        .select('client_name, created_at')
        .eq('ca_firm_id', firmId)
    ]);

    const docs = docsResult.data;
    const manualClients = clientsResult.data;

    if (!docs) {
      setClients([]);
      setLoading(false);
      return;
    }

    const clientMap = new Map<string, ClientInfo>();

    // First, add all manually created clients
    if (manualClients) {
      manualClients.forEach((c: any) => {
        if (!c.client_name || c.client_name === 'Unknown') return;
        clientMap.set(c.client_name, {
          name: c.client_name,
          documentCount: 0,
          totalAmount: 0,
          lastActivity: c.created_at,
          documentTypes: [],
          statuses: [],
        });
      });
    }

    // Then, aggregate from documents
    if (docs) {
      docs.forEach((doc: any) => {
        const name = doc.vendor_name || doc.buyer_name || 'Unknown';
        if (name === 'Unknown') return;

      const existing = clientMap.get(name);
      if (existing) {
        existing.documentCount++;
        existing.totalAmount += doc.total_amount || 0;
        if (doc.created_at > existing.lastActivity) {
          existing.lastActivity = doc.created_at;
        }
        if (doc.document_type && !existing.documentTypes.includes(doc.document_type)) {
          existing.documentTypes.push(doc.document_type);
        }
        if (doc.processing_status && !existing.statuses.includes(doc.processing_status)) {
          existing.statuses.push(doc.processing_status);
        }
      } else {
        clientMap.set(name, {
          name,
          documentCount: 1,
          totalAmount: doc.total_amount || 0,
          lastActivity: doc.created_at,
          documentTypes: doc.document_type ? [doc.document_type] : [],
          statuses: doc.processing_status ? [doc.processing_status] : [],
        });
      }
    });
    }

    setClients(
      Array.from(clientMap.values()).sort((a, b) => b.documentCount - a.documentCount)
    );
    setLoading(false);
  }, [firmId]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (!firmId) return;
    const supabase = getSupabase();

    channelRef.current = supabase
      .channel(`clients-${firmId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents', filter: `ca_firm_id=eq.${firmId}` },
        () => fetchClients()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients', filter: `ca_firm_id=eq.${firmId}` },
        () => fetchClients()
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [firmId, fetchClients]);

  return { clients, loading, refetch: fetchClients };
}

// ─── useRecentActivity ───────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: 'document' | 'chat';
  title: string;
  description: string;
  status: string;
  timestamp: string;
  metadata?: any;
}

export function useRecentActivity(firmId: string | null, limit: number = 10) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchActivity = useCallback(async () => {
    if (!firmId) return;
    const supabase = getSupabase();

    const [docsResult, chatsResult] = await Promise.all([
      supabase
        .from('documents')
        .select('id, vendor_name, original_file_name, document_type, processing_status, created_at, total_amount')
        .eq('ca_firm_id', firmId)
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('chat_logs')
        .select('id, user_message, bot_response, intent_tag, created_at')
        .or(`firm_id.eq.${firmId},ca_firm_id.eq.${firmId}`)
        .order('created_at', { ascending: false })
        .limit(limit),
    ]);

    const docActivities: ActivityItem[] = (docsResult.data || []).map((d: any) => ({
      id: d.id,
      type: 'document' as const,
      title: d.vendor_name || d.original_file_name,
      description: `${formatDocType(d.document_type)} — ${d.original_file_name}`,
      status: d.processing_status,
      timestamp: d.created_at,
      metadata: { total_amount: d.total_amount, document_type: d.document_type },
    }));

    const chatActivities: ActivityItem[] = (chatsResult.data || []).map((c: any) => ({
      id: c.id,
      type: 'chat' as const,
      title: c.user_message.length > 60 ? c.user_message.substring(0, 60) + '...' : c.user_message,
      description: `Bot: ${c.bot_response?.substring(0, 80)}...`,
      status: c.intent_tag || 'chat',
      timestamp: c.created_at,
    }));

    const combined = [...docActivities, ...chatActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    setActivities(combined);
    setLoading(false);
  }, [firmId, limit]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  useEffect(() => {
    if (!firmId) return;
    const supabase = getSupabase();

    channelRef.current = supabase
      .channel(`activity-${firmId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'documents', filter: `ca_firm_id=eq.${firmId}` },
        () => fetchActivity()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_logs', filter: `ca_firm_id=eq.${firmId}` },
        () => fetchActivity()
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [firmId, fetchActivity]);

  return { activities, loading };
}

// ─── useChatLogs ─────────────────────────────────────────────────────────────

export function useChatLogs(firmId: string | null, limit: number = 50) {
  const [chatLogs, setChatLogs] = useState<ChatLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firmId) return;
    const supabase = getSupabase();

    const fetch = async () => {
      const { data } = await supabase
        .from('chat_logs')
        .select('*')
        .or(`firm_id.eq.${firmId},ca_firm_id.eq.${firmId}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      setChatLogs((data || []) as ChatLogRecord[]);
      setLoading(false);
    };

    fetch();

    const channel = supabase
      .channel(`chats-${firmId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_logs', filter: `ca_firm_id=eq.${firmId}` },
        (payload) => {
          setChatLogs((prev) => [payload.new as ChatLogRecord, ...prev].slice(0, limit));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [firmId, limit]);

  return { chatLogs, loading };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDocType(type: string | null): string {
  if (!type) return 'Unknown';
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
