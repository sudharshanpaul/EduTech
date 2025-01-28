from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Tuple, Dict
import os
from graphviz import Digraph
from langchain_groq import ChatGroq
from collections import OrderedDict
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Flowchart Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq with API key
GROQ_API_KEY = "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"
llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="Gemma2-9b-It")

# Pydantic models for request and response
class TopicRequest(BaseModel):
    topic: str

class FlowchartResponse(BaseModel):
    nodes: List[str]
    edges: List[Tuple[str, str]]
    explanation: str
    dot_source: str
    raw_content: str

def generate_flowchart_content(topic: str) -> str:
    """
    Uses ChatGroq to generate flowchart content for the given topic.
    """
    prompt = f"""
    Create a detailed vertical flowchart for the topic "{topic}". Use EXACTLY this format:

    1. List steps as arrows between nodes using format: "Node A -> Node B"
    2. After all nodes, write explanation starting with "Explanation:"
    
    Example:
    Data Collection -> Data Preprocessing
    Data Preprocessing -> Model Selection
    Model Selection -> Training and Validation
    Explanation: This flowchart shows the machine learning workflow...

    Your response must contain ONLY nodes and explanation in this format. No extra text.
    """
    
    try:
        response = llm.predict(prompt)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating flowchart: {str(e)}")

def parse_flowchart_content(content: str) -> Tuple[List[str], List[Tuple[str, str]], str]:
    """
    Parses the flowchart content into nodes and edges for Graphviz, and extracts explanation.
    """
    nodes = OrderedDict()
    edges = []
    explanation = []
    
    # Split content into lines and clean
    lines = [line.strip() for line in content.split("\n") if line.strip()]
    
    # Process each line
    explanation_found = False
    for line in lines:
        if re.match(r'^explanation:?', line, re.IGNORECASE):
            explanation_found = True
            explanation_text = re.split(r'explanation:?', line, flags=re.IGNORECASE)[-1].strip()
            if explanation_text:
                explanation.append(explanation_text)
        elif explanation_found:
            explanation.append(line)
        elif '->' in line:
            parts = [p.strip() for p in line.split('->')]
            if len(parts) == 2:
                source, target = parts
                if source not in nodes:
                    nodes[source] = True
                if target not in nodes:
                    nodes[target] = True
                edges.append((source, target))

    return list(nodes.keys()), edges, ' '.join(explanation).strip()

def create_dot_graph(nodes: List[str], edges: List[Tuple[str, str]]) -> str:
    """
    Creates a Graphviz DOT source string for the flowchart.
    """
    dot = Digraph()
    dot.attr(rankdir='TB', nodesep='0.5', ranksep='0.5')
    
    # Add nodes
    for node in nodes:
        dot.node(node, shape="box", style="rounded,filled", fillcolor="#e0f0ff")
    
    # Add edges
    for edge in edges:
        dot.edge(edge[0], edge[1])
    
    # Force linear layout
    with dot.subgraph() as s:
        s.attr(rank='same')
        for i in range(len(nodes)-1):
            s.edge(nodes[i], nodes[i+1], style="invis")
            
    return dot.source

@app.get("/")
async def root():
    return {"message": "Flowchart Generator API", "version": "1.0"}

@app.post("/generate-flowchart/", response_model=FlowchartResponse)
async def generate_flowchart(request: TopicRequest):
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    try:
        # Generate content
        content = generate_flowchart_content(request.topic.strip())
        
        # Parse content
        nodes, edges, explanation = parse_flowchart_content(content)
        
        if not nodes:
            raise HTTPException(status_code=422, detail="No nodes detected in the response")
        
        # Create DOT source
        dot_source = create_dot_graph(nodes, edges)
        
        # Return response
        return FlowchartResponse(
            nodes=nodes,
            edges=edges,
            explanation=explanation,
            dot_source=dot_source,
            raw_content=content
        )
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))