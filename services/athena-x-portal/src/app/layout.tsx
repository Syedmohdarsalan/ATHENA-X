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
  Lock 
} from 'lucide-react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAlertOpen, setIsAlertOpen] = useState(true);

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
      <body className="bg-[#030712] text-[#f3f4f6] font-sans antialiased overflow-hidden h-screen w-screen flex flex-col">
        
        {/* Top Navigation Control Bar */}
        <header className="h-14 border-b border-[#1b2535] bg-[#0b0f19]/80 backdrop-blur flex items-center justify-between px-6 select-none z-40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-gradient-to-tr from-[#06b6d4] to-[#10b981] flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              AX
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white">ATHENA<span className="text-[#06b6d4]">-X</span></span>
              <span className="text-[9px] text-[#9b9da3] block leading-none font-mono">INFRASTRUCTURE OS</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-[#111827] border border-[#1e293b] px-3 py-1.5 rounded-md w-96 text-xs text-[#9b9da3]">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search services, nodes, incident IDs (Cmd + K)..." 
              className="bg-transparent border-none outline-none w-full text-gray-200 placeholder-gray-500" 
            />
          </div>

          <div className="flex items-center gap-4">
            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center gap-2 bg-[#052e16] border border-[#14532d] px-2.5 py-1 rounded text-[10px] text-[#4ade80] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
              SYS: AUTONOMOUS REMEDIATION ACTIVE
            </div>

            {/* Notifications */}
            <div className="relative cursor-pointer text-[#9b9da3] hover:text-white p-1">
              <Bell size={18} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#f43f5e] ring-2 ring-[#030712]"></span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 border-l border-[#1e293b] pl-4">
              <div className="h-7 w-7 rounded-full bg-[#1e293b] flex items-center justify-center text-gray-300 cursor-pointer hover:border-[#06b6d4] border border-transparent">
                <User size={14} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Dashboard Left Navigation Panel */}
          <aside className="w-64 border-r border-[#1b2535] bg-[#070b15]/65 flex flex-col py-6 select-none z-30">
            <div className="px-6 mb-4 text-[#9b9da3] tracking-widest text-[9px] uppercase font-bold">OPERATIONS SYSTEMS</div>
            <nav className="flex-1 flex flex-col gap-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.route;
                const Icon = item.icon;
                return (
                  <a 
                    key={item.route}
                    href={item.route}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-[#06b6d4]/10 text-[#06b6d4] border-l-2 border-[#06b6d4] glow-cyan' 
                        : 'text-[#9b9da3] hover:text-white hover:bg-[#111827]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-[#f43f5e] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="px-6 pt-4 border-t border-[#1b2535] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] text-[#9b9da3]">
                <Lock size={12} />
                <span>OPA Shield: ENFORCED</span>
              </div>
              <div className="text-[10px] text-[#4b5563] font-mono">
                REF: cluster-prod-aws-01
              </div>
            </div>
          </aside>

          {/* Active Dynamic Workspace Target */}
          <main className="flex-1 flex flex-col overflow-hidden relative bg-[#030712]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
