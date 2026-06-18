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
    style: { background: '#0f172a', border: '1px solid #06b6d4', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' } 
  },
  { 
    id: '2', 
    data: { label: 'Checkout Service (K8s Pod)' }, 
    position: { x: 100, y: 120 },
    style: { background: '#0f172a', border: '1px solid #1e293b', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '3', 
    data: { label: 'Payment Service (K8s Pod)' }, 
    position: { x: 400, y: 120 },
    style: { background: '#0f172a', border: '1px solid #1e293b', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '4', 
    type: 'output',
    data: { label: 'Postgres DB (AWS RDS)' }, 
    position: { x: 100, y: 240 },
    style: { background: '#1c1917', border: '1px solid #f43f5e', color: '#fda4af', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' } 
  },
  { 
    id: '5', 
    type: 'output',
    data: { label: 'Redis Cache (ElastiCache)' }, 
    position: { x: 400, y: 240 },
    style: { background: '#0f172a', border: '1px solid #10b981', color: '#a7f3d0', borderRadius: '6px', fontSize: '11px' } 
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#06b6d4' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#06b6d4' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#f43f5e', strokeWidth: 2 } },
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
      <div className="h-14 border-b border-[#1b2535] bg-[#0b0f19] flex items-center justify-between px-6 select-none shrink-0">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 text-white">
            <Cloud size={14} className="text-[#06b6d4]" />
            <span className="font-bold">Live Topology</span>
          </div>
          <span className="text-[#4b5563]">|</span>
          <div className="flex items-center gap-3">
            <span className="text-[#9b9da3]">Cluster View:</span>
            <span className="font-mono text-gray-200">prod-aws-eks-01</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[#9b9da3] flex items-center gap-1.5">
            <Sliders size={13} />
            Time Travel Dial:
          </span>
          <input 
            type="range" 
            min="0" 
            max="240" 
            value={timeOffset} 
            onChange={(e) => setTimeOffset(Number(e.target.value))}
            className="w-36 h-1 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
          />
          <span className="text-[#06b6d4] font-bold">
            {timeOffset === 0 ? 'LIVE STATUS' : `+${Math.floor(timeOffset / 60)}h ${timeOffset % 60}m`}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* React Flow Container */}
        <div className="flex-1 h-full bg-[#030712] relative border-r border-[#1b2535]">
          <div className="absolute top-4 left-4 z-10 bg-[#070b15]/80 border border-[#1b2535] p-3 rounded-md max-w-xs text-[11px] leading-relaxed shadow-lg">
            <div className="font-bold text-white mb-1 flex items-center gap-1">
              <Network size={12} className="text-[#06b6d4]" />
              Topology Guide
            </div>
            <p className="text-[#9b9da3]">Click on nodes to inspect real-time metrics, configurations, and upstream/downstream dependency links.</p>
          </div>

          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="react-flow-controls-custom" />
            <MiniMap 
              nodeColor={(n) => n.id === '4' ? '#f43f5e' : '#1e293b'} 
              maskColor="rgba(3, 7, 18, 0.6)"
              style={{ background: '#0b0f19', border: '1px solid #1b2535' }}
            />
          </ReactFlow>
        </div>

        {/* Selected Component Inspections Panel */}
        <div className="w-80 bg-[#070b15] p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-6">
              <div className="border-b border-[#1b2535] pb-4">
                <span className="text-[10px] text-[#9b9da3] tracking-widest font-bold uppercase block mb-1">SELECTED ENTITY</span>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  {selectedNode.id === '4' ? <Database size={15} className="text-[#f43f5e]" /> : <Server size={15} className="text-[#06b6d4]" />}
                  {selectedNode.data.label}
                </h3>
              </div>

              {/* Status Section */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-[#9b9da3] tracking-wider font-bold block">OPERATIONAL HEALTH</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                  selectedNode.id === '4' 
                    ? 'bg-[#f43f5e]/10 text-[#fda4af] border-[#f43f5e]/30' 
                    : 'bg-[#10b981]/10 text-[#a7f3d0] border-[#10b981]/30'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedNode.id === '4' ? 'bg-[#f43f5e] animate-pulse' : 'bg-[#10b981]'}`}></span>
                  {selectedNode.id === '4' ? 'DEGRADED (Disk Wait Spike)' : 'HEALTHY OPERATIVE'}
                </span>
              </div>

              {/* Node Telemetry */}
              <div className="space-y-2 border-t border-[#1b2535] pt-4">
                <span className="text-[9px] text-[#9b9da3] tracking-wider font-bold block">METRIC READOUTS</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#111827] border border-[#1b2535] p-2.5 rounded-md">
                    <span className="text-[9px] text-gray-500 block">CPU UTIL</span>
                    <span className="font-bold text-white font-mono">{selectedNode.id === '4' ? '68.2%' : '24.1%'}</span>
                  </div>
                  <div className="bg-[#111827] border border-[#1b2535] p-2.5 rounded-md">
                    <span className="text-[9px] text-gray-500 block">NET WORK I/O</span>
                    <span className="font-bold text-white font-mono">14.2 MB/s</span>
                  </div>
                </div>
              </div>

              {/* Node Info / Spec */}
              <div className="space-y-3 border-t border-[#1b2535] pt-4 text-xs">
                <span className="text-[9px] text-[#9b9da3] tracking-wider font-bold block">CONFIGURATION PROPERTIES</span>
                <div className="space-y-2 text-[#9b9da3]">
                  <div className="flex justify-between">
                    <span>Provisioner</span>
                    <span className="text-gray-200">terraform-aws-provider</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instance Class</span>
                    <span className="text-gray-200">{selectedNode.id === '4' ? 'db.m6i.xlarge' : 'c6i.large'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[#9b9da3] gap-2">
              <Info size={24} />
              <p className="text-xs">No node selected. Click a node in the topology canvas to inspect properties.</p>
            </div>
          )}
          
          <div className="border-t border-[#1b2535] pt-4 mt-6">
            <button className="w-full bg-[#111827] border border-[#1e293b] hover:bg-[#1f2937] text-white py-2 rounded-md text-xs font-semibold transition">
              Trigger Cluster Diagnosis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
