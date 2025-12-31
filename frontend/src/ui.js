
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { OnboardingFlow } from './components/OnboardingFlow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { TransformNode } from './nodes/transformNode';
import { FilterNode } from './nodes/filterNode';
import { MergeNode } from './nodes/mergeNode';
import { SplitNode } from './nodes/splitNode';
import { ConditionNode } from './nodes/conditionNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  merge: MergeNode,
  split: SplitNode,
  condition: ConditionNode,
};

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    
    // Split selectors to avoid unnecessary re-renders
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const selectedEdgeId = useStore((state) => state.selectedEdge);
    const getNodeID = useStore((state) => state.getNodeID);
    const addNode = useStore((state) => state.addNode);
    const onNodesChangeStore = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);
    const setSelectedEdge = useStore((state) => state.setSelectedEdge);
    const clearSelectedEdge = useStore((state) => state.clearSelectedEdge);

    const onNodesChange = useCallback((changes) => {
        if (isLocked) {
            const filteredChanges = changes.filter(change => {
                if (change.type === 'position') {
                    return false;
                }
                if (change.type === 'select') {
                    return false;
                }
                return true;
            });
            if (filteredChanges.length > 0) {
                onNodesChangeStore(filteredChanges);
            }
        } else {
            onNodesChangeStore(changes);
        }
    }, [isLocked, onNodesChangeStore]);

    // Enhance edges with selection styling
    const enhancedEdges = edges.map(edge => ({
      ...edge,
      selected: edge.id === selectedEdgeId,
      style: edge.id === selectedEdgeId 
        ? { stroke: '#3b82f6', strokeWidth: 3 }
        : edge.style || {},
    }));

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            if (!reactFlowInstance) {
              return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onEdgeClick = useCallback((event, edge) => {
        event.stopPropagation();
        setSelectedEdge(edge.id);
    }, [setSelectedEdge]);

    const onPaneClick = useCallback(() => {
        clearSelectedEdge();
    }, [clearSelectedEdge]);

    const handleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(() => {
                console.error('Error attempting to enable fullscreen');
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            }).catch(() => {
                console.error('Error attempting to exit fullscreen');
            });
        }
    }, []);

    const handleLock = useCallback(() => {
        setIsLocked(prev => !prev);
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const findAndInterceptButtons = () => {
            const reactFlowElement = reactFlowWrapper.current?.querySelector('.react-flow');
            if (!reactFlowElement) return;

            const controls = reactFlowElement.querySelector('[class*="react-flow__controls"]');
            if (!controls) return;

            const buttons = controls.querySelectorAll('button');
            
            buttons.forEach((button, index) => {
                const ariaLabel = button.getAttribute('aria-label') || '';
                const title = button.getAttribute('title') || '';
                const svg = button.querySelector('svg');
                const svgPath = svg?.querySelector('path')?.getAttribute('d') || '';
                
                const isFullscreenButton = 
                    ariaLabel.toLowerCase().includes('fullscreen') || 
                    title.toLowerCase().includes('fullscreen') ||
                    svgPath.includes('M4 8V4') ||
                    (buttons.length >= 4 && index === 2);
                
                const isLockButton = 
                    ariaLabel.toLowerCase().includes('lock') || 
                    title.toLowerCase().includes('lock') ||
                    svgPath.includes('M8 11V7') ||
                    (buttons.length >= 4 && index === 3);

                if (isFullscreenButton) {
                    const updateIcon = () => {
                        const svg = button.querySelector('svg');
                        if (svg) {
                            svg.setAttribute('viewBox', '0 0 24 24');
                            svg.setAttribute('width', '20');
                            svg.setAttribute('height', '20');
                            svg.style.setProperty('width', '20px', 'important');
                            svg.style.setProperty('height', '20px', 'important');
                            svg.style.setProperty('min-width', '20px', 'important');
                            svg.style.setProperty('min-height', '20px', 'important');
                            svg.style.setProperty('max-width', '20px', 'important');
                            svg.style.setProperty('max-height', '20px', 'important');
                            
                            let path = svg.querySelector('path');
                            if (!path) {
                                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                svg.appendChild(path);
                            }
                            
                            if (isFullscreen) {
                                path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                            } else {
                                path.setAttribute('d', 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4');
                            }
                            path.setAttribute('stroke', 'currentColor');
                            path.setAttribute('fill', 'none');
                            path.setAttribute('stroke-linecap', 'round');
                            path.setAttribute('stroke-linejoin', 'round');
                            path.setAttribute('stroke-width', '2');
                        }
                    };

                    updateIcon();

                    const existingHandler = button.getAttribute('data-custom-handler');
                    if (existingHandler) {
                        return;
                    }

                    button.setAttribute('data-custom-handler', 'true');
                    
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFullscreen();
                    });
                }
                
                if (isLockButton) {
                    const updateLockIcon = () => {
                        const svg = button.querySelector('svg');
                        if (svg) {
                            svg.setAttribute('viewBox', '0 0 24 24');
                            svg.setAttribute('width', '20');
                            svg.setAttribute('height', '20');
                            svg.style.setProperty('width', '20px', 'important');
                            svg.style.setProperty('height', '20px', 'important');
                            svg.style.setProperty('min-width', '20px', 'important');
                            svg.style.setProperty('min-height', '20px', 'important');
                            svg.style.setProperty('max-width', '20px', 'important');
                            svg.style.setProperty('max-height', '20px', 'important');
                            
                            let path = svg.querySelector('path');
                            if (!path) {
                                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                svg.appendChild(path);
                            }
                            
                            if (isLocked) {
                                path.setAttribute('d', 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z');
                            } else {
                                path.setAttribute('d', 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z');
                            }
                            path.setAttribute('stroke', 'currentColor');
                            path.setAttribute('fill', 'none');
                            path.setAttribute('stroke-linecap', 'round');
                            path.setAttribute('stroke-linejoin', 'round');
                            path.setAttribute('stroke-width', '2');
                        }

                        if (isLocked) {
                            button.style.setProperty('background-color', '#3b82f6', 'important');
                            button.style.setProperty('color', '#ffffff', 'important');
                        } else {
                            button.style.setProperty('background-color', '', 'important');
                            button.style.setProperty('color', '', 'important');
                        }
                    };

                    updateLockIcon();

                    const existingHandler = button.getAttribute('data-custom-handler');
                    if (existingHandler) {
                        return;
                    }

                    button.setAttribute('data-custom-handler', 'true');
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLock();
                    });
                }
            });
        };

        const timeoutId = setTimeout(findAndInterceptButtons, 100);
        const intervalId = setInterval(findAndInterceptButtons, 300);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [handleFullscreen, handleLock, isFullscreen, isLocked]);

    return (
        <>
        <div 
            ref={reactFlowWrapper} 
            className="bg-gray-50 relative"
            style={{ width: '100%', height: '70vh' }}
        >
            <ReactFlow
                nodes={nodes}
                edges={enhancedEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                edgesUpdatable={false}
                edgesFocusable={true}
                nodesDraggable={!isLocked}
                nodesConnectable={!isLocked}
                panOnDrag={!isLocked}
            >
                <Background color="#e5e7eb" gap={gridSize} size={1} />
                <Controls className="bg-white border border-gray-200 rounded shadow-sm" />
                <MiniMap 
                    className="bg-white border border-gray-200 rounded shadow-sm"
                    nodeColor="#3b82f6"
                    maskColor="rgba(0, 0, 0, 0.1)"
                />
            </ReactFlow>
            <OnboardingFlow nodes={nodes} edges={edges} position="center" />
            <OnboardingFlow nodes={nodes} edges={edges} position="bottom-center" />
        </div>
        </>
    )
}
