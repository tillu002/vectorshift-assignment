# Vector Shift Assignment

A node-based visual pipeline editor that demonstrates core concepts behind VectorShift's no-code AI platform. Users can drag nodes onto a canvas, connect them to form data pipelines, and validate the resulting graph structure.

## Project Overview

This is a simplified implementation of a visual pipeline builder—the kind of interface that powers no-code AI platforms. Users compose pipelines by dragging nodes (Input, LLM, Text, Transform, etc.) onto a canvas and connecting them with edges. The system validates that the resulting graph is a Directed Acyclic Graph (DAG), which is essential for pipeline execution.

The implementation focuses on:
- **Scalable node architecture** — Adding new node types requires minimal code
- **Consistent visual design** — All nodes share a unified look and feel
- **Intuitive user experience** — Lightweight onboarding guides first-time users
- **Pipeline validation** — Backend validates graph structure and detects cycles

## High-Level Architecture

```
┌─────────────────┐         HTTP POST          ┌─────────────────┐
│                 │    /pipelines/parse         │                 │
│   React Frontend│ ──────────────────────────> │  FastAPI Backend│
│                 │                             │                 │
│  - Node Editor  │ <────────────────────────── │  - DAG Check    │
│  - Canvas UI    │    {nodes, edges, is_dag}   │  - Validation   │
│  - State Mgmt   │                             │                 │
└─────────────────┘                             └─────────────────┘
```

The frontend is a React application built with React Flow for the node-based UI. The backend is a minimal FastAPI service that validates pipeline structure. Communication happens via JSON over HTTP.

## Frontend Architecture

### Node Abstraction

The core architectural decision was introducing a reusable `BaseNode` component. This directly addresses the assignment's "Node Abstraction" requirement.

**Why BaseNode exists:**

Before the abstraction, each node type (Input, Output, LLM, Text) duplicated the same structure:
- Title bar rendering
- Handle positioning logic
- Container styling
- Layout management

This created maintenance overhead and visual inconsistency. Adding a new node type meant copying 50+ lines of boilerplate.

**How it works:**

`BaseNode` accepts configuration instead of requiring custom implementations:

```javascript
<BaseNode
  title="Input"
  inputHandles={[]}
  outputHandles={[{ id: 'output' }]}
>
  {/* Custom content */}
</BaseNode>
```

The abstraction handles:
- Input/output handle rendering and positioning
- Consistent styling (borders, shadows, spacing)
- Title bar layout
- Container structure

**Result:**

Adding a new node type now requires ~20 lines of code instead of 50+. The five demo nodes (Transform, Filter, Merge, Split, Condition) were built using only the abstraction, demonstrating its extensibility.

**Handle System:**

Handles represent connection points. Input handles (left side, gray) accept incoming edges. Output handles (right side, blue) create outgoing edges. Edges represent data flow between nodes. This maps directly to how real pipeline systems work—data flows from outputs to inputs.

### State Management

State is managed with Zustand, chosen for its simplicity and performance. The store tracks:
- Nodes and edges (the graph structure)
- Selected edge (for editing/deletion)
- Node field updates (for form inputs)

React Flow handles the visual layer (rendering, dragging, connecting), while our store manages the business logic layer.

## Text Node Design

The Text node has custom logic that mirrors real-world prompt templating systems.

**Auto-resizing:**

The textarea automatically grows as content is added, improving UX by eliminating scrollbars for short text and accommodating longer prompts naturally.

**Variable Parsing:**

The node parses `{{ variable }}` syntax to detect template variables. This is the same pattern used in production systems like Jinja2, Handlebars, and VectorShift's own prompt templating.

**Dynamic Handles:**

For each detected variable (e.g., `{{ user_name }}`, `{{ context }}`), the node dynamically creates an input handle. This means:
- Users can connect data sources to specific template variables
- Handles appear/disappear as variables are added/removed
- Handle positions are distributed evenly along the left edge

This design reflects how prompt engineering works in practice: prompts reference variables that get populated from upstream nodes in the pipeline.

## Styling & UI/UX Philosophy

The styling approach prioritizes consistency and clarity over visual flair.

**Design System:**

All nodes use Tailwind CSS with shared utility classes. This ensures:
- Visual consistency across node types
- Easy maintenance (change once, applies everywhere)
- Predictable spacing and typography

**Why this matters:**

Internal tools and no-code platforms need to feel trustworthy and professional. Over-designed UIs can feel gimmicky. A clean, consistent design system helps users focus on building pipelines rather than being distracted by inconsistent styling.

**Visual Hierarchy:**

- Title bars provide clear node identification
- Input handles (gray) vs output handles (blue) create visual distinction
- Subtle borders and shadows separate nodes from the canvas
- Monospace font for `{{ variables }}` in Text nodes improves readability

The UI feels like a professional internal tool, not a marketing demo.

## User Onboarding & Discoverability

First-time users need to understand three core interactions:
1. Dragging nodes from the toolbar
2. Connecting nodes by dragging between handles
3. Submitting the pipeline for validation

**Onboarding Flow:**

A lightweight, sequential onboarding system guides users through these concepts. Hints appear one at a time with "Next" and "Skip" options. The flow is:
- Contextual (hints appear near relevant UI elements)
- Non-intrusive (can be dismissed)
- Stateful (progress saved in localStorage)

**Why lightweight:**

Heavy onboarding (full-screen modals, forced tutorials) feels like friction. Lightweight hints feel like helpful guidance. The implementation uses small cards positioned near relevant UI elements, not blocking overlays.

## Backend Architecture

The backend is intentionally simple. It has one job: validate pipeline structure.

**Endpoint: `/pipelines/parse`**

Accepts a JSON payload with `nodes` and `edges`, then returns:
- `num_nodes`: Count of nodes in the graph
- `num_edges`: Count of edges in the graph
- `is_dag`: Boolean indicating whether the graph is acyclic

**DAG Detection:**

Pipelines must be Directed Acyclic Graphs (no cycles). This is critical because:
- Cycles would cause infinite loops during execution
- DAGs have a clear execution order (topological sort)
- Most pipeline systems require acyclic graphs

The implementation uses depth-first search (DFS) with cycle detection. It's deterministic and handles edge cases (disconnected components, self-loops).

**Why simple:**

For this assignment, the backend doesn't need to execute pipelines, store state, or handle authentication. It validates structure. Keeping it simple makes the code easy to understand and maintain.

## End-to-End Flow

1. **User creates nodes**: Drags node types from the toolbar onto the canvas
2. **User configures nodes**: Edits node-specific fields (e.g., text content, input names)
3. **User connects nodes**: Drags from output handles to input handles, creating edges
4. **User submits pipeline**: Clicks "Submit Pipeline" button
5. **Frontend sends graph**: POSTs `{nodes, edges}` to `/api/pipelines/parse`
6. **Backend validates**: Counts nodes/edges and checks for cycles
7. **Frontend displays results**: Shows modal with validation results

The flow is straightforward because the system has a single, clear purpose: validate pipeline structure.

## Design Trade-offs & Scope

**What we kept simple:**

- **Node execution**: Nodes are visual representations only; they don't execute
- **Persistence**: No database; state lives in memory
- **Authentication**: Not included (assignment scope)
- **Complex validation**: Only checks for cycles, not semantic correctness

**What could be extended:**

In a production system, you'd add:
- Node execution engine
- Data persistence
- User authentication
- More sophisticated validation (type checking, required fields)
- Undo/redo
- Node grouping/collapsing
- Pipeline templates
- Version control

**Why this scope is appropriate:**

The assignment asked for a node abstraction, styling, Text node logic, and backend validation. The implementation delivers these requirements without over-engineering. The codebase is maintainable and extensible, which matters more than feature completeness for a take-home assignment.

## Technical Stack

**Frontend:**
- React 18
- React Flow 11 (node-based UI)
- Zustand (state management)
- Tailwind CSS (styling)
- pnpm (package management)

**Backend:**
- FastAPI (Python web framework)
- Pydantic (data validation)
- Mangum (ASGI adapter for Vercel)

**Deployment:**
- Vercel (configured via `vercel.json`)
- Frontend: Static build
- Backend: Serverless functions

## Getting Started

**Prerequisites:**
- Node.js 18+
- pnpm
- Python 3.9+

**Frontend:**
```bash
cd frontend
pnpm install
pnpm start
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The frontend runs on `http://localhost:3000` and expects the backend on `http://localhost:8000`.

## Assignment Requirements Mapping

✅ **Node Abstraction**: `BaseNode` component eliminates duplication; 5 demo nodes built using only the abstraction

✅ **Styling**: Unified design system using Tailwind CSS; consistent visual language across all nodes

✅ **Text Node Logic**: Auto-resizing, `{{ variable }}` parsing, dynamic input handle generation

✅ **Backend Integration**: `/pipelines/parse` endpoint counts nodes/edges and validates DAG structure

✅ **UX**: Modal feedback for submission results; onboarding hints for first-time users
