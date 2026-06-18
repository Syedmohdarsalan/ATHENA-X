'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Activity, 
  ShieldAlert 
} from 'lucide-react';

const forecastData = [
  { day: 'Mon', disk: 62, memory: 74, outageRisk: 5 },
  { day: 'Tue', disk: 64, memory: 76, outageRisk: 5 },
  { day: 'Wed', disk: 68, memory: 78, outageRisk: 8 },
  { day: 'Thu', disk: 74, memory: 82, outageRisk: 12 },
  { day: 'Fri', disk: 82, memory: 88, outageRisk: 24 },
  { day: 'Sat', disk: 88, memory: 92, outageRisk: 42 },
  { day: 'Sun (Proj)', disk: 94, memory: 97, outageRisk: 88 },
];

export default function PredictiveIntelligencePage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b2535] pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <TrendingUp size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Predictive Intelligence</h1>
            <p className="text-xs text-[#9b9da3] mt-1">Resource exhaustion forecasting, safety capacity modeling, and incident threat vector calculations.</p>
          </div>
        </div>
      </div>

      {/* Grid: 3 Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0b0f19] border border-[#1b2535] p-5 rounded-lg flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#eab308]/15 text-[#eab308] rounded-md">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#9b9da3] tracking-widest font-bold uppercase">DISK EXHAUSTION TARGET</span>
            <div className="text-base font-bold text-white mt-0.5">3.2 days (us-east-1 DB-pool)</div>
          </div>
        </div>

        <div className="bg-[#0b0f19] border border-[#1b2535] p-5 rounded-lg flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#f43f5e]/15 text-[#f43f5e] rounded-md">
            <ShieldAlert size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#9b9da3] tracking-widest font-bold uppercase">OUTAGE RISK FACTOR (24H)</span>
            <div className="text-base font-bold text-white mt-0.5">88% (checkout routing pathway)</div>
          </div>
        </div>

        <div className="bg-[#0b0f19] border border-[#1b2535] p-5 rounded-lg flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#10b981]/15 text-[#10b981] rounded-md">
            <Activity size={20} />
          </div>
          <div>
            <span className="text-[10px] text-[#9b9da3] tracking-widest font-bold uppercase">AUTONOMOUS RESERVES</span>
            <div className="text-base font-bold text-white mt-0.5">18% reserve compute pooled</div>
          </div>
        </div>
      </div>

      {/* Workspace Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Resource Depletion Projection Chart */}
        <div className="lg:col-span-2 bg-[#0b0f19] border border-[#1b2535] rounded-lg p-5 flex flex-col justify-between shadow-md">
          <div className="border-b border-[#1b2535] pb-4 mb-4">
            <h3 className="font-bold text-sm text-white">Capacity Depletion Curves</h3>
            <p className="text-[11px] text-[#9b9da3] mt-0.5">7-day tracking and automated neural projections for hardware bottlenecks.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b2535" />
                <XAxis dataKey="day" stroke="#9b9da3" fontSize={10} />
                <YAxis stroke="#9b9da3" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070b15', border: '1px solid #1b2535', borderRadius: '4px' }}
                  labelStyle={{ color: '#fff', fontSize: '10px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="memory" stroke="#eab308" fillOpacity={1} fill="url(#colorYellow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Threats List */}
        <div className="bg-[#0b0f19] border border-[#1b2535] rounded-lg p-5 flex flex-col justify-between shadow-md">
          <div className="border-b border-[#1b2535] pb-4 mb-4">
            <h3 className="font-bold text-sm text-white">Threat Scenarios</h3>
            <p className="text-[11px] text-[#9b9da3] mt-0.5">Projections of high-risk failure events with confidence models.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {[
              { title: 'Postgres Volume Overflow', risk: '88% Outage Likelihood', target: 'vol-08f921ab', color: 'border-[#f43f5e]/30 bg-[#f43f5e]/5 text-[#fda4af]' },
              { title: 'EC2 Cluster Quota Saturation', risk: '42% Outage Likelihood', target: 'aws-us-east-1', color: 'border-[#eab308]/30 bg-[#eab308]/5 text-[#fef08a]' },
              { title: 'API Ingress Route Rate-Exceeded', risk: '12% Outage Likelihood', target: 'payment-service', color: 'border-[#3b82f6]/30 bg-[#3b82f6]/5 text-[#bfdbfe]' },
            ].map((threat, idx) => (
              <div key={idx} className={`border p-4 rounded-md space-y-2 ${threat.color}`}>
                <div className="flex justify-between items-start text-xs font-bold">
                  <span>{threat.title}</span>
                  <span className="text-[10px] uppercase font-mono">{threat.risk}</span>
                </div>
                <div className="text-[10px] opacity-80">
                  Target Component: <span className="font-mono">{threat.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
