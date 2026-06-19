'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock historical infrastructure telemetry
const chartData = [
  { time: '16:00', load: 42, health: 99.98, savings: 84 },
  { time: '17:00', load: 45, health: 99.99, savings: 84 },
  { time: '18:00', load: 58, health: 99.99, savings: 84 },
  { time: '19:00', load: 72, health: 99.97, savings: 85 },
  { time: '20:00', load: 88, health: 99.94, savings: 88 },
  { time: '21:00', load: 94, health: 99.98, savings: 88 },
  { time: '22:00', load: 61, health: 99.99, savings: 88 },
];

export default function CommandCenterPage() {
  const [activeTab, setActiveTab] = useState('LOAD');

  const stats = [
    { label: 'HEALTH SCORE', val: '99.98%', detail: 'Stable, 0 degradation', icon: ShieldCheck, color: 'text-[#10b981]' },
    { label: 'ACTIVE INCIDENTS', val: '1', detail: '1 operational mitigation', icon: AlertTriangle, color: 'text-rose-500' },
    { label: 'COST EFFICIENCY', val: '88.4%', detail: '$4,812 potential savings', icon: TrendingDown, color: 'text-yellow-500' },
    { label: 'RELIABILITY INDEX', val: '99.992%', detail: 'On-track with SLA targets', icon: Activity, color: 'text-amber-400' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Welcome Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Global Command Center</h1>
          <p className="text-xs text-zinc-400 mt-1">Cross-cloud operational monitoring, predictive safety, and autonomous healing operators.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button className="bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-md text-xs hover:bg-zinc-800 hover:text-white transition flex items-center gap-2 text-zinc-300">
            <RefreshCw size={13} />
            Force Sync Twin
          </button>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg flex justify-between items-start shadow-md hover:border-yellow-500/30 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 tracking-widest uppercase font-bold block">{stat.label}</span>
                <span className="text-2xl font-bold text-white tracking-tight">{stat.val}</span>
                <span className="text-[11px] text-zinc-400 block pt-1">{stat.detail}</span>
              </div>
              <div className={`p-2 rounded bg-zinc-900 ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* System Ingestion Charts & Incident Log Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">System Throughput & Scaling Trends</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Real-time aggregate computing loads and cluster optimization patterns.</p>
            </div>
            
            <div className="flex gap-1.5 bg-zinc-900 p-1 rounded-md border border-zinc-800 text-[10px] self-start sm:self-auto">
              <button 
                onClick={() => setActiveTab('LOAD')}
                className={`px-2.5 py-1 rounded transition-colors ${activeTab === 'LOAD' ? 'bg-yellow-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
              >
                CPU Load %
              </button>
              <button 
                onClick={() => setActiveTab('SAVINGS')}
                className={`px-2.5 py-1 rounded transition-colors ${activeTab === 'SAVINGS' ? 'bg-yellow-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
              >
                Cost Savings
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px' }}
                  labelStyle={{ color: '#fff', fontSize: '10px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeTab === 'LOAD' ? 'load' : 'savings'} 
                  stroke="#eab308" 
                  fillOpacity={1} 
                  fill="url(#colorYellow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents Board Side Panel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between shadow-md">
          <div className="border-b border-zinc-800 pb-4 mb-4">
            <h3 className="font-bold text-sm text-white">Active Remediation Logs</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Automated recovery operations in progress.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-rose-500/10 text-rose-400 text-[9px] font-bold px-2 py-0.5 rounded border border-rose-500/20">
                  P1 CRITICAL
                </span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Clock size={10} />
                  3m active
                </span>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-white">Postgres DB Saturation</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">
                  Disk wait is spiking under checkout-service routes. Remediation operator executing IOPS scaling module.
                </div>
              </div>
              <div className="border-t border-zinc-800 pt-2 flex items-center justify-between text-[10px]">
                <span className="text-yellow-500 font-semibold">STATUS: SCALING LIMITS</span>
                <a href="/incidents" className="text-zinc-400 hover:text-white flex items-center gap-0.5">
                  Inspect Blast
                  <ArrowUpRight size={10} />
                </a>
              </div>
            </div>

            <div className="border border-zinc-800/50 bg-zinc-950 rounded-md p-3 flex items-center gap-3 text-xs text-zinc-400">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <div>
                <div className="font-bold text-zinc-200">Scale replica count prod-aws-eks-01</div>
                <div className="text-[10px] text-zinc-500">Autonomous recovery success • 2h ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
