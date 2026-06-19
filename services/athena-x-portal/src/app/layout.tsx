'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Network, 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  GitBranch, 
  Settings, 
  Bell, 
  Search, 
  User, 
  ChevronRight, 
  Lock,
  Menu,
  X
} from 'lucide-react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Command Center', route: '/', icon: Activity },
    { label: 'Digital Twin', route: '/twin', icon: Network },
    { label: 'Agent Intelligence', route: '/reasoning', icon: Cpu },
    { label: 'Incident Center', route: '/incidents', icon: AlertTriangle, badge: '1' },
    { label: 'Predictive Intelligence', route: '/predictive', icon: TrendingUp },
    { label: 'Knowledge Graph', route: '/knowledge', icon: GitBranch },
  ];

  return (
    <html lang="en" className="dark">
      <head>
        <title>ATHENA-X // Operations OS</title>
        <meta name="description" content="Autonomous Technical Hyper-Intelligent Engineering Nexus" />
      </head>
      <body className="bg-[#050507] text-[#f4f4f5] font-sans antialiased overflow-hidden h-screen w-screen flex flex-col">
        
        {/* Top Navigation Control Bar */}
        <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-6 select-none z-40">
          <div className="flex items-center gap-3">
            {/* Hamburger menu for mobile */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 text-zinc-400 hover:text-white md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="h-8 w-8 rounded bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              AX
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white">ATHENA<span className="text-yellow-500">-X</span></span>
              <span className="text-[9px] text-[#9b9da3] block leading-none font-mono">INFRASTRUCTURE OS</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md w-96 text-xs text-zinc-400">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search services, nodes, incident IDs (Cmd + K)..." 
              className="bg-transparent border-none outline-none w-full text-zinc-200 placeholder-zinc-600" 
            />
          </div>

          <div className="flex items-center gap-4">
            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded text-[10px] text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SYS: AUTONOMOUS REMEDIATION ACTIVE
            </div>

            {/* Notifications */}
            <div className="relative cursor-pointer text-zinc-400 hover:text-white p-1">
              <Bell size={18} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-zinc-950"></span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
              <div className="h-7 w-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-300 cursor-pointer hover:border-yellow-500 border border-transparent">
                <User size={14} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Backdrop overlay on mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Dashboard Left Navigation Panel */}
          <aside className={`fixed md:relative inset-y-0 left-0 w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col py-6 select-none z-30 transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="px-6 mb-4 text-zinc-500 tracking-widest text-[9px] uppercase font-bold">OPERATIONS SYSTEMS</div>
            <nav className="flex-1 flex flex-col gap-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.route;
                const Icon = item.icon;
                return (
                  <a 
                    key={item.route}
                    href={item.route}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500 glow-yellow' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="px-6 pt-4 border-t border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <Lock size={12} />
                <span>OPA Shield: ENFORCED</span>
              </div>
              <div className="text-[10px] text-zinc-600 font-mono">
                REF: cluster-prod-aws-01
              </div>
            </div>
          </aside>

          {/* Active Dynamic Workspace Target */}
          <main className="flex-1 flex flex-col overflow-hidden relative bg-[#050507]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
