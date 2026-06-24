'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
}

function useCountUp(target: number, duration: number = 1200, enabled: boolean = true) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!enabled || target === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(target);
      return;
    }

    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    rafId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration, enabled]);

  return count;
}

export function StatsCard({ label, value, icon: Icon, color, prefix = '', suffix = '', loading = false }: StatsCardProps) {
  const animatedValue = useCountUp(value, 1200, !loading);

  if (loading) {
    return (
      <div className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-xl bg-black/5 animate-pulse" />
        </div>
        <div className="h-3 w-20 bg-black/5 rounded animate-pulse mb-2.5" />
        <div className="h-8 w-16 bg-black/5 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white border border-[#e6e6e6] rounded-[20px] p-6 group hover:border-[#ddd] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 relative overflow-hidden cursor-default shadow-sm"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0075de]/5 blur-[40px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center border border-transparent group-hover:border-black/5 transition-all">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-[#615d59] text-[11px] font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-bold tracking-tight text-black">
        {prefix}{animatedValue.toLocaleString('en-IN')}{suffix}
      </h3>
    </motion.div>
  );
}

