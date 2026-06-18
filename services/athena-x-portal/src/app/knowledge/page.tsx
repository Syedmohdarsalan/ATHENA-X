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
    style: { background: '#0f172a', border: '1px solid #06b6d4', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '2', 
    data: { label: 'billing-service (K8s Pod)' }, 
    position: { x: 100, y: 120 },
    style: { background: '#0f172a', border: '1px solid #10b981', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '3', 
    data: { label: 'database-master-01 (RDS Postgres)' }, 
    position: { x: 400, y: 120 },
    style: { background: '#1c1917', border: '1px solid #f43f5e', color: '#fda4af', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '4', 
    data: { label: 'AWS VPC us-east-1' }, 
    position: { x: 250, y: 240 },
    style: { background: '#0f172a', border: '1px solid #94a3b8', color: '#fff', borderRadius: '6px', fontSize: '11px' } 
  },
  { 
    id: '5', 
    data: { label: 'Transactions Dev Team' }, 
    position: { x: 450, y: 0 },
    style: { background: '#0f172a', border: '1px solid #a855f7', color: '#e9d5ff', borderRadius: '6px', fontSize: '11px' } 
  }
];

const graphEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'depends_on', style: { stroke: '#06b6d4' }, labelStyle: { fill: '#9b9da3', fontSize: '8px', fontFamily: 'mono' } },
  { id: 'e2-3', source: '2', target: '3', label: 'triggers', style: { stroke: '#10b981' }, labelStyle: { fill: '#9b9da3', fontSize: '8px', fontFamily: 'mono' } },
  { id: 'e3-4', source: '3', target: '4', label: 'hosts', style: { stroke: '#94a3b8' }, labelStyle: { fill: '#9b9da3', fontSize: '8px', fontFamily: 'mono' } },
  { id: 'e1-5', source: '1', target: '5', label: 'owned_by', style: { stroke: '#a855f7' }, labelStyle: { fill: '#9b9da3', fontSize: '8px', fontFamily: 'mono' } }
];

export default function KnowledgeGraphPage() {
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-sans">
      
      {/* Top Filter Bar */}
      <div className="h-14 border-b border-[#1b2535] bg-[#0b0f19] flex items-center justify-between px-6 select-none shrink-0 font-mono text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <GitBranch size={14} className="text-[#06b6d4]" />
            <span className="font-bold">Neo4j Dependency Graph</span>
          </div>
          <span className="text-[#4b5563]">|</span>
          <div className="flex items-center gap-2 bg-[#111827] border border-[#1e293b] px-3 py-1 rounded-md text-xs">
            <Search size={12} />
            <input 
              type="text" 
              placeholder="Filter nodes by relation type..." 
              className="bg-transparent border-none outline-none text-[#9b9da3] placeholder-gray-600 w-44" 
            />
          </div>
        </div>

        <div>
          <span className="text-[#9b9da3]">ACTIVE RELATIONS SYNCED:</span>
          <span className="text-[#06b6d4] font-bold ml-1">42 Edges</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* React Flow Workspace Canvas */}
        <div className="flex-1 h-full bg-[#030712] relative border-r border-[#1b2535]">
          <ReactFlow 
            nodes={graphNodes} 
            edges={graphEdges}
            fitView
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls />
          </ReactFlow>
        </div>

        {/* Selected Component Properties Sheet */}
        <div className="w-80 bg-[#070b15] p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div className="border-b border-[#1b2535] pb-4">
              <span className="text-[10px] text-[#9b9da3] tracking-widest font-bold uppercase block mb-1">Graph Metadata</span>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <LayoutList size={15} className="text-[#06b6d4]" />
                Topological Relations
              </h3>
            </div>

            {/* Relation definitions info sheet */}
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="text-[9px] text-[#9b9da3] tracking-wider font-bold block uppercase">Edge Relation Keys</span>
                <div className="space-y-2 text-[#9b9da3]">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#06b6d4]"></span>
                    <div>
                      <span className="font-bold text-gray-200 block">depends_on</span>
                      <span className="text-[10px] text-gray-500">Service network dependency calls</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
                    <div>
                      <span className="font-bold text-gray-200 block">triggers</span>
                      <span className="text-[10px] text-gray-500">Event mutations or alerts triggers</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#a855f7]"></span>
                    <div>
                      <span className="font-bold text-gray-200 block">owned_by</span>
                      <span className="text-[10px] text-gray-500">Organization or development team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1b2535] pt-4 mt-6">
            <button className="w-full bg-[#111827] border border-[#1e293b] hover:bg-[#1f2937] text-white py-2 rounded-md text-xs font-semibold transition">
              Refresh Graph Database
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
