'use client';

import { createContext, useContext } from 'react';
import type { FirmData } from '@/hooks/use-dashboard-data';

export interface DashboardContextValue {
  user: any;
  firmData: FirmData | null;
  firmLoading: boolean;
  globalSearch: string;
  setGlobalSearch: (v: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
  documentCount: number;
  clientCount: number;
  chatCount: number;
}

export const DashboardContext = createContext<DashboardContextValue>({
  user: null,
  firmData: null,
  firmLoading: true,
  globalSearch: '',
  setGlobalSearch: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  documentCount: 0,
  clientCount: 0,
  chatCount: 0,
});

export const useDashboard = () => useContext(DashboardContext);
