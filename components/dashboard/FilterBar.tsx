'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
}

function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border
          ${value
            ? 'bg-[#0075de]/10 border-[#0075de]/20 text-[#0075de]'
            : 'bg-white border-[#e6e6e6] text-[#615d59] hover:text-black hover:bg-black/[0.02]'
          }
        `}
      >
        <span>{value ? selectedLabel : label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 z-50 min-w-[180px] bg-white border border-[#e6e6e6] rounded-2xl p-1.5 shadow-xl"
          >
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${!value ? 'text-[#0075de] bg-[#0075de]/5' : 'text-[#615d59] hover:text-black hover:bg-black/[0.02]'}`}
            >
              All
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${value === option.value ? 'text-[#0075de] bg-[#0075de]/5' : 'text-[#615d59] hover:text-black hover:bg-black/[0.02]'
                  }`}
              >
                <span>{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-[10px] text-[#615d59]/50 font-mono">{option.count}</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string | null;
    onChange: (v: string | null) => void;
  }[];
  resultCount?: number;
  children?: React.ReactNode;
}

export function FilterBar({ search, onSearchChange, searchPlaceholder, filters, resultCount, children }: FilterBarProps) {
  const activeFiltersCount = filters.filter((f) => f.value !== null).length;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-[#e6e6e6] rounded-full px-4 py-2 w-full sm:w-72 transition-all focus-within:border-[#0075de]/50 focus-within:ring-2 focus-within:ring-[#0075de]/5">
        <Search className="w-4 h-4 text-[#615d59]/40 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder || 'Search...'}
          className="bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-[#615d59]/40"
        />
        {search && (
          <button onClick={() => onSearchChange('')} className="text-[#615d59]/40 hover:text-black">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-[#615d59]/40 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {activeFiltersCount > 0 && (
            <span className="text-[10px] font-bold text-[#0075de] bg-[#0075de]/10 px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {filters.map((filter) => (
          <FilterDropdown
            key={filter.key}
            label={filter.label}
            options={filter.options}
            value={filter.value}
            onChange={filter.onChange}
          />
        ))}
      </div>

      {/* Right side */}
      <div className="sm:ml-auto flex items-center gap-3">
        {resultCount !== undefined && (
          <span className="text-xs text-[#615d59]/60">
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
