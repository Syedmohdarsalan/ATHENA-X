# ATHENA-X System Architecture Specification
## The Core Engineering Specification

---

## 1. Client State Management (Zustand & React Query)

ATHENA-X separates state into two logical lanes:
1. **Dynamic Metric State (React Query / TanStack Query)**: Handles cache invalidation, fetching, and REST queries for historical incident data and analytics.
2. **Real-Time Topology & Agent Reasoning State (Zustand)**: Manages WebSocket telemetry updates, spatial transformations, camera focal targets in the 3D twin, active agent debate logs, and the temporal simulation dial.

### 1.1 Store Configuration Slices

```
               [Zustand Root Store]
                /        |         \
   [TwinStateSlice] [AgentStateSlice] [SimulationStateSlice]
```

#### Code Blueprint: `store.ts`
```typescript
import { create } from 'zustand';

interface TwinNode {
  id: string;
  type: string;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  position: [number, number, number];
}

interface AgentLog {
  agentName: string;
  thought: string;
  timestamp: number;
}

interface AthenaStore {
  // Twin State Slice
  nodes: Record<string, TwinNode>;
  selectedNodeId: string | null;
  setNodes: (nodes: Record<string, TwinNode>) => void;
  selectNode: (id: string) => void;
  updateNodeStatus: (id: string, status: TwinNode['status']) => void;

  // Agent State Slice
  activeIncidentId: string | null;
  agentLogs: AgentLog[];
  confidence: number;
  addAgentLog: (log: AgentLog) => void;
  setConfidence: (confidence: number) => void;

  // Simulation Temporal Slice
  currentTimeOffset: number; // in minutes: 0, 60, 360, 1440
  setTimeOffset: (offset: number) => void;
}

export const useAthenaStore = create<AthenaStore>((set) => ({
  nodes: {},
  selectedNodeId: null,
  setNodes: (nodes) => set({ nodes }),
  selectNode: (selectedNodeId) => set({ selectedNodeId }),
  updateNodeStatus: (id, status) => set((state) => {
    if (!state.nodes[id]) return {};
    const updatedNode = { ...state.nodes[id], status };
    return { nodes: { ...state.nodes, [id]: updatedNode } };
  }),

  activeIncidentId: null,
  agentLogs: [],
  confidence: 1.0,
  addAgentLog: (log) => set((state) => ({ agentLogs: [...state.agentLogs, log] })),
  setConfidence: (confidence) => set({ confidence }),

  currentTimeOffset: 0,
  setTimeOffset: (currentTimeOffset) => set({ currentTimeOffset }),
}));
```

---

## 2. API & WebSocket Architecture

ATHENA-X features a hybrid REST/gRPC-Web and WebSocket communication model. While configuration uses REST APIs, the 3D Digital Twin and Agent Chamber stream telemetry via binary WebSockets (MsgPack encoded for payload size reduction).

```
   [Browser Client]
       |
       +--- HTTP POST ---> [/api/v1/simulations] ---> [API Gateway]
       |
       +--- WebSocket mTLS ---> [ws://stream.athena.io] ---> [WS Connection Broker]
```

### 2.1 WebSocket Frame Contract (JSON representation)
All frames include a standardized wrapping metadata envelope.

#### Server-to-Client Telemetry Stream
```json
{
  "type": "METRIC_UPDATE",
  "timestamp": 1774849200000,
  "payload": {
    "node_id": "pod-checkout-f291",
    "metrics": {
      "cpu_pct": 84.2,
      "memory_bytes": 1073741824,
      "req_per_sec": 482.1,
      "err_per_sec": 0.02
    }
  }
}
```

#### Server-to-Client Agent Thought Stream
```json
{
  "type": "AGENT_THOUGHT",
  "timestamp": 1774849205000,
  "payload": {
    "session_id": "session-8812",
    "agent_name": "ExplorerAgent",
    "thought_vector": [0.12, -0.05, 0.88],
    "message": "Tracing network paths: Found elevated TCP retransmits on subnet-02c9."
  }
}
```

---

## 3. Event Streaming & Kafka Architecture

To support 100K+ concurrent node telemetry updates, Kafka operates with partitioned topics aligned to physical locations (clouds/regions).

```
    [us-east-1 Collectors] ---> [Topic: telemetry-metrics-us-east] (Partitions 0-15)
                                          |
                                          v
                              [Flink Metric Consumer]
```

### 3.1 Topic Definitions & Offsets
- `telemetry-metrics-raw`: 64 partitions. Retained for 24 hours. Log compaction disabled. Pushed directly from OpenTelemetry gateway.
- `infrastructure-events`: 8 partitions. Retained for 30 days. Contains JSON-diff payloads of configuration updates.
- `agent-reasoning-debates`: 16 partitions. Retained for 7 days. Audits raw agent logs for MLOps alignment analysis.

---

## 4. Digital Twin Rendering Architecture (Three.js / React Three Fiber)

Rendering thousands of live nodes in a browser requires minimizing GPU draw calls. Standard React components mapping to discrete Mesh entities fail at scale.

```
                    [Three.js InstancedMesh]
                  /            |             \
      [Matrix_0]          [Matrix_1]          [Matrix_n]
    (Host VM cycyan)    (Database amber)     (Pod red)
```

### 4.1 InstancedMesh Performance Strategy
1. **Node Consolidation**: A single `InstancedMesh` handles all spherical nodes, and another handles all cylinder connections (edges).
2. **State Translation**: An index map translates `node_id` to its index in the `InstancedMesh`. When a telemetry event changes a node status to `DEGRADED`, the system updates the color array buffer at that index and marks `instanceColor.needsUpdate = true`.
3. **Animated Request Streams**: Network packets are drawn using a custom ShaderMaterial with a vertex shader that slides particles along Catmull-Rom spline path vectors:

#### Custom Fragment Shader for Dynamic Connection Lines
```glsl
uniform float time;
varying vec2 vUv;

void main() {
  // Generate scrolling dashed particle line representation of traffic
  float lineSpeed = time * 2.0;
  float dashPattern = step(0.5, fract(vUv.x * 20.0 - lineSpeed));
  
  // Base cyan color fading to dark at edge boundaries
  vec3 cyan = vec3(0.0, 0.9, 1.0);
  vec3 finalColor = cyan * dashPattern * (1.0 - abs(vUv.y - 0.5) * 2.0);
  
  gl_FragColor = vec4(finalColor, 0.8);
}
```

---

## 5. Knowledge Graph & Multi-Agent Visualization Architecture

### 5.1 Knowledge Graph Representation
The system maps topology connections dynamically. In React, these Neo4j nodes are mapped to Cytoscape.js layouts for flat relationships, or custom WebGL force-directed graphs in 3D.

### 5.2 Agent Reasoning Visual Architecture
To show machine reasoning in the **Agent Chamber**, we use **React Flow**.
- Each agent node represents a specialized LLM agent.
- An edge represents information routing (e.g., Explorer sending logs to Planner).
- Animated dashed lines represent data flow paths. The speed of the dash indicates active LLM API execution.
- Glowing border envelopes show the current active node in the Monte Carlo Tree Search loop, highlighting step-by-step decision points.
