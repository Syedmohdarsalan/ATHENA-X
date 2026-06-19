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
  GitBranch, 
  Search, 
  Database, 
  User2, 
  Network, 
  LayoutList 
} from 'lucide-react';

const graphNodes: Node[] = [
  { 
    id: '1', 
    data: { label: 'checkout-service (K8s Pod)' }, 
    position: { x: 250, y: 0 },
    style: { background: '#09090b', border: '1px solid #eab308', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '2', 
    data: { label: 'billing-service (K8s Pod)' }, 
    position: { x: 100, y: 120 },
    style: { background: '#09090b', border: '1px solid #10b981', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '3', 
    data: { label: 'database-master-01 (RDS Postgres)' }, 
    position: { x: 400, y: 120 },
    style: { background: '#1c1917', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '4', 
    data: { label: 'AWS VPC us-east-1' }, 
    position: { x: 250, y: 240 },
    style: { background: '#09090b', border: '1px solid #71717a', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '5', 
    data: { label: 'Transactions Dev Team' }, 
    position: { x: 450, y: 0 },
    style: { background: '#09090b', border: '1px solid #a855f7', color: '#e9d5ff', borderRadius: '6px', fontSize: '11px' } 
  }
];

const graphEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'depends_on', style: { stroke: '#eab308' }, labelStyle: { fill: '#a1a1aa', fontSize: '8px', fontFamily: 'mono' } },
  { id: 'e2-3', source: '2', target: '3', label: 'triggers', style: { stroke: '#10b981' }, labelStyle: { fill: '#a1a1aa', fontSize: '8px', fontFamily: 'mono' } },
  { id: 'e3-4', source: '3', target: '4', label: 'hosts', style: { stroke: '#71717a' }, labelStyle: { fill: '#a1a1aa', fontSize: '8px', fontFamily: 'mono' } },
  { id: 'e1-5', source: '1', target: '5', label: 'owned_by', style: { stroke: '#a855f7' }, labelStyle: { fill: '#a1a1aa', fontSize: '8px', fontFamily: 'mono' } }
];

export default function KnowledgeGraphPage() {
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-sans">
      
      {/* Top Filter Bar */}
      <div className="h-auto md:h-14 border-b border-zinc-800 bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between px-6 py-4 md:py-0 select-none shrink-0 font-mono text-xs gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 gap-y-2">
          <div className="flex items-center gap-2 text-white">
            <GitBranch size={14} className="text-yellow-500" />
            <span className="font-bold">Neo4j Dependency Graph</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md text-xs">
            <Search size={12} />
            <input 
              type="text" 
              placeholder="Filter nodes by relation..." 
              className="bg-transparent border-none outline-none text-zinc-300 placeholder-zinc-600 w-44" 
            />
          </div>
        </div>

        <div>
          <span className="text-zinc-400">ACTIVE RELATIONS SYNCED:</span>
          <span className="text-yellow-500 font-bold ml-1">42 Edges</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* React Flow Workspace Canvas */}
        <div className="flex-1 h-[350px] md:h-full bg-[#050507] relative border-b md:border-b-0 md:border-r border-zinc-800 min-h-[300px]">
          <ReactFlow 
            nodes={graphNodes} 
            edges={graphEdges}
            fitView
          >
            <Background color="#27272a" gap={20} size={1} />
            <Controls />
          </ReactFlow>
        </div>

        {/* Selected Component Properties Sheet */}
        <div className="w-full md:w-80 bg-zinc-950 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-[10px] text-zinc-500 tracking-widest font-bold uppercase block mb-1">Graph Metadata</span>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <LayoutList size={15} className="text-yellow-500" />
                Topological Relations
              </h3>
            </div>

            {/* Relation definitions info sheet */}
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="text-[9px] text-zinc-500 tracking-wider font-bold block uppercase">Edge Relation Keys</span>
                <div className="space-y-2 text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <div>
                      <span className="font-bold text-zinc-200 block">depends_on</span>
                      <span className="text-[10px] text-zinc-500">Service network dependency calls</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <div>
                      <span className="font-bold text-zinc-200 block">triggers</span>
                      <span className="text-[10px] text-zinc-500">Event mutations or alerts triggers</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    <div>
                      <span className="font-bold text-zinc-200 block">owned_by</span>
                      <span className="text-[10px] text-zinc-500">Organization or development team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-6">
            <button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white py-2 rounded-md text-xs font-semibold transition">
              Refresh Graph Database
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
