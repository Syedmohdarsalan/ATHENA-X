# ATHENA: Autonomous Hybrid Technical Engineering Neural Assistant

ATHENA is an autonomous cloud reliability and infrastructure intelligence platform that builds a spatial-temporal digital twin, runs multi-agent reasoning loops, and implements reinforcement learning self-healing remediation.

## Repository Structure

```
.
├── docs/                                # Architectural Specifications & Design Specs
│   ├── ATHENA_SPECIFICATION.md          # Core architecture, products, and vision
│   ├── API_CONTRACTS_AND_SCHEMAS.md     # DB Schemas, gRPC Protobufs, and Kafka events
│   └── UML_DIAGRAMS.md                  # Component layouts, sequence flows, data paths
├── services/                            # Multi-Service Monorepo
│   ├── athena-ingestion-gateway/        # OTLP High-Performance Ingestion Gateway (Rust)
│   ├── athena-digital-twin/             # Real-Time In-Memory State Sync (Go)
│   ├── athena-graph-sync/               # Neo4j Knowledge Graph Sync Service (Python)
│   ├── athena-agent-reasoning/          # LangGraph Multi-Agent Solving Swarm (Python)
│   └── athena-remediation-operator/     # Cloud APIs, Terraform & K8s execution operator (Go)
└── infrastructure/                      # Kubernetes and IaC configuration
    ├── terraform/                       # Terraform modules for central/edge resources
    └── kubernetes/                      # Helm Charts for multi-cluster deployments
```

## Documentation Quick Links
- [Master Specification](file:///c:/Users/Admin/Desktop/cloud%20project/docs/ATHENA_SPECIFICATION.md)
- [API Contracts & Schemas](file:///c:/Users/Admin/Desktop/cloud%20project/docs/API_CONTRACTS_AND_SCHEMAS.md)
- [Architecture & Sequence Diagrams](file:///c:/Users/Admin/Desktop/cloud%20project/docs/UML_DIAGRAMS.md)

## Component Prerequisites & Quick Start

### 1. Ingestion Gateway (Rust)
```bash
cd services/athena-ingestion-gateway
cargo build --release
cargo run
```

### 2. Digital Twin Engine (Go)
```bash
cd services/athena-digital-twin
go build -o bin/digital-twin cmd/main.go
./bin/digital-twin
```

### 3. Agent Reasoning Engine (Python)
```bash
cd services/athena-agent-reasoning
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/main.py
```
