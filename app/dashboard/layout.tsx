'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useFirmData } from '@/hooks/use-dashboard-data';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Loader2,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  TrendingUp,
  Send,
  Menu,
  X,
  MessageCircle,
  HelpCircle,
  UserPlus,
} from 'lucide-react';
import { DashboardContext } from './dashboard-context';

// ─── Navigation Items ────────────────────────────────────────────────────────

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'documents', label: 'Documents', icon: FileText, href: '/dashboard/documents', badge: '142' },
  { id: 'clients', label: 'Clients', icon: Users, href: '/dashboard/clients', badge: '38' },
  { id: 'chat', label: 'Chat with Enma', icon: MessageCircle, href: '/dashboard/chat', pulse: true },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, signOut } = useAuth();
  const [globalSearch, setGlobalSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const { firmData, loading: firmLoading } = useFirmData(user?.id || null);

  // Redirect to onboarding if profile is not complete
  useEffect(() => {
    if (!firmLoading && user && firmData === null) {
      // No firm data found — need onboarding
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

  return (
    <DashboardContext.Provider value={{ user, firmData, firmLoading, globalSearch, setGlobalSearch }}>
      <div className="min-h-screen bg-[#f6f5f4] text-black font-sans flex overflow-hidden h-screen selection:bg-[#0075de]/20">
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
            fixed lg:static inset-y-0 left-0 z-50
            w-64 border-r border-[#e6e6e6] bg-[#f6f5f4] flex flex-col shrink-0
            transform transition-transform duration-300 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Workspace Switcher Header */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0075de] text-white font-extrabold text-[14px]">
                {getWorkspaceInitials()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-black truncate">
                  {firmData?.firm_name || 'Sharma & Co'}
                </div>
                <div className="text-[12px] text-[#615d59]">
                  {firmData?.subscription_plan === 'trial' ? 'Professional Trial' : 'Professional Plan'}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#615d59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Sidebar Search */}
          <div className="px-4 mb-2.5">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-black/[0.04] border border-transparent rounded-md transition-all focus-within:border-[#e6e6e6] focus-within:bg-white focus-within:shadow-sm">
              <Search className="w-3.5 h-3.5 text-[#615d59] shrink-0" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-xs w-full text-black placeholder:text-[#a39e98]"
              />
              {globalSearch ? (
                <button onClick={() => setGlobalSearch('')} className="text-[#a39e98] hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-[10px] text-[#a39e98] bg-white border border-[#e6e6e6] px-1 py-0.5 rounded font-mono select-none">⌘K</span>
              )}
            </div>
          </div>

          {/* Navigation Rows */}
          <nav className="flex-1 px-2.5 space-y-0.5">
            {navItems.map((item) => {
              const isActive = getActiveNav() === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    relative w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors group
                    ${isActive
                      ? 'bg-[#0075de]/8 text-black font-semibold'
                      : 'text-[#31302e] hover:bg-black/5'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#0075de] rounded-r-md" />
                  )}
                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#0075de] stroke-[2.2]' : 'text-[#31302e] stroke-[1.8]'}`} />
                  <span className="text-sm">{item.label}</span>

                  {item.badge && (
                    <span className="ml-auto font-mono text-[11px] text-[#615d59] bg-white border border-[#e6e6e6] px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}

                  {item.pulse && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1aae39] animate-pulse" />
                  )}
                </Link>
              );
            })}

            <div className="text-[11px] font-bold tracking-wider text-[#a39e98] uppercase px-3 pt-6 pb-2">
              Workspace
            </div>

            <Link
              href="/dashboard/settings"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#31302e] hover:bg-black/5"
            >
              <Settings className="w-4 h-4 stroke-[1.8]" />
              <span className="text-sm">Settings</span>
            </Link>

            <button
              onClick={() => alert('Teammate invitation is a premium feature.')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#31302e] hover:bg-black/5 text-left cursor-pointer"
            >
              <UserPlus className="w-4 h-4 stroke-[1.8]" />
              <span className="text-sm">Invite teammate</span>
            </button>

            <button
              onClick={() => alert('Support tickets can be filed in Chat widget.')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#31302e] hover:bg-black/5 text-left cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 stroke-[1.8]" />
              <span className="text-sm">Help & support</span>
            </button>
          </nav>

          {/* Bottom Panel */}
          <div className="p-4 mt-auto border-t border-[#e6e6e6]">
            {/* Upgrade Nudge */}
            <div className="bg-white border border-[#e6e6e6] rounded-xl p-3.5 mb-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#d6b6f6] to-[#b48be0] flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-[#391c57]" />
                </div>
                <span className="text-xs font-bold text-black">142 / unlimited</span>
              </div>
              <div className="h-1 bg-[#f6f5f4] rounded-full overflow-hidden mb-2">
                <div className="h-full w-[62%] bg-[#0075de] rounded-full" />
              </div>
              <p className="text-[11px] text-[#615d59] leading-relaxed">
                Docs processed this month. {firmData?.subscription_plan === 'trial' ? 'Free trial' : 'Pro plan'} resets in 13 days.
              </p>
            </div>

            {/* Telegram Status */}
            {firmData?.id && (
              <a
                href={`https://t.me/enma12bot?start=${firmData.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#229ED9] hover:bg-[#229ED9]/5 transition-colors mb-2 text-xs font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Bot</span>
                <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </a>
            )}

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#31302e] hover:text-red-600 hover:bg-red-500/5 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 stroke-[1.8]" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-[#f6f5f4]">
          {/* Top Header */}
          <header className="h-14 border-b border-[#e6e6e6] flex items-center justify-between px-6 shrink-0 relative z-10 bg-white/80 backdrop-blur-xl">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center border border-[#e6e6e6] text-[#615d59] hover:bg-black/5"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Info */}
            <div className="flex items-center gap-1.5 text-[13px] text-[#615d59]">
              <span className="font-semibold text-black">{firmData?.firm_name || 'Sharma & Co'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a39e98" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              <span className="capitalize">{getActiveNav()}</span>
            </div>

            {/* Quick Actions & Avatar */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => alert('Add client feature is coming soon.')}
                className="py-1.5 px-3.5 bg-[#0075de] hover:bg-[#005bb5] text-white rounded-full font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add client
              </button>

              <button className="w-8 h-8 rounded-full border border-[#e6e6e6] bg-white flex items-center justify-center text-[#615d59] hover:bg-gray-50 transition-colors relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#0075de] rounded-full" />
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff64c8] to-[#d6b6f6] text-white flex items-center justify-center font-bold text-[13px] shadow-sm select-none">
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
                className="p-6 md:p-10 max-w-[1400px] mx-auto"
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

