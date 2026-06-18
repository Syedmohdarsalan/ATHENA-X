import logging
from typing import Dict, List, TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, END

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("athena.agent_reasoning")

# Define the state shape that flows between agents
class AgentState(TypedDict):
    incident_id: str
    symptoms: str
    topology_path: List[str]
    root_cause: str
    remediation_plan: List[str]
    safety_approval: bool
    execution_result: str
    verification_metrics: Dict[str, float]
    next_agent: str

# Node 1: Supervisor Agent
def supervisor_node(state: AgentState) -> Dict:
    logger.info(f"[{state['incident_id']}] Supervisor: Initializing analysis swarm.")
    return {
        "next_agent": "explorer",
        "symptoms": state["symptoms"]
    }

# Node 2: Graph Explorer Agent
def explorer_node(state: AgentState) -> Dict:
    logger.info(f"[{state['incident_id']}] Graph Explorer: Traversing Knowledge Graph topology.")
    # In reality, queries Neo4j
    mock_path = ["Service:Checkout", "Pod:Checkout-Pod-81f2", "Service:PostgresDB"]
    logger.info(f"Isolated topology path: {mock_path}")
    return {
        "topology_path": mock_path,
        "next_agent": "planner"
    }

# Node 3: Planning Agent
def planner_node(state: AgentState) -> Dict:
    logger.info(f"[{state['incident_id']}] Planner: Fetching runbooks via Qdrant RAG and drafting plan.")
    plan = ["Scale AWS Postgres Storage IOPS to 6000", "Monitor CPU Wait times for 60s"]
    return {
        "remediation_plan": plan,
        "root_cause": "Postgres storage IOPS saturation",
        "next_agent": "executor"
    }

# Node 4: Remediation Executor Agent
def executor_node(state: AgentState) -> Dict:
    plan = state.get("remediation_plan", [])
    logger.info(f"[{state['incident_id']}] Executor: Running OPA verification and executing actions: {plan}")
    # In production, invokes gRPC client for athena-remediation-operator
    return {
        "execution_result": "Success: Volume modified.",
        "next_agent": "verifier"
    }

# Node 5: Verifier Agent
def verifier_node(state: AgentState) -> Dict:
    logger.info(f"[{state['incident_id']}] Verifier: Running post-action validation.")
    metrics = {"p99_latency_ms": 112.5, "db_io_wait_pct": 12.0}
    logger.info(f"Validation metrics retrieved from twin: {metrics}")
    return {
        "verification_metrics": metrics,
        "next_agent": "end"
    }

# Routing logic
def router(state: AgentState) -> str:
    return state.get("next_agent", "end")

def build_workflow():
    workflow = StateGraph(AgentState)
    
    # Register Nodes
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("explorer", explorer_node)
    workflow.add_node("planner", planner_node)
    workflow.add_node("executor", executor_node)
    workflow.add_node("verifier", verifier_node)

    # Establish Flow
    workflow.set_entry_point("supervisor")
    
    workflow.add_conditional_edges(
        "supervisor",
        router,
        {"explorer": "explorer", "end": END}
    )
    workflow.add_conditional_edges(
        "explorer",
        router,
        {"planner": "planner", "end": END}
    )
    workflow.add_conditional_edges(
        "planner",
        router,
        {"executor": "executor", "end": END}
    )
    workflow.add_conditional_edges(
        "executor",
        router,
        {"verifier": "verifier", "end": END}
    )
    workflow.add_conditional_edges(
        "verifier",
        router,
        {"end": END}
    )

    return workflow.compile()

def main():
    logger.info("Initializing Agent Reasoning Engine Workflow Graph...")
    app = build_workflow()
    
    initial_state = {
        "incident_id": "INC-8821",
        "symptoms": "HTTP 504 Gateway Timeouts in checkout-service",
        "topology_path": [],
        "root_cause": "",
        "remediation_plan": [],
        "safety_approval": False,
        "execution_result": "",
        "verification_metrics": {},
        "next_agent": "supervisor"
    }
    
    # Run the compiled StateGraph
    logger.info("Processing test incident session via LangGraph runner...")

    state = app.invoke(initial_state)

    print("\n")
    print("=" * 70)
    print("ATHENA INCIDENT ANALYSIS REPORT")
    print("=" * 70)

    print(f"Incident ID      : {state['incident_id']}")
    print(f"Symptoms         : {state['symptoms']}")
    print(f"Root Cause       : {state['root_cause']}")

    print("\nRemediation Plan:")
    for i, step in enumerate(state["remediation_plan"], start=1):
        print(f"{i}. {step}")

    print("\nExecution Result:")
    print(state["execution_result"])

    print("\nVerification Metrics:")
    for metric, value in state["verification_metrics"].items():
        print(f"{metric}: {value}")

    print("\nTopology Path:")
    for node in state["topology_path"]:
        print(f" -> {node}")

    print("=" * 70)

if __name__ == "__main__":
    main()
