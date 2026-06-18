# ATHENA API Contracts, Database Schemas, and Event Streams

This document defines the schemas, API contracts, and message envelopes used for communications, data persistence, and routing within the ATHENA ecosystem.

---

## 1. Database Schemas

### 1.1 Neo4j Graph Database Schema (Infrastructure Knowledge Graph)

#### Node Schema & Constraints
```cypher
// Create constraints for unique identifiers
CREATE CONSTRAINT node_id_uniq IF NOT EXISTS FOR (n:Node) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT service_id_uniq IF NOT EXISTS FOR (s:Service) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT pod_id_uniq IF NOT EXISTS FOR (p:K8sPod) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT anomaly_id_uniq IF NOT EXISTS FOR (a:Anomaly) REQUIRE a.id IS UNIQUE;
```

#### Node Properties
- **Node**: `{id: STRING, hostname: STRING, provider: STRING, instance_type: STRING, region: STRING, ip_address: STRING, state: STRING}`
- **Service**: `{id: STRING, name: STRING, repo_url: STRING, language: STRING, owner_team: STRING}`
- **K8sPod**: `{id: STRING, name: STRING, namespace: STRING, phase: STRING, container_image: STRING}`
- **Anomaly**: `{id: STRING, metric_name: STRING, value: FLOAT, threshold: FLOAT, timestamp: INTEGER}`

#### Cypher Query Examples

##### Query 1: Trace Microservice Dependencies down to the Physical VM
```cypher
MATCH (s:Service {name: "checkout-service"})-[:DEPENDS_ON]->(dep:Service)
MATCH (dep)-[:DEPLOYS_TO]->(p:K8sPod)-[:RUNS_ON]->(n:Node)
RETURN s.name AS Service, dep.name AS Dependency, p.name AS PodName, n.hostname AS VMHost;
```

##### Query 2: Find Root-Cause Anomaly Propagation Paths
```cypher
MATCH (a:Anomaly)-[:TRIGGERED_BY]->(entity)
MATCH path = (entity)-[:DEPENDS_ON|RUNS_ON|CONTAINS*1..3]->(target:Service {name: "checkout-service"})
RETURN path, a.metric_name, a.value;
```

---

### 1.2 Relational Database Schema (PostgreSQL - Auditing & Operations)

This schema records operational session logs, agent execution decisions, and safety shield verifications.

```sql
-- Operational Session Tracking Table
CREATE TABLE IF NOT EXISTS remediation_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id VARCHAR(128) NOT NULL,
    target_arn VARCHAR(256) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL, -- 'PENDING_APPROVAL', 'EXECUTING', 'COMPLETED', 'FAILED', 'ROLLED_BACK'
    trigger_type VARCHAR(50) NOT NULL -- 'AUTONOMOUS', 'SEMI_AUTONOMOUS', 'MANUAL'
);

-- Agent Trace Logs Table
CREATE TABLE IF NOT EXISTS agent_decision_logs (
    log_id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES remediation_sessions(session_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    agent_name VARCHAR(100) NOT NULL, -- 'Supervisor', 'Planner', 'Executor', etc.
    thought TEXT NOT NULL,
    action_taken TEXT,
    observation TEXT,
    confidence_score NUMERIC(4,3) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0)
);

-- Safety Shield Auditing Table
CREATE TABLE IF NOT EXISTS safety_shield_audits (
    audit_id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES remediation_sessions(session_id) ON DELETE CASCADE,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    proposed_action TEXT NOT NULL,
    policy_name VARCHAR(128) NOT NULL,
    decision VARCHAR(20) NOT NULL, -- 'ALLOWED', 'DENIED'
    violation_details TEXT
);
```

---

### 1.3 Vector Database Schema (Qdrant)

The Knowledge RAG Service indexes data chunks inside Qdrant.

- **Collection Name**: `athena_operational_knowledge`
- **Vector Dimensions**: `3072` (corresponds to OpenAI `text-embedding-3-large`)
- **Distance Metric**: Cosine

#### Metadata Payload Schema
```json
{
  "doc_id": "doc_8f9c1234-5678-abcd-ef01-23456789abcd",
  "source_type": "jira_post_mortem", 
  "source_url": "https://jira.enterprise.com/browse/INC-9821",
  "title": "Post-Mortem: Redis Connection Pool Exhaustion in Payment-Service",
  "text": "Checkout service experiences timeout. The root cause was Postgres connection limits reached. Solved by increasing pool size to 150.",
  "metadata": {
    "tags": ["postgres", "payment-service", "timeouts", "connections"],
    "created_at": 1774849200,
    "severity": "P1"
  }
}
```

---

## 2. API Contracts

### 2.1 gRPC Protobuf Contracts

#### `digital_twin.proto`
```protobuf
syntax = "proto3";

package athena.digitaltwin;

option go_package = "athena/digitaltwin/v1;digitaltwinv1";

service DigitalTwinService {
  rpc GetNodeState (GetNodeStateRequest) returns (GetNodeStateResponse);
  rpc UpdateNodeState (UpdateNodeStateRequest) returns (UpdateNodeStateResponse);
  rpc StreamTopologyChanges (StreamTopologyRequest) returns (stream TopologyEvent);
}

message GetNodeStateRequest {
  string resource_id = 1;
}

message GetNodeStateResponse {
  string resource_id = 1;
  string resource_type = 2;
  string status = 3;
  map<string, string> properties = 4;
  int64 last_updated = 5;
}

message UpdateNodeStateRequest {
  string resource_id = 1;
  string status = 2;
  map<string, string> properties = 3;
}

message UpdateNodeStateResponse {
  bool success = 1;
  string message = 2;
}

message StreamTopologyRequest {
  string namespace = 1;
}

message TopologyEvent {
  string event_id = 1;
  string action = 2; // "CREATE", "UPDATE", "DELETE"
  string resource_id = 3;
  string parent_id = 4;
  int64 timestamp = 5;
}
```

#### `agent_reasoning.proto`
```protobuf
syntax = "proto3";

package athena.agent;

option go_package = "athena/agent/v1;agentv1";

service AgentReasoningService {
  rpc TriggerDiagnosticSwarm (TriggerDiagnosticRequest) returns (TriggerDiagnosticResponse);
  rpc FetchRemediationPlan (PlanRequest) returns (PlanResponse);
}

message TriggerDiagnosticRequest {
  string incident_id = 1;
  string root_resource_id = 2;
  string symptoms_description = 3;
  int64 detected_time = 4;
}

message TriggerDiagnosticResponse {
  string session_id = 1;
  string suggested_root_cause = 2;
  float confidence = 3;
  repeated string affected_resources = 4;
}

message PlanRequest {
  string session_id = 1;
}

message PlanResponse {
  string session_id = 1;
  repeated ActionStep steps = 2;
  bool requires_approval = 3;
}

message ActionStep {
  int32 step_number = 1;
  string tool_name = 2; -- "K8s_Scale", "Terraform_Apply", "Route53_Shift"
  string target_resource = 3;
  map<string, string> parameters = 4;
}
```

---

### 2.2 OpenAPI REST Contracts

#### `/api/v1/incidents` OpenAPI Spec Snippet
```yaml
openapi: 3.0.3
info:
  title: ATHENA Operations API
  version: 1.0.0
paths:
  /api/v1/incidents:
    get:
      summary: Retrieve active and historical incidents
      parameters:
        - name: status
          in: query
          required: false
          schema:
            type: string
            enum: [ACTIVE, SOLVED, INVESTIGATING]
      responses:
        '200':
          description: A list of incidents
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Incident'
  /api/v1/remediations/execute:
    post:
      summary: Execute remediation plan step
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - session_id
                - step_index
              properties:
                session_id:
                  type: string
                  format: uuid
                step_index:
                  type: integer
      responses:
        '202':
          description: Execution started
          content:
            application/json:
              schema:
                type: object
                properties:
                  task_id:
                    type: string
                  status:
                    type: string

components:
  schemas:
    Incident:
      type: object
      properties:
        incident_id:
          type: string
        title:
          type: string
        severity:
          type: string
          enum: [P0, P1, P2, P3]
        status:
          type: string
        created_at:
          type: string
          format: date-time
```

---

## 3. Kafka Ingestion Message Schemas

ATHENA uses Avro schemas to ensure schema safety and evolution across streaming pipelines.

### 3.1 Metric Event Envelope Schema (`telemetry-metrics-raw`)
```json
{
  "type": "record",
  "name": "MetricEnvelope",
  "namespace": "athena.telemetry",
  "fields": [
    { "name": "metric_name", "type": "string" },
    { "name": "timestamp", "type": "long" },
    { "name": "value", "type": "double" },
    { "name": "resource_id", "type": "string" },
    {
      "name": "dimensions",
      "type": { "type": "map", "values": "string" }
    }
  ]
}
```

### 3.2 Infrastructure Mutation Event Schema (`infrastructure-events-raw`)
```json
{
  "type": "record",
  "name": "MutationEvent",
  "namespace": "athena.infrastructure",
  "fields": [
    { "name": "event_id", "type": "string" },
    { "name": "timestamp", "type": "long" },
    { "name": "provider", "type": "string" }, // "AWS", "KUBERNETES", "OCI", "AZURE"
    { "name": "resource_type", "type": "string" }, // "AWS::EC2::Instance", "Pod"
    { "name": "resource_arn", "type": "string" },
    { "name": "mutation_type", "type": "string" }, // "CREATE", "DESTROY", "UPDATE"
    { "name": "payload_diff", "type": "string" }, // JSON string of change diff
    { "name": "triggered_by", "type": "string" } // "CI_CD_PIPELINE", "MANUAL", "AUTO_SCALE"
  ]
}
```
