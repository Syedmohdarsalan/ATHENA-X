'use client';

import React, { useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Cloud, 
  Sliders, 
  Network, 
  Info, 
  Server, 
  Database, 
  Cpu 
} from 'lucide-react';

const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'input',
    data: { label: 'API Gateway (Linkerd)' }, 
    position: { x: 250, y: 0 },
    style: { background: '#09090b', border: '1px solid #eab308', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' } 
  },
  { 
    id: '2', 
    data: { label: 'Checkout Service (K8s Pod)' }, 
    position: { x: 100, y: 120 },
    style: { background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '3', 
    data: { label: 'Payment Service (K8s Pod)' }, 
    position: { x: 400, y: 120 },
    style: { background: '#09090b', border: '1px solid #27272a', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '4', 
    type: 'output',
    data: { label: 'Postgres DB (AWS RDS)' }, 
    position: { x: 100, y: 240 },
    style: { background: '#1c1917', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' } 
  },
  { 
    id: '5', 
    type: 'output',
    data: { label: 'Redis Cache (ElastiCache)' }, 
    position: { x: 400, y: 240 },
    style: { background: '#09090b', border: '1px solid #10b981', color: '#a7f3d0', borderRadius: '6px', fontSize: '11px' } 
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#eab308' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#eab308' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#10b981' } }
];

export default function DigitalTwinPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(initialNodes[3]); // default to Postgres DB
  const [timeOffset, setTimeOffset] = useState(0);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      {/* Top Controls Bar */}
      <div className="h-auto md:h-14 border-b border-zinc-800 bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between px-6 py-4 md:py-0 select-none shrink-0 gap-4">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 text-white">
            <Cloud size={14} className="text-yellow-500" />
            <span className="font-bold">Live Topology</span>
          </div>
          <span className="text-zinc-700 hidden md:inline">|</span>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">Cluster View:</span>
            <span className="font-mono text-zinc-200">prod-aws-eks-01</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Sliders size={13} />
            Time Travel Dial:
          </span>
          <input 
            type="range" 
            min="0" 
            max="240" 
            value={timeOffset} 
            onChange={(e) => setTimeOffset(Number(e.target.value))}
            className="w-36 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-yellow-500 font-bold">
            {timeOffset === 0 ? 'LIVE STATUS' : `+${Math.floor(timeOffset / 60)}h ${timeOffset % 60}m`}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* React Flow Container */}
        <div className="flex-1 h-[350px] md:h-full bg-[#050507] relative border-b md:border-b-0 md:border-r border-zinc-800 min-h-[300px]">
          <div className="absolute top-4 left-4 z-10 bg-zinc-950/90 border border-zinc-800 p-3 rounded-md max-w-xs text-[11px] leading-relaxed shadow-lg">
            <div className="font-bold text-white mb-1 flex items-center gap-1">
              <Network size={12} className="text-yellow-500" />
              Topology Guide
            </div>
            <p className="text-zinc-400">Click on nodes to inspect real-time metrics, configurations, and upstream/downstream dependency links.</p>
          </div>

          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background color="#27272a" gap={20} size={1} />
            <Controls className="react-flow-controls-custom" />
            <MiniMap 
              nodeColor={(n) => n.id === '4' ? '#ef4444' : '#27272a'} 
              maskColor="rgba(5, 5, 7, 0.6)"
              style={{ background: '#09090b', border: '1px solid #27272a' }}
            />
          </ReactFlow>
        </div>

        {/* Selected Component Inspections Panel */}
        <div className="w-full md:w-80 bg-zinc-950 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[10px] text-zinc-500 tracking-widest font-bold uppercase block mb-1">SELECTED ENTITY</span>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  {selectedNode.id === '4' ? <Database size={15} className="text-rose-500" /> : <Server size={15} className="text-yellow-500" />}
                  {selectedNode.data.label}
                </h3>
              </div>

              {/* Status Section */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-zinc-500 tracking-wider font-bold block">OPERATIONAL HEALTH</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                  selectedNode.id === '4' 
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedNode.id === '4' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  {selectedNode.id === '4' ? 'DEGRADED (Disk Wait Spike)' : 'HEALTHY OPERATIVE'}
                </span>
              </div>

              {/* Node Telemetry */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <span className="text-[9px] text-zinc-500 tracking-wider font-bold block">METRIC READOUTS</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-md">
                    <span className="text-[9px] text-zinc-500 block">CPU UTIL</span>
                    <span className="font-bold text-white font-mono">{selectedNode.id === '4' ? '68.2%' : '24.1%'}</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-md">
                    <span className="text-[9px] text-zinc-500 block">NET WORK I/O</span>
                    <span className="font-bold text-white font-mono">14.2 MB/s</span>
                  </div>
                </div>
              </div>

              {/* Node Info / Spec */}
              <div className="space-y-3 border-t border-zinc-800 pt-4 text-xs">
                <span className="text-[9px] text-zinc-500 tracking-wider font-bold block">CONFIGURATION PROPERTIES</span>
                <div className="space-y-2 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Provisioner</span>
                    <span className="text-zinc-200">terraform-aws-provider</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instance Class</span>
                    <span className="text-zinc-200">{selectedNode.id === '4' ? 'db.m6i.xlarge' : 'c6i.large'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 gap-2">
              <Info size={24} />
              <p className="text-xs">No node selected. Click a node in the topology canvas to inspect properties.</p>
            </div>
          )}
          
          <div className="border-t border-zinc-800 pt-4 mt-6">
            <button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white py-2 rounded-md text-xs font-semibold transition">
              Trigger Cluster Diagnosis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
