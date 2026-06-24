'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';
import type { DashboardStats } from '@/hooks/use-dashboard-data';

const COLORS = ['#0075de', '#1aae39', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e6e6e6] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-[#615d59] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
        </p>
      ))}
    </div>
  );
};

interface DashboardChartsProps {
  stats: DashboardStats;
  documents: { created_at: string; total_amount: number | null; document_type: string | null; processing_status: string }[];
}

export function DocumentTypeChart({ stats }: { stats: DashboardStats }) {
  const data = useMemo(() => {
    return Object.entries(stats.documentTypes)
      .filter(([k]) => k !== 'null')
      .map(([name, value]) => ({
        name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [stats.documentTypes]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#615d59] mb-4">Document Distribution</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-[11px] text-[#615d59] font-medium">{d.name} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IntentTagChart({ stats }: { stats: DashboardStats }) {
  const data = useMemo(() => {
    return Object.entries(stats.intentTags)
      .filter(([k]) => k !== 'null' && k !== 'unknown')
      .map(([name, value]) => ({
        name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [stats.intentTags]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#615d59] mb-4">Chat Query Types</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#615d59', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            <Bar dataKey="value" name="Count" radius={[0, 6, 6, 0]} maxBarSize={20}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DocumentTimelineChart({ documents }: { documents: { created_at: string; total_amount: number | null }[] }) {
  const data = useMemo(() => {
    const grouped = new Map<string, { count: number; amount: number }>();
    documents.forEach(doc => {
      const day = new Date(doc.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const existing = grouped.get(day) || { count: 0, amount: 0 };
      existing.count++;
      existing.amount += doc.total_amount || 0;
      grouped.set(day, existing);
    });
    return Array.from(grouped.entries())
      .map(([date, vals]) => ({ date, ...vals }))
      .reverse()
      .slice(-14);
  }, [documents]);

  if (data.length < 2) return null;

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#615d59] mb-4">Document Activity (Last 14 Days)</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0075de" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0075de" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
            <XAxis dataKey="date" tick={{ fill: '#615d59', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#615d59', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" name="Documents" stroke="#0075de" strokeWidth={2} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProcessingStatusChart({ stats }: { stats: DashboardStats }) {
  const data = [
    { name: 'Extracted', value: stats.extractedDocuments, color: '#1aae39' },
    { name: 'Failed', value: stats.failedDocuments, color: '#dd5b00' },
    { name: 'Pending', value: stats.pendingDocuments, color: '#0075de' },
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#615d59] mb-4">Processing Status</h3>
      <div className="space-y-3">
        {data.map(d => (
          <div key={d.name}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-black font-semibold">{d.name}</span>
              <span className="font-mono text-[#615d59]/80">{d.value} ({Math.round((d.value / total) * 100)}%)</span>
            </div>
            <div className="h-2 bg-black/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
