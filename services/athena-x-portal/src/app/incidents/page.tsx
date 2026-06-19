'use client';

import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Users, 
  Server, 
  FileText 
} from 'lucide-react';

export default function IncidentCenterPage() {
  const [activeTab, setActiveTab] = useState('BLAST_RADIUS');

  const recoverySteps = [
    { label: 'Verify OPA Policy Compliance', desc: 'Confirm capacity upgrades stay within organizational limits.', status: 'COMPLETED' },
    { label: 'AWS volume API ModifyVolume command dispatch', desc: 'Scale GP3 IOPS allocation from 3000 to 6000.', status: 'COMPLETED' },
    { label: 'Poll target disk throughput metrics', desc: 'Observe IO wait queues returned to baseline.', status: 'COMPLETED' },
    { label: 'Ingress traffic throttle rollback', desc: 'Remove checkout route API rate limiting.', status: 'IN_PROGRESS' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertOctagon size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Incident Command Center</h1>
            <p className="text-xs text-zinc-400 mt-1">Isolate blast radius, trace root-causes, and supervise autonomous self-healing operatives.</p>
          </div>
        </div>
        <div className="text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-md self-start sm:self-auto">
          ACTIVE INCIDENT: INC-8821 (P1 CRITICAL)
        </div>
      </div>

      {/* Primary KPI Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-md">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 tracking-widest font-bold uppercase">ESTIMATED REVENUE LOSS</span>
            <div className="text-lg font-bold text-white mt-0.5">$184.20 / min</div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-md">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 tracking-widest font-bold uppercase">ELAPSED OUTAGE TIME</span>
            <div className="text-lg font-bold text-white mt-0.5">8 minutes 42 seconds</div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-md">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 tracking-widest font-bold uppercase">AFFECTED ACTIVE ENDUSERS</span>
            <div className="text-lg font-bold text-white mt-0.5">4,812 concurrent sessions</div>
          </div>
        </div>
      </div>

      {/* Workspace Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incident Analysis Details Cards */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">RCA Dependency Trace</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Dynamic failure propagation flow isolated via Neo4j topological graph queries.</p>
            </div>
            
            <div className="flex gap-1.5 bg-zinc-900 p-1 rounded-md border border-zinc-800 text-[10px] font-mono self-start sm:self-auto">
              <button 
                onClick={() => setActiveTab('BLAST_RADIUS')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'BLAST_RADIUS' ? 'bg-yellow-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
              >
                Blast Details
              </button>
              <button 
                onClick={() => setActiveTab('TIMELINE')}
                className={`px-3 py-1 rounded transition-colors ${activeTab === 'TIMELINE' ? 'bg-yellow-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
              >
                Audit Timeline
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6 py-4">
            {activeTab === 'BLAST_RADIUS' ? (
              <div className="space-y-4">
                {/* Visual Propagation flow blocks */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-md w-full max-w-[160px] text-center shadow">
                    <span className="text-[9px] text-zinc-500 block mb-1">INGRESS TARGET</span>
                    <span className="font-bold text-white">checkout-route</span>
                  </div>
                  <ArrowRight className="hidden sm:block text-zinc-500" size={16} />
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-md w-full max-w-[160px] text-center shadow">
                    <span className="text-[9px] text-zinc-500 block mb-1">SERVICE TARGET</span>
                    <span className="font-bold text-white">payment-service</span>
                  </div>
                  <ArrowRight className="hidden sm:block text-rose-400" size={16} />
                  <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-md w-full max-w-[160px] text-center shadow">
                    <span className="text-[9px] text-rose-400 block mb-1">ROOT CAUSE NODE</span>
                    <span className="font-bold text-rose-400">database-master-01</span>
                  </div>
                </div>

                {/* Table details */}
                <div className="border border-zinc-800 rounded-md overflow-hidden text-xs">
                  <div className="grid grid-cols-3 bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-[10px] text-zinc-500 uppercase font-bold">
                    <span>Component Name</span>
                    <span>Service Owner</span>
                    <span>Impact Severity</span>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {[
                      { name: 'checkout-service (K8s Pods)', owner: 'Core Transactions', status: 'DEGRADED / 504' },
                      { name: 'payment-service (K8s Pods)', owner: 'Billing & Subscriptions', status: 'SLOW / 1450ms' },
                      { name: 'database-master-01 (RDS Postgres)', owner: 'DB Infrastructure', status: 'SATURATED / IOPS LIMIT' },
                    ].map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 px-4 py-3 text-zinc-400">
                        <span className="font-medium text-white">{row.name}</span>
                        <span>{row.owner}</span>
                        <span className="font-mono text-zinc-300">{row.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-72 overflow-y-auto text-xs font-mono text-zinc-400">
                <div className="flex gap-4 items-start border-l-2 border-zinc-855 pl-4 pb-4 relative">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-rose-500 border-2 border-[#050507]"></span>
                  <div>
                    <span className="font-bold text-white">21:42:01 // ALERT FIRED</span>
                    <p className="text-[11px] mt-0.5">checkout-service HTTP 504 Gateway Timeouts rate exceeded threshold (5.2%)</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-l-2 border-zinc-800 pl-4 pb-4 relative">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-yellow-500 border-2 border-[#050507]"></span>
                  <div>
                    <span className="font-bold text-white">21:42:15 // SWARM ALLOCATION</span>
                    <p className="text-[11px] mt-0.5">ATHENA-X supervisor spawned solver instance. Querying graph layers...</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-l-2 border-zinc-800 pl-4 pb-4 relative">
                  <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#050507]"></span>
                  <div>
                    <span className="font-bold text-white">21:47:26 // REMEDIATION DISPATCH</span>
                    <p className="text-[11px] mt-0.5">AWS volume API scale modifier issued. Volume state changing GP3 IOPS values.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Self-Healing Operator Checklists Panel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between shadow-md">
          <div className="border-b border-zinc-800 pb-4 mb-4">
            <h3 className="font-bold text-sm text-white">Remediation Blueprint</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Executing target self-healing steps under OPA security shields.</p>
          </div>

          <div className="flex-1 space-y-4">
            {recoverySteps.map((step, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                {step.status === 'COMPLETED' ? (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin shrink-0 mt-0.5"></div>
                )}
                <div>
                  <div className={`font-bold ${step.status === 'COMPLETED' ? 'text-zinc-300' : 'text-yellow-500'}`}>{step.label}</div>
                  <div className="text-[10px] text-zinc-555 mt-0.5">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-6">
            <button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md text-xs font-semibold transition">
              ABORT AUTONOMOUS MITIGATION
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
