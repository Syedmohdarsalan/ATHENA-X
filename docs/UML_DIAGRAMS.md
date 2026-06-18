# ATHENA System Architecture & UML Diagrams

This document contains Mermaid diagrams visualizing the architecture, component relationships, sequence flows, and event-driven data streaming pipelines within the ATHENA platform.

---

## 1. System Component Architecture Diagram

The component diagram illustrates the relationships between ingestion, caching, persistence, reasoning, and cloud API orchestration.

```mermaid
graph TB
    subgraph Clients["Target Environments"]
        AWS["AWS EKS / EC2"]
        AZURE["Azure AKS / VM"]
        K8S["K8s Cluster Node"]
    end

    subgraph Ingestion["Ingestion & Streaming (Rust / Java)"]
        GW["Telemetry Ingestion Gateway"]
        Kafka["Apache Kafka Event Bus"]
        Flink["Apache Flink Stream Processor"]
    end

    subgraph Storage["Storage & Twin Layer"]
        TwinCache["Digital Twin Cache (Hazelcast)"]
        Timescale["Metrics/Logs (TimescaleDB)"]
        Neo4j["Knowledge Graph (Neo4j)"]
        Qdrant["Vector DB (Qdrant)"]
        Iceberg["Data Lake (Apache Iceberg)"]
    end

    subgraph Reasoning["LLM Reasoning & Policy Swarm (Python / Go)"]
        AgentCore["Agent Reasoning Engine"]
        RLService["RL Remediation Service"]
        OPAShield["OPA Safety Guardrail"]
        OP["Remediation Operator Service"]
    end

    %% Wiring Clients to Ingestion
    AWS -- OTLP/gRPC --> GW
    AZURE -- OTLP/gRPC --> GW
    K8S -- OTLP/gRPC --> GW

    %% Ingestion Routing
    GW --> Kafka
    Kafka --> Flink

    %% Flink routing to Storage
    Flink --> TwinCache
    Flink --> Timescale
    Flink --> Neo4j
    Flink --> Iceberg

    %% Reasoning Engine interactions
    AgentCore <--> Neo4j
    AgentCore <--> Qdrant
    AgentCore --> OPAShield
    AgentCore --> OP
    
    RLService --> OPAShield
    RLService --> OP
    OPAShield -- Validates Actions --> OP

    %% Operator modifying Target Env
    OP -- Executes Changes --> AWS
    OP -- Executes Changes --> AZURE
    OP -- Executes Changes --> K8S
```

---

## 2. Sequence Diagram: Incident Detection, Graph RCA, and Self-Healing

This sequence diagram illustrates the lifecycle of a latency incident from detection to autonomous recovery.

```mermaid
sequenceDiagram
    autonumber
    participant TargetEnv as Target Cloud/K8s
    participant Ingest as Ingestion & Flink
    participant Twin as Digital Twin Engine
    participant Supervisor as Agent Supervisor
    participant Explorer as Graph Explorer (Neo4j)
    participant RAG as Knowledge RAG (Qdrant)
    participant OPA as OPA Safety Shield
    participant Exec as Remediation Operator

    TargetEnv->>Ingest: Send metrics latency spike
    Ingest->>Twin: Update state cache
    Ingest->>Supervisor: Trigger Latency Alert (Incident ID: INC-001)
    
    Note over Supervisor: Swarm initialized
    Supervisor->>Explorer: Fetch dependencies for Target Resource
    Explorer-->>Supervisor: Returns: Resource depends on Postgres-DB
    
    Supervisor->>Twin: Query live state of Postgres-DB
    Twin-->>Supervisor: Returns: Disk IOPS saturated (99%)
    
    Supervisor->>RAG: Vector Search: "Postgres Disk IOPS limit reached runbook"
    RAG-->>Supervisor: Returns: Postgres replica scaling playbook
    
    Note over Supervisor: Planner drafts remediation plan: Scale DB IOPS
    
    Supervisor->>OPA: Validate remediation action (Scale IOPS)
    OPA-->>Supervisor: Returns: Action ALLOWED (Inside quota & compliance limits)
    
    Supervisor->>Exec: Dispatch action: Scale Volume IOPS
    Exec->>TargetEnv: AWS API Call: ModifyVolume (IOPS: 3000 -> 6000)
    
    Note over Exec: Wait for volume status: "modifying" -> "optimized"
    TargetEnv-->>Exec: Modification complete
    
    loop Verification (2 minutes)
        Supervisor->>Twin: Poll latency & CPU metrics
        Twin-->>Supervisor: Returns: Latency metrics within target threshold
    end

    Supervisor->>Ingest: Close incident INC-001
```

---

## 3. Event-Driven Data Flow Diagram

This data flow diagram details how raw telemetry from target systems is routed, aggregated, and written to analytical, graph, vector, and real-time stores.

```mermaid
graph LR
    Telemetry["Raw Metrics, Logs, Traces"] --> GW["Ingestion Gateway"]
    GW --> TopicMetrics["Kafka Topic: telemetry-metrics"]
    GW --> TopicLogs["Kafka Topic: telemetry-logs"]
    GW --> TopicTraces["Kafka Topic: telemetry-traces"]

    subgraph StreamingPipeline["Stream Processing Pipeline"]
        FlinkMetrics["Flink Metrics Aggregator"]
        FlinkLogParser["Flink Log Parser & Embedder"]
        FlinkTraces["Flink Trace Span Connector"]
    end

    TopicMetrics --> FlinkMetrics
    TopicLogs --> FlinkLogParser
    TopicTraces --> FlinkTraces

    FlinkMetrics -- 10s Window Avg --> TwinCache["Digital Twin Cache (Hazelcast)"]
    FlinkMetrics -- Metric Aggregates --> Clickhouse["TimescaleDB/Clickhouse"]
    
    FlinkLogParser -- Anomaly Detections --> AlertTopic["Kafka Topic: alerts-raw"]
    FlinkLogParser -- Raw Logs Archive --> Iceberg["Apache Iceberg Lakehouse"]
    
    FlinkTraces -- Dynamic Topology Updates --> GraphSync["Graph Sync Daemon"]
    GraphSync --> Neo4j["Neo4j Knowledge Graph"]
```
