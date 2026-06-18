'use client';

import React, { useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Cpu, 
  Clock, 
  AlertCircle, 
  MessageSquareCode, 
  TrendingUp, 
  Target 
} from 'lucide-react';

const agentNodes: Node[] = [
  { 
    id: 'super', 
    data: { label: 'Supervisor Agent' }, 
    position: { x: 250, y: 0 },
    style: { background: '#0891b2', border: '1px solid #22d3ee', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' } 
  },
  { 
    id: 'explore', 
    data: { label: 'Explorer Agent' }, 
    position: { x: 100, y: 100 },
    style: { background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: 'plan', 
    data: { label: 'Planner Agent' }, 
    position: { x: 400, y: 100 },
    style: { background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: 'execute', 
    data: { label: 'Executor Agent' }, 
    position: { x: 100, y: 200 },
    style: { background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: 'verify', 
    data: { label: 'Verifier Agent' }, 
    position: { x: 400, y: 200 },
    style: { background: '#1e293b', border: '1px solid #10b981', color: '#a7f3d0', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' } 
  }
];

const agentEdges: Edge[] = [
  { id: 'es-exp', source: 'super', target: 'explore', animated: true, style: { stroke: '#06b6d4' } },
  { id: 'ee-plan', source: 'explore', target: 'plan', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'ep-exe', source: 'plan', target: 'execute', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'ex-ver', source: 'execute', target: 'verify', animated: true, style: { stroke: '#10b981' } }
];

// Historical confidence scores during analysis steps
const confidenceData = [
  { step: 'T0 (Alert)', val: 32 },
  { step: 'T1 (Graph Parse)', val: 58 },
  { step: 'T2 (Metrics Match)', val: 78 },
  { step: 'T3 (Runbook Read)', val: 86 },
  { step: 'T4 (Shield Verified)', val: 94 },
  { step: 'T5 (Action Success)', val: 98 },
];

export default function AgentIntelligencePage() {
  const [selectedAgent, setSelectedAgent] = useState('Supervisor');

  const agentsList = [
    { name: 'Supervisor Agent', desc: 'Decomposes incident alerts, orchestrates target swarms, makes final execution choices.', status: 'IDLE' },
    { name: 'Explorer Agent', desc: 'Queries Neo4j Knowledge Graph schemas to isolate structural dependency routes.', status: 'IDLE' },
    { name: 'Planner Agent', desc: 'Queries Qdrant Vector databases to match runbooks, proposing recovery routes.', status: 'IDLE' },
    { name: 'Executor Agent', desc: 'Validates script actions against OPA Shield files, invoking AWS/K8s operators.', status: 'IDLE' },
    { name: 'Verifier Agent', desc: 'Monitors real-time digital twin state buffers post-execution to verify recovery.', status: 'MONITORING' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-sans">
      
      {/* Topology Navigation bar */}
      <div className="h-14 border-b border-[#1b2535] bg-[#0b0f19] flex items-center justify-between px-6 select-none shrink-0 font-mono text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Cpu size={14} className="text-[#06b6d4]" />
            <span className="font-bold">Agent Orchestration Chamber</span>
          </div>
          <span className="text-[#4b5563]">|</span>
          <div>
            <span className="text-[#9b9da3]">Session ID:</span>
            <span className="text-[#06b6d4] font-bold ml-1">session-8821</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[#9b9da3]">AGENT CONFIDENCE METRIC:</span>
          <span className="text-[#10b981] font-bold">98.4% [CRITICAL DECISION MATCH]</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* React Flow Chamber */}
        <div className="flex-1 h-full bg-[#030712] relative border-r border-[#1b2535]">
          <div className="absolute top-4 left-4 z-10 bg-[#070b15]/90 border border-[#1b2535] p-3 rounded-md max-w-xs text-xs shadow-lg">
            <h4 className="font-bold text-white mb-1">State Machine Flow</h4>
            <p className="text-[#9b9da3] text-[11px] leading-relaxed">
              LangGraph workflow rendering. Active green paths represent resolved pathways in the current incident transaction execution.
            </p>
          </div>

          <ReactFlow 
            nodes={agentNodes} 
            edges={agentEdges}
            fitView
          >
            <Background color="#1e293b" gap={20} size={1} />
          </ReactFlow>
        </div>

        {/* Dynamic thoughts logs list */}
        <div className="w-96 bg-[#070b15] p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <div className="space-y-6">
            <div className="border-b border-[#1b2535] pb-4">
              <span className="text-[10px] text-[#9b9da3] tracking-widest font-bold uppercase block mb-1">Active Swarm Profiles</span>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Target size={15} className="text-[#06b6d4]" />
                Agent Roles & System Status
              </h3>
            </div>

            {/* List of Swarm Agents */}
            <div className="space-y-3">
              {agentsList.map((agent, index) => (
                <div key={index} className="bg-[#111827] border border-[#1b2535] p-3.5 rounded-md space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{agent.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      agent.status === 'MONITORING' 
                        ? 'bg-[#10b981]/15 text-[#4ade80] border border-[#10b981]/30' 
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9b9da3] leading-relaxed">{agent.desc}</p>
                </div>
              ))}
            </div>

            {/* Confidence Trend chart */}
            <div className="space-y-2 border-t border-[#1b2535] pt-4">
              <span className="text-[9px] text-[#9b9da3] tracking-wider font-bold block uppercase">Swarm Diagnostics Confidence Timeline</span>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={confidenceData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="step" stroke="#6b7280" fontSize={8} />
                    <YAxis stroke="#6b7280" fontSize={8} />
                    <Area type="monotone" dataKey="val" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#1b2535] pt-4 mt-6">
            <div className="bg-[#111827] border border-[#1e293b] p-3 rounded-md text-xs font-mono text-[#9b9da3] space-y-1">
              <div className="text-white font-bold flex items-center gap-1.5 mb-1.5">
                <Clock size={12} className="text-[#06b6d4]" />
                Session Audit Trails
              </div>
              <div className="text-[10px]">&gt; Explorer matched Neo4j dependencies</div>
              <div className="text-[10px]">&gt; Planner queried Qdrant for JIRA-9821</div>
              <div className="text-[10px] text-[#4ade80]">&gt; OPA verified execution command [OK]</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
