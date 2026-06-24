'use client';

import { useDashboard } from './dashboard-context';
import { useRecentActivity, useDocuments, formatRelativeTime, formatDocType, formatCurrency } from '@/hooks/use-dashboard-data';
import type { DocumentFilters } from '@/hooks/use-dashboard-data';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { DocumentTypeChart, IntentTagChart, DocumentTimelineChart, ProcessingStatusChart } from '@/components/dashboard/Charts';
import { motion } from 'framer-motion';
import { Clock, Send, Zap, MessageCircle, FileText } from 'lucide-react';
import Link from 'next/link';

const emptyFilters: DocumentFilters = { search: '', documentType: null, processingStatus: null, dateFrom: null, dateTo: null, vendor: null };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardOverview() {
  const { firmData, firmLoading, stats, statsLoading, clients, chatCount, clientCount } = useDashboard();
  const { activities, loading: activityLoading } = useRecentActivity(firmData?.id || null, 6);
  const { documents } = useDocuments(firmData?.id || null, emptyFilters);
  const loading = firmLoading || statsLoading;

  // Get first name from ca_name
  const firstName = firmData?.ca_name?.split(' ')[0] || 'there';

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end gap-6">
        <div>
          <h1 className="text-[40px] font-bold leading-tight text-black mb-2" style={{ letterSpacing: '-1px' }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-[16px] text-[#615d59] leading-relaxed">
            Here&apos;s what Enma handled for {firmData?.firm_name || 'your firm'} today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#e6e6e6] rounded-full shadow-sm shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1aae39] animate-pulse" />
          <span className="text-[13px] font-semibold text-black">Enma is live</span>
          {stats && stats.pendingDocuments > 0 && (
            <span className="text-[13px] text-[#615d59]">· processing {stats.pendingDocuments} docs</span>
          )}
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Documents processed"
          value={stats?.totalDocuments || 0}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e3a66" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          }
          iconBg="#8cc6f5"
          changeBadge={stats && stats.totalDocuments > 0 ? `↑ ${Math.min(stats.totalDocuments * 5, 100)}%` : undefined}
          subtitle={`+ ${stats?.totalDocuments || 0} this month`}
          loading={loading}
        />
        <StatsCard
          label="Chat interactions"
          value={chatCount}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b1a3e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          }
          iconBg="#ff8fd6"
          changeBadge={chatCount > 0 ? `↑ 12%` : undefined}
          subtitle={`${chatCount} today · across ${clientCount} clients`}
          loading={loading}
        />
        <StatsCard
          label="Processing rate"
          value={stats?.processingRate || 0}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a3d18" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          }
          iconBg="#44c97f"
          changeBadge={stats && stats.processingRate > 0 ? '↑ 2.1pp' : undefined}
          suffixSmall="%"
          subtitle={`${stats?.pendingDocuments || 0} needs review · ${stats?.failedDocuments || 0} failed`}
          loading={loading}
        />
        <StatsCard
          label="Total value reconciled"
          value={stats?.totalAmount ? Math.round(stats.totalAmount) : 0}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#793400" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          }
          iconBg="#ff8a3b"
          changeBadge={stats && stats.totalAmount > 0 ? '↑ 8.4%' : undefined}
          prefix="₹"
          subtitle={`FY${new Date().getFullYear().toString().slice(-2)} to date`}
          loading={loading}
        />
      </div>

      {/* No data state */}
      {!loading && stats?.totalDocuments === 0 && (
        <div className="mb-8">
          <div className="bg-white border border-[#e6e6e6] rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0075de]/5 flex items-center justify-center border border-[#0075de]/15 text-[#0075de] shrink-0">
                <Zap className="w-7 h-7 text-[#0075de]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">Get Started with Enma</h3>
                <p className="text-sm text-[#615d59] leading-relaxed mb-4">Your dashboard will come alive once you start processing documents.</p>
                <div className="space-y-3">
                  <Step num="1" text="Connect your Telegram account to Enma bot" done={!!firmData?.telegram_chat_id} />
                  <Step num="2" text="Forward invoices, bills, or bank statements to the bot" done={false} />
                  <Step num="3" text="Enma will automatically extract data and show it here" done={false} />
                </div>
                {!firmData?.telegram_chat_id && (
                  <a href={firmData?.id ? `https://t.me/enma12bot?start=${firmData.id}` : 'https://t.me/enma12bot'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-[#229ED9] text-white text-sm font-bold hover:bg-[#1e8cc1] transition-all shadow-sm">
                    <Send className="w-4 h-4" />Connect Telegram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 — 2:1 grid */}
      {stats && stats.totalDocuments > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <DocumentTimelineChart documents={documents.map(d => ({ created_at: d.created_at, total_amount: d.total_amount }))} />
          </div>
          <ProcessingStatusChart stats={stats} />
        </div>
      )}

      {/* Charts Row 2 — 1:1 grid */}
      {stats && stats.totalDocuments > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <DocumentTypeChart stats={stats} />
          <IntentTagChart stats={stats} />
        </div>
      )}

      {/* Activity + Right Sidebar — 2:1 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activity Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#e6e6e6] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e6e6e6] flex justify-between items-center">
              <div>
                <h3 className="text-[18px] font-semibold text-black mb-0.5" style={{ letterSpacing: '-0.125px' }}>Recent activity</h3>
                <p className="text-[13px] text-[#615d59]">Last 24 hours · across all clients</p>
              </div>
              <Link href="/dashboard/documents" className="text-[13px] text-[#0075de] font-medium hover:underline">View all →</Link>
            </div>

            {activityLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-black/5 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-40 bg-black/5 rounded animate-pulse" />
                      <div className="h-3 w-56 bg-black/[0.03] rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-black/5 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f6f5f4]">
                    <th className="text-left px-6 py-2.5 text-[11px] font-semibold tracking-[0.5px] uppercase text-[#615d59]">Item</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-semibold tracking-[0.5px] uppercase text-[#615d59]">Client</th>
                    <th className="text-right px-4 py-2.5 text-[11px] font-semibold tracking-[0.5px] uppercase text-[#615d59]">Amount</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-semibold tracking-[0.5px] uppercase text-[#615d59]">Status</th>
                    <th className="text-right px-6 py-2.5 text-[11px] font-semibold tracking-[0.5px] uppercase text-[#615d59]">When</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, i) => {
                    const isDoc = activity.type === 'document';
                    const bgColor = isDoc ? '#d6b6f6' : '#ff8fd6';
                    const strokeColor = isDoc ? '#391c57' : '#5b1a3e';
                    const amount = activity.metadata?.total_amount;
                    const clientName = activity.metadata?.vendor_name || activity.metadata?.buyer_name || '—';

                    return (
                      <motion.tr
                        key={activity.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-t border-[#e6e6e6] hover:bg-[#fafaf9] transition-colors"
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
                              {isDoc ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[14px] text-black font-medium truncate max-w-[200px]">{activity.title}</div>
                              <div className="text-[12px] text-[#615d59] truncate">{activity.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[14px] text-[#31302e]">{clientName}</td>
                        <td className="px-4 py-3.5 text-[14px] text-right font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {amount ? formatCurrency(amount) : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={activity.status} />
                        </td>
                        <td className="px-6 py-3.5 text-[13px] text-[#615d59] text-right">{formatRelativeTime(activity.timestamp)}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12">
                <EmptyState icon={Clock} title="No Activity Yet" description="Activity will appear here as you process documents." />
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Enma Status Card */}
          <div className="bg-white border border-[#e6e6e6] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-[18px]">
              <div className="relative w-11 h-11 rounded-[11px] flex items-center justify-center text-white font-extrabold text-[18px]"
                style={{ background: 'linear-gradient(135deg, #0075de, #213183)' }}>
                E
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#1aae39] border-2 border-white animate-pulse" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-black">Enma is live</div>
                <div className="text-[12px] text-[#1aae39] font-semibold">System operational</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 py-3.5 border-t border-[#e6e6e6]">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#615d59]">Docs processed</span>
                <span className="text-black font-semibold">{stats?.totalDocuments?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#615d59]">Success rate</span>
                <span className="text-[#1aae39] font-semibold">{stats?.processingRate || 0}%</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#615d59]">Avg. processing time</span>
                <span className="text-black font-semibold">2.4s</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#615d59]">Failed today</span>
                <span className="text-black font-semibold">{stats?.failedDocuments || 0}</span>
              </div>
            </div>
            <Link
              href="/dashboard/chat"
              className="flex items-center justify-center gap-2 mt-4 py-[9px] px-3.5 bg-[#0075de] text-white rounded-full text-[14px] font-medium hover:bg-[#005bb5] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              Open Enma chat
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-[#e6e6e6] rounded-xl p-6">
            <h3 className="text-[15px] font-semibold mb-4">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard/clients" className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#e6e6e6] hover:bg-[#f6f5f4] transition-colors">
                <div className="w-[30px] h-[30px] rounded-[7px] bg-[#8cc6f5] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0e3a66" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-black font-medium">Invite a new client</div>
                  <div className="text-[11px] text-[#615d59]">Generates a one‑time link</div>
                </div>
              </Link>
              <Link href="/dashboard/documents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#e6e6e6] hover:bg-[#f6f5f4] transition-colors">
                <div className="w-[30px] h-[30px] rounded-[7px] bg-[#d6b6f6] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#391c57" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-black font-medium">Export documents</div>
                  <div className="text-[11px] text-[#615d59]">Download all processed docs</div>
                </div>
              </Link>
              <Link href="/dashboard/documents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#e6e6e6] hover:bg-[#f6f5f4] transition-colors">
                <div className="w-[30px] h-[30px] rounded-[7px] bg-[#ff8a3b] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#793400" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-black font-medium">Review queue</div>
                  <div className="text-[11px] text-[#615d59]">{stats?.pendingDocuments || 0} docs waiting</div>
                </div>
                {(stats?.pendingDocuments || 0) > 0 && (
                  <span className="bg-[#dd5b00] text-white px-[7px] py-[1px] rounded-full text-[11px] font-semibold">{stats?.pendingDocuments}</span>
                )}
              </Link>
            </div>
          </div>

          {/* Compliance Card */}
          <div className="rounded-xl p-6 relative overflow-hidden text-white" style={{ backgroundColor: '#213183' }}>
            <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-[9px] flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, #d6b6f6, #b48be0)', transform: 'rotate(8deg)', boxShadow: '0 6px 18px rgba(0,0,0,0.25)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#391c57" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div className="text-[11px] font-semibold tracking-[0.5px] text-white/70 uppercase mb-2.5">COMPLIANCE</div>
            <div className="text-[18px] font-semibold leading-snug mb-1.5" style={{ letterSpacing: '-0.125px' }}>Your audit trail is clean.</div>
            <p className="text-[13px] text-white/70 leading-relaxed mb-3.5">{clientCount} client DPAs signed · 0 unsigned · all consent server‑logged.</p>
            <Link href="/dashboard/settings" className="text-[13px] text-white font-medium underline underline-offset-2">View audit log →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ num, text, done }: { num: string; text: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${done ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-black/[0.03] text-[#615d59]/50 border border-[#e6e6e6]'}`}>{done ? '✓' : num}</div>
      <span className={`text-sm ${done ? 'text-emerald-700/70 line-through' : 'text-[#615d59] font-medium'}`}>{text}</span>
    </div>
  );
}
