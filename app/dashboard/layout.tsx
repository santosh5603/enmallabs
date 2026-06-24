'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useFirmData, useDashboardStats, useClients } from '@/hooks/use-dashboard-data';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Loader2,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Search,
  TrendingUp,
  Send,
  X,
  MessageCircle,
  HelpCircle,
  UserPlus,
  BarChart3,
  Shield,
} from 'lucide-react';
import { DashboardContext } from './dashboard-context';

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, signOut } = useAuth();
  const [globalSearch, setGlobalSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const { firmData, loading: firmLoading } = useFirmData(user?.id || null);
  const { stats, loading: statsLoading } = useDashboardStats(firmData?.id || null);
  const { clients, loading: clientsLoading, refetch: refetchClients } = useClients(firmData?.id || null);

  // Real counts from data
  const documentCount = stats?.totalDocuments ?? 0;
  const clientCount = clients?.length ?? 0;
  const chatCount = stats?.totalChatLogs ?? 0;

  // Redirect to onboarding if profile is not complete
  useEffect(() => {
    if (!firmLoading && user && firmData === null) {
      router.push('/onboarding');
    } else if (!firmLoading && firmData && !firmData.onboarding_completed) {
      router.push('/onboarding');
    }
  }, [firmData, firmLoading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f6f5f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#0075de] animate-spin" />
          <p className="text-[#615d59] text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getActiveNav = () => {
    if (pathname === '/dashboard') return 'overview';
    const segment = pathname.split('/')[2];
    return segment || 'overview';
  };

  const getWorkspaceInitials = () => {
    if (!firmData?.firm_name) return 'SC';
    return firmData.firm_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'documents', label: 'Documents', icon: FileText, href: '/dashboard/documents', badge: documentCount > 0 ? String(documentCount) : undefined },
    { id: 'clients', label: 'Clients', icon: Users, href: '/dashboard/clients', badge: clientCount > 0 ? String(clientCount) : undefined },
    { id: 'chat', label: 'Chat with Enma', icon: MessageCircle, href: '/dashboard/chat', pulse: true },
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
    { id: 'audit', label: 'Audit log', icon: Shield, href: '/dashboard/audit' },
  ];

  return (
    <DashboardContext.Provider value={{
      user, firmData, firmLoading, globalSearch, setGlobalSearch,
      sidebarCollapsed, setSidebarCollapsed,
      documentCount, clientCount, chatCount,
      stats, statsLoading, clients, clientsLoading, refetchClients,
    }}>
      <div
        className="min-h-screen bg-[#f6f5f4] text-black font-sans overflow-hidden h-screen selection:bg-[#0075de]/20 grid grid-cols-1 lg:grid-cols-[248px_1fr] transition-[grid-template-columns] duration-300 ease-in-out"
        style={{
          gridTemplateColumns: sidebarCollapsed ? '0px 1fr' : undefined,
        }}
      >
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`
            bg-[#f6f5f4] border-r border-[#e6e6e6] flex flex-col overflow-hidden min-w-0
            fixed top-0 left-0 bottom-0 z-50 w-72 transition-transform duration-300 ease-in-out
            lg:static lg:w-auto lg:z-0 lg:shadow-none lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{ padding: sidebarCollapsed ? '0' : '18px 14px' }}
        >
          {/* Workspace Switcher Header */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/dashboard" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/[0.04] transition-colors flex-grow min-w-0">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0075de] text-white font-extrabold text-[14px] shrink-0">
                {getWorkspaceInitials()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-black truncate">
                  {firmData?.firm_name || 'Sharma & Co'}
                </div>
                <div className="text-[12px] text-[#615d59]">
                  {firmData?.subscription_plan === 'trial' ? 'Professional trial' : 'Professional plan'}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#615d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-1">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Link>
            
            {/* Mobile close button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-[#615d59] hover:text-black hover:bg-black/[0.04] ml-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>


          {/* Sidebar Search */}
          <div className="flex items-center gap-2 px-2.5 py-[7px] bg-black/[0.04] rounded-[5px] mb-2.5">
            <Search className="w-3.5 h-3.5 text-[#615d59] shrink-0" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search"
              className="bg-transparent border-none outline-none text-[13px] w-full text-black placeholder:text-[#a39e98]"
            />
            {globalSearch ? (
              <button onClick={() => setGlobalSearch('')} className="text-[#a39e98] hover:text-black">
                <X className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[11px] text-[#a39e98] bg-white border border-[#e6e6e6] px-[5px] py-[1px] rounded-[3px] font-mono select-none shrink-0">⌘K</span>
            )}
          </div>

          {/* Navigation Rows */}
          <nav className="flex-1 flex flex-col gap-[2px]">
            {navItems.map((item) => {
              const isActive = getActiveNav() === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    relative w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[5px] transition-colors
                    ${isActive
                      ? 'bg-[rgba(0,117,222,0.08)]'
                      : 'hover:bg-black/[0.04]'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute -left-[14px] top-[6px] bottom-[6px] w-[3px] bg-[#0075de] rounded-r-[3px]" />
                  )}
                  <item.icon
                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0075de]' : 'text-[#31302e]'}`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className={`text-[14px] ${isActive ? 'text-black font-semibold' : 'text-[#31302e]'}`}>{item.label}</span>

                  {item.badge && (
                    <span className="ml-auto text-[11px] text-[#615d59] bg-white border border-[#e6e6e6] px-1.5 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}

                  {item.pulse && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1aae39] animate-pulse" />
                  )}
                </Link>
              );
            })}

            <div className="text-[11px] font-semibold tracking-[0.5px] text-[#a39e98] uppercase px-2.5 pt-[18px] pb-[6px]">
              Workspace
            </div>

            <Link
              href="/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[5px] text-[#31302e] hover:bg-black/[0.04] transition-colors"
            >
              <Settings className="w-4 h-4" strokeWidth={1.8} />
              <span className="text-[14px]">Settings</span>
            </Link>

            <button
              onClick={() => alert('Teammate invitation is a premium feature.')}
              className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[5px] text-[#31302e] hover:bg-black/[0.04] transition-colors text-left cursor-pointer"
            >
              <UserPlus className="w-4 h-4" strokeWidth={1.8} />
              <span className="text-[14px]">Invite teammate</span>
            </button>

            <button
              onClick={() => alert('Support tickets can be filed in Chat widget.')}
              className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[5px] text-[#31302e] hover:bg-black/[0.04] transition-colors text-left cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" strokeWidth={1.8} />
              <span className="text-[14px]">Help & support</span>
            </button>
          </nav>

          {/* Bottom Panel */}
          <div className="mt-auto pt-[14px] px-2.5 pb-[6px] border-t border-[#e6e6e6]">
            {/* Upgrade Nudge */}
            <div className="bg-white border border-[#e6e6e6] rounded-lg p-3.5 mb-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#d6b6f6] to-[#b48be0] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#391c57]" />
                </div>
                <span className="text-[13px] font-semibold text-black">{documentCount} / unlimited</span>
              </div>
              <div className="h-1 bg-[#f6f5f4] rounded-full overflow-hidden">
                <div className="h-full bg-[#0075de] rounded-full" style={{ width: `${Math.min(documentCount * 2, 100)}%` }} />
              </div>
              <p className="text-[11px] text-[#615d59] leading-[1.4]">
                Docs processed this month. {firmData?.subscription_plan === 'trial' ? 'Free trial' : 'Pro plan'} resets in 13 days.
              </p>
            </div>

            {/* Telegram Status */}
            {firmData?.id && (
              <a
                href={`https://t.me/enma12bot?start=${firmData.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[5px] text-[#229ED9] hover:bg-[#229ED9]/5 transition-colors mb-1 text-[13px] font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Bot</span>
                <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </a>
            )}

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[5px] text-[#31302e] hover:text-red-600 hover:bg-red-500/5 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.8} />
              <span className="text-[14px]">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex flex-col overflow-hidden relative bg-[#f6f5f4]" style={{ padding: 0 }}>
          {/* Top Header */}
          <header className="sticky top-0 z-10 border-b border-[#e6e6e6] flex items-center justify-between px-4 md:px-8 py-[14px] shrink-0"
            style={{ background: 'rgba(246,245,244,0.85)', backdropFilter: 'saturate(180%) blur(12px)' }}
          >
            {/* Left: Toggle + Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-[#615d59] min-w-0">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarCollapsed(prev => !prev)}
                title="Toggle sidebar"
                className="hidden lg:inline-flex w-[30px] h-[30px] rounded-[7px] bg-white border border-[#e6e6e6] items-center justify-center text-[#615d59] shrink-0 mr-1 cursor-pointer hover:bg-[#f6f5f4] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-[30px] h-[30px] rounded-[7px] bg-white border border-[#e6e6e6] inline-flex items-center justify-center text-[#615d59] shrink-0 mr-1"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <span className="truncate hidden sm:inline">{firmData?.firm_name || 'Sharma & Co'}</span>
              <svg className="hidden sm:inline" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a39e98" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              <span className="text-black font-medium capitalize truncate">{getActiveNav()}</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button className="hidden sm:inline-flex py-[5px] px-3 bg-white border border-[#e6e6e6] rounded-lg text-[14px] font-medium text-[#31302e] items-center gap-1.5 hover:bg-[#f6f5f4] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#31302e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </button>
              <button className="hidden sm:inline-flex py-[5px] px-3 bg-white border border-[#e6e6e6] rounded-lg text-[14px] font-medium text-[#31302e] items-center gap-1.5 hover:bg-[#f6f5f4] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#31302e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Export
              </button>
              <Link
                href="/dashboard/clients"
                className="py-[9px] px-3 sm:px-4 bg-[#0075de] text-white rounded-full text-[14px] font-medium inline-flex items-center gap-1.5 hover:bg-[#005bb5] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                <span className="hidden sm:inline">Add client</span>
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff64c8] to-[#d6b6f6] text-white flex items-center justify-center font-bold text-[13px] cursor-pointer select-none">
                {getWorkspaceInitials()}
              </div>
            </div>
          </header>

          {/* Page Content Panel */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="p-6 md:px-12 md:py-10 max-w-[1400px] mx-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
