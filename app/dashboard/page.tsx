'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  LogOut, 
  Send, 
  MessageCircle, 
  Loader2, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { GlassButton } from '@/components/GlassButton';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Total Clients', value: '124', change: '+12%', icon: Users, color: 'text-blue-400' },
  { label: 'Docs Processed', value: '1,420', change: '+24%', icon: FileText, color: 'text-accent' },
  { label: 'Pending Queries', value: '18', change: '-5%', icon: MessageCircle, color: 'text-amber-400' },
  { label: 'Reconciliation Rate', value: '99.2%', change: '+0.4%', icon: CheckCircle2, color: 'text-emerald-400' },
];

const recentActivity = [
  { id: 1, client: 'ABC Corp', action: 'Uploaded Invoice #882', time: '2 mins ago', status: 'Processed' },
  { id: 2, client: 'John Doe', action: 'Asked about GST liability', time: '15 mins ago', status: 'Enma Replied' },
  { id: 3, client: 'Zenith Tech', action: 'Connected Telegram', time: '1 hour ago', status: 'New' },
  { id: 4, client: 'Global Logistics', action: 'Uploaded Bank Statement', time: '3 hours ago', status: 'Reconciling' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [firmData, setFirmData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch firm data from Supabase
        const { data, error } = await supabase
          .from('ca_firms')
          .select('*')
          .eq('firebase_uid', currentUser.uid)
          .single();
        
        if (data) {
          setFirmData(data);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex overflow-hidden h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-3xl flex flex-col shrink-0">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(255,78,0,0.8)]" />
            <span className="text-white font-bold text-xl tracking-tight">Enma.</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'clients', label: 'Clients', icon: Users },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Pro Plan</span>
            </div>
            <p className="text-[11px] text-white/30 leading-relaxed">
              Your firm is using 42% of its monthly document quota.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-noise pointer-events-none z-0" />
        <div className="glowing-orb-blue animate-float-delayed top-0 right-0 opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,78,0,0.05),transparent)] pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96">
            <Search className="w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search clients, documents, or queries..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-black" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{firmData?.ca_name || 'Admin User'}</p>
                <p className="text-[11px] text-white/40">{firmData?.firm_name || user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center font-bold text-sm">
                {(firmData?.ca_name || 'AU').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-serif text-3xl font-medium mb-2">{firmData?.firm_name || 'Firm Overview'}</h1>
                <p className="text-white/40 text-sm">Welcome back, {firmData?.ca_name || 'Admin'}. Here&apos;s what Enma has been up to today.</p>
              </div>
              <GlassButton variant="accent" className="px-6 py-2.5">
                <Plus className="w-4 h-4" />
                Invite New Client
              </GlassButton>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-card rounded-[32px] p-6 group hover:border-white/20 transition-all shadow-[0_0_0_transparent] hover:shadow-[0_15px_40px_rgba(255,78,0,0.1)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors" />
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-medium tracking-tight">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="font-serif text-2xl font-medium">Recent Activity</h2>
                  <button className="text-xs font-bold text-accent uppercase tracking-widest hover:text-accent-hover transition-colors">View All</button>
                </div>
                <div className="glass-card rounded-[32px] overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Clock className="w-5 h-5 text-white/20" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">{activity.client}</p>
                            <p className="text-xs text-white/40">{activity.action}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">
                            {activity.status}
                          </span>
                          <p className="text-[10px] text-white/20">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bot Status / Quick Actions */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl font-medium mb-6 px-2">Bot Status</h2>
                  <div className="glass-card rounded-[32px] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <MessageCircle className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Enma AI Active</h3>
                        <p className="text-xs text-emerald-400/60 font-medium">System operational</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Uptime</span>
                        <span className="text-white/80">99.98%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Avg. Response Time</span>
                        <span className="text-white/80">1.2s</span>
                      </div>
                    </div>

                    <GlassButton 
                      href="https://t.me/enma12bot"
                      className="w-full py-3 bg-[#229ED9]/10 border-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9]/20"
                    >
                      <Send className="w-4 h-4" />
                      Test Bot
                    </GlassButton>
                  </div>
                </div>

                <div className="glass-card rounded-[32px] p-8 bg-accent/5 border-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    <h3 className="font-bold text-white">Security Tip</h3>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed mb-6">
                    You have 3 clients who haven&apos;t signed the latest DPA update. Remind them to maintain compliance.
                  </p>
                  <button className="flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-hover transition-all group">
                    Review Clients
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
