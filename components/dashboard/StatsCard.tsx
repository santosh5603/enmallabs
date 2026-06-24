'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  changeBadge?: string;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  suffixSmall?: string;
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
      const eased = 1 - Math.pow(1 - progress, 3);
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

export function StatsCard({
  label, value, icon, iconBg, changeBadge, subtitle,
  prefix = '', suffix = '', suffixSmall, loading = false,
}: StatsCardProps) {
  const animatedValue = useCountUp(value, 1200, !loading);

  if (loading) {
    return (
      <div className="bg-white border border-[#e6e6e6] rounded-xl p-6">
        <div className="flex items-center justify-between mb-[18px]">
          <div className="w-9 h-9 rounded-[9px] bg-black/5 animate-pulse" />
          <div className="h-5 w-14 bg-black/5 rounded-full animate-pulse" />
        </div>
        <div className="h-3.5 w-28 bg-black/5 rounded animate-pulse mb-1.5" />
        <div className="h-9 w-20 bg-black/5 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#e6e6e6] rounded-xl p-6 cursor-default hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-[18px]">
        <div
          className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        {changeBadge && (
          <span className="text-[12px] font-semibold text-[#1aae39] bg-[#e7f3e9] px-2 py-[2px] rounded-full">
            {changeBadge}
          </span>
        )}
      </div>
      <div className="text-[14px] text-[#615d59] font-medium mb-1.5">{label}</div>
      <div className="text-[36px] font-bold tracking-tight leading-none text-black" style={{ letterSpacing: '-0.625px' }}>
        {prefix}{animatedValue.toLocaleString('en-IN')}{suffix}
        {suffixSmall && <span className="text-[22px] text-[#615d59]">{suffixSmall}</span>}
      </div>
      {subtitle && (
        <div className="mt-3.5 text-[12px] text-[#a39e98]">{subtitle}</div>
      )}
    </motion.div>
  );
}
