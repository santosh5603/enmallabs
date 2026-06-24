'use client';

import { useMemo } from 'react';
import type { DashboardStats } from '@/hooks/use-dashboard-data';

// ─── Color Constants ─────────────────────────────────────────────────────────

const DOC_TYPE_COLORS: Record<string, string> = {
  'B2B_INVOICE': '#d6b6f6',
  'invoice': '#d6b6f6',
  'bank_statement': '#8cc6f5',
  'receipt': '#ff8a3b',
  'tax_notice': '#4dc8c4',
  'other': '#44c97f',
};

const INTENT_COLORS = ['#8cc6f5', '#d6b6f6', '#ff8a3b', '#4dc8c4', '#ff8fd6'];
const INTENT_STROKE_COLORS = ['#0e3a66', '#391c57', '#793400', '#0e3d3b', '#5b1a3e'];

// ─── Document Timeline Chart ─────────────────────────────────────────────────

interface TimelineChartProps {
  documents: { created_at: string; total_amount: number | null }[];
}

export function DocumentTimelineChart({ documents }: TimelineChartProps) {
  const { data, totalProcessed, peakDay, peakCount } = useMemo(() => {
    const grouped = new Map<string, number>();

    // Generate last 30 days
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      grouped.set(key, 0);
    }

    documents.forEach(doc => {
      const day = new Date(doc.created_at).toISOString().split('T')[0];
      if (grouped.has(day)) {
        grouped.set(day, (grouped.get(day) || 0) + 1);
      }
    });

    const entries = Array.from(grouped.entries()).map(([date, count]) => ({ date, count }));
    const totalProcessed = documents.length;
    let peakCount = 0;
    let peakDay = '';
    entries.forEach(e => {
      if (e.count > peakCount) {
        peakCount = e.count;
        peakDay = e.date;
      }
    });

    return { data: entries, totalProcessed, peakDay, peakCount };
  }, [documents]);

  // Build SVG path
  const width = 600;
  const height = 200;
  const maxVal = Math.max(...data.map(d => d.count), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d.count / maxVal) * (height - 20) - 10,
    count: d.count,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  // Find peak point
  const peakIdx = data.findIndex(d => d.date === peakDay);
  const peakPoint = peakIdx >= 0 ? points[peakIdx] : null;

  // Date labels
  const dateLabels = [0, 7, 14, 21, 28].map(i => {
    if (i >= data.length) return '';
    const d = new Date(data[i].date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-xl p-6">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <h3 className="text-[18px] font-semibold text-black" style={{ letterSpacing: '-0.125px' }}>Document timeline</h3>
          <p className="text-[13px] text-[#615d59] mt-1">Documents processed by Enma · last 30 days</p>
        </div>
        <div className="flex gap-1 p-[3px] bg-[#f6f5f4] rounded-md">
          <button className="px-2.5 py-1 rounded bg-white text-[12px] font-semibold text-black shadow-sm">30D</button>
          <button className="px-2.5 py-1 rounded text-[12px] font-medium text-[#615d59] hover:bg-white/50 transition-colors">90D</button>
          <button className="px-2.5 py-1 rounded text-[12px] font-medium text-[#615d59] hover:bg-white/50 transition-colors">YTD</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 my-[18px]">
        <div>
          <div className="text-[11px] text-[#a39e98] font-semibold tracking-[0.5px] uppercase">PROCESSED</div>
          <div className="text-[24px] font-bold tracking-tight flex items-center gap-1.5" style={{ letterSpacing: '-0.5px' }}>
            {totalProcessed.toLocaleString('en-IN')}
            {totalProcessed > 0 && <span className="text-[12px] text-[#1aae39] font-semibold">↑ {Math.min(totalProcessed * 5, 100)}%</span>}
          </div>
        </div>
        {peakCount > 0 && (
          <div className="border-l border-[#e6e6e6] pl-6">
            <div className="text-[11px] text-[#a39e98] font-semibold tracking-[0.5px] uppercase">PEAK DAY</div>
            <div className="text-[24px] font-bold tracking-tight" style={{ letterSpacing: '-0.5px' }}>
              {peakCount}
              <span className="text-[12px] text-[#615d59] font-medium ml-1.5">
                · {new Date(peakDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart SVG */}
      <div className="relative" style={{ height: '200px', marginTop: '8px' }}>
        <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0075de" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#0075de" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1="0" y1="50" x2={width} y2="50" stroke="#e6e6e6" strokeDasharray="3,3" />
          <line x1="0" y1="100" x2={width} y2="100" stroke="#e6e6e6" strokeDasharray="3,3" />
          <line x1="0" y1="150" x2={width} y2="150" stroke="#e6e6e6" strokeDasharray="3,3" />
          {/* Area */}
          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={linePath} fill="none" stroke="#0075de" strokeWidth="2" />
          {/* Peak marker */}
          {peakPoint && peakCount > 0 && (
            <circle cx={peakPoint.x} cy={peakPoint.y} r="5" fill="#fff" stroke="#0075de" strokeWidth="2" />
          )}
        </svg>
        {/* Tooltip on peak */}
        {peakPoint && peakCount > 0 && (
          <div
            className="absolute bg-black text-white px-2.5 py-1.5 rounded-md text-[12px] whitespace-nowrap"
            style={{ top: `${peakPoint.y - 50}px`, left: `${(peakPoint.x / width) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <div className="font-semibold">{new Date(peakDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {peakCount} docs</div>
          </div>
        )}
      </div>

      {/* Date axis */}
      <div className="flex justify-between mt-2.5 text-[11px] text-[#a39e98]">
        {dateLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Processing Status Donut ─────────────────────────────────────────────────

export function ProcessingStatusChart({ stats }: { stats: DashboardStats }) {
  const completed = stats.extractedDocuments;
  const needsReview = stats.pendingDocuments;
  const failed = stats.failedDocuments;
  const total = stats.totalDocuments;

  if (total === 0) return null;

  const rate = Math.round((completed / total) * 100 * 10) / 10;

  // SVG donut math
  const r = 64;
  const circumference = 2 * Math.PI * r;
  const completedDash = (completed / total) * circumference;
  const reviewDash = (needsReview / total) * circumference;
  const failedDash = (failed / total) * circumference;

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-xl p-6">
      <h3 className="text-[18px] font-semibold text-black mb-1" style={{ letterSpacing: '-0.125px' }}>Processing status</h3>
      <p className="text-[13px] text-[#615d59] mb-6">Across all queues</p>

      <div className="flex items-center justify-center mb-5">
        <div className="relative" style={{ width: '160px', height: '160px' }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle cx="80" cy="80" r={r} fill="none" stroke="#f6f5f4" strokeWidth="20" />
            {/* Completed */}
            <circle cx="80" cy="80" r={r} fill="none" stroke="#1aae39" strokeWidth="20"
              strokeDasharray={`${completedDash} ${circumference}`} strokeDashoffset="0"
              transform="rotate(-90 80 80)" strokeLinecap="round" />
            {/* Review */}
            {needsReview > 0 && (
              <circle cx="80" cy="80" r={r} fill="none" stroke="#ff8a3b" strokeWidth="20"
                strokeDasharray={`${reviewDash} ${circumference}`} strokeDashoffset={`${-completedDash}`}
                transform="rotate(-90 80 80)" />
            )}
            {/* Failed */}
            {failed > 0 && (
              <circle cx="80" cy="80" r={r} fill="none" stroke="#dd5b00" strokeWidth="20"
                strokeDasharray={`${failedDash} ${circumference}`} strokeDashoffset={`${-(completedDash + reviewDash)}`}
                transform="rotate(-90 80 80)" />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[32px] font-bold leading-none" style={{ letterSpacing: '-0.625px' }}>{rate}%</div>
            <div className="text-[11px] text-[#615d59] mt-0.5">auto‑filed</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-[#1aae39]" /><span className="text-[13px] text-[#31302e]">Completed</span></div>
          <span className="text-[13px] font-semibold">{completed.toLocaleString('en-IN')}</span>
        </div>
        {needsReview > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-[#ff8a3b]" /><span className="text-[13px] text-[#31302e]">Needs review</span></div>
            <span className="text-[13px] font-semibold">{needsReview.toLocaleString('en-IN')}</span>
          </div>
        )}
        {failed > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-sm bg-[#dd5b00]" /><span className="text-[13px] text-[#31302e]">Failed</span></div>
            <span className="text-[13px] font-semibold">{failed.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Document Types Chart ────────────────────────────────────────────────────

export function DocumentTypeChart({ stats }: { stats: DashboardStats }) {
  const data = useMemo(() => {
    return Object.entries(stats.documentTypes)
      .filter(([k]) => k !== 'null')
      .map(([name, value]) => ({
        name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        rawName: name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [stats.documentTypes]);

  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const defaultColors = ['#d6b6f6', '#8cc6f5', '#ff8a3b', '#4dc8c4', '#44c97f'];

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-xl p-6">
      <h3 className="text-[18px] font-semibold text-black mb-1" style={{ letterSpacing: '-0.125px' }}>Document types</h3>
      <p className="text-[13px] text-[#615d59] mb-[22px]">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {total} docs total</p>

      <div className="flex flex-col gap-3.5">
        {data.map((d, i) => {
          const color = DOC_TYPE_COLORS[d.rawName] || defaultColors[i % defaultColors.length];
          const pct = (d.value / total) * 100;
          return (
            <div key={d.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[13px] text-[#31302e] flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color }} />
                  {d.name}
                </span>
                <span className="text-[13px] font-semibold">{d.value}</span>
              </div>
              <div className="h-1.5 bg-[#f6f5f4] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chat Intents Chart ──────────────────────────────────────────────────────

export function IntentTagChart({ stats }: { stats: DashboardStats }) {
  const data = useMemo(() => {
    return Object.entries(stats.intentTags)
      .filter(([k]) => k !== 'null' && k !== 'unknown')
      .map(([name, value]) => ({
        name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [stats.intentTags]);

  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const icons = [
    // question mark
    <svg key="q" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    // document
    <svg key="d" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    // clock
    <svg key="c" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    // check
    <svg key="ch" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    // chat
    <svg key="m" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  ];

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-xl p-6">
      <h3 className="text-[18px] font-semibold text-black mb-1" style={{ letterSpacing: '-0.125px' }}>Chat intents</h3>
      <p className="text-[13px] text-[#615d59] mb-[22px]">What clients are asking Enma</p>

      <div className="flex flex-col gap-3.5">
        {data.map((d, i) => {
          const pct = Math.round((d.value / total) * 100);
          const bgColor = INTENT_COLORS[i % INTENT_COLORS.length];
          const strokeColor = INTENT_STROKE_COLORS[i % INTENT_STROKE_COLORS.length];

          return (
            <div key={d.name} className="flex items-center gap-3.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: bgColor, color: strokeColor }}
              >
                {icons[i % icons.length]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] text-black font-medium">{d.name}</span>
                  <span className="text-[13px] font-semibold">{pct}%</span>
                </div>
                <div className="h-1 bg-[#f6f5f4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0075de] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
