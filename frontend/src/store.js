// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    selectedEdge: null,
    setSelectedEdge: (edgeId) => {
      set({ selectedEdge: edgeId });
    },
    clearSelectedEdge: () => {
      set({ selectedEdge: null });
    },
    getNodeID: (type) => {
        const state = get();
        const newIDs = {...state.nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      const updatedEdges = applyEdgeChanges(changes, get().edges);
      const edgesWithIds = updatedEdges.map(edge => {
        if (!edge.id) {
          return {
            ...edge,
            id: `${edge.source}-${edge.sourceHandle || 'default'}-${edge.target}-${edge.targetHandle || 'default'}-${Date.now()}`,
          };
        }
        return edge;
      });
      set({
        edges: edgesWithIds,
      });
    },
    onConnect: (connection) => {
      const edgeId = `${connection.source}-${connection.sourceHandle || 'default'}-${connection.target}-${connection.targetHandle || 'default'}-${Date.now()}`;
      set({
        edges: addEdge({
          ...connection,
          id: edgeId,
          type: 'smoothstep',
          animated: true,
          markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}
        }, get().edges),
      });
    },
    deleteEdge: (edgeId) => {
      set({
        edges: get().edges.filter(edge => edge.id !== edgeId),
        selectedEdge: null,
      });
    },
    rewireEdge: (edgeId, newSource, newTarget, newSourceHandle = null, newTargetHandle = null) => {
      set({
        edges: get().edges.map(edge => {
          if (edge.id === edgeId) {
            return {
              ...edge,
              source: newSource,
              target: newTarget,
              sourceHandle: newSourceHandle || edge.sourceHandle,
              targetHandle: newTargetHandle || edge.targetHandle,
            };
          }
          return edge;
        }),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, [fieldName]: fieldValue }
            };
          }
          return node;
        }),
      });
    },
  }));
