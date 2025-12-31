from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "https://vectorshift-assignment-xi.vercel.app")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

render_url = os.getenv("RENDER_EXTERNAL_URL")
if render_url:
    allowed_origins.append(render_url)

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {
        'service': 'Vector Shift Pipeline API',
        'status': 'running',
        'version': '1.0.0',
        'deployment': {
            'frontend': 'https://vectorshift-assignment-xi.vercel.app/',
            'backend': 'https://vectorshift-assignment-yrb6.onrender.com/'
        },
        'endpoints': {
            'parse_pipeline': '/pipelines/parse',
            'health': '/'
        }
    }

@app.get('/favicon.ico')
def favicon():
    return FileResponse('favicon.ico')

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    node_ids = {node.id for node in nodes}
    graph = {node_id: [] for node_id in node_ids}
    
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            graph[edge.source].append(edge.target)
    
    visited = set()
    rec_stack = set()
    
    def has_cycle(node_id: str) -> bool:
        visited.add(node_id)
        rec_stack.add(node_id)
        
        for neighbor in graph[node_id]:
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        
        rec_stack.remove(node_id)
        return False
    
    for node_id in node_ids:
        if node_id not in visited:
            if has_cycle(node_id):
                return False
    
    return True

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag_result = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag_result
    }
