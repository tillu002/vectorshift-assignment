import { useState, useRef, useEffect } from 'react';
import { useStore } from './store';
import { ConfirmModal } from './components/ConfirmModal';

export const EdgeSidebar = () => {
  const selectedEdgeId = useStore((state) => state.selectedEdge);
  const edges = useStore((state) => state.edges);
  const nodes = useStore((state) => state.nodes);
  const deleteEdge = useStore((state) => state.deleteEdge);
  const rewireEdge = useStore((state) => state.rewireEdge);
  const clearSelectedEdge = useStore((state) => state.clearSelectedEdge);

  const [rewireMode, setRewireMode] = useState(null);
  const [position, setPosition] = useState({ x: 20, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const sidebarRef = useRef(null);
  const dragHandleRef = useRef(null);

  const selectedEdge = edges.find(edge => edge.id === selectedEdgeId);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteEdge(selectedEdgeId);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleRewireStart = (type) => {
    setRewireMode(type);
  };

  const handleNodeSelectForRewire = (nodeId) => {
    if (!rewireMode) return;

    if (rewireMode === 'source') {
      // Rewire source
      rewireEdge(selectedEdgeId, nodeId, selectedEdge.target, null, selectedEdge.targetHandle);
    } else {
      // Rewire target
      rewireEdge(selectedEdgeId, selectedEdge.source, nodeId, selectedEdge.sourceHandle, null);
    }

    setRewireMode(null);
  };

  const handleCancelRewire = () => {
    setRewireMode(null);
  };

  const handleMouseDown = (e) => {
    if (e.target === dragHandleRef.current || dragHandleRef.current?.contains(e.target)) {
      setIsDragging(true);
      const rect = sidebarRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Get viewport dimensions
      const sidebarWidth = 280;
      const sidebarHeight = sidebarRef.current?.offsetHeight || 400;
      const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - sidebarWidth));
      const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - sidebarHeight));

      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (selectedEdgeId) {
      const sidebarHeight = sidebarRef.current?.offsetHeight || 400;
      setPosition({ 
        x: 20, 
        y: Math.max(0, (window.innerHeight - sidebarHeight) / 2) 
      });
    }
  }, [selectedEdgeId]);

  if (!selectedEdge) {
    return null;
  }

  const sourceNode = nodes.find(n => n.id === selectedEdge.source);
  const targetNode = nodes.find(n => n.id === selectedEdge.target);

  const sidebarStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <div
      ref={sidebarRef}
      className="fixed w-[280px] bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-[80vh] overflow-hidden flex flex-col"
      style={sidebarStyle}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={dragHandleRef}
        className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center cursor-move select-none"
      >
        <div className="flex items-center gap-2 flex-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">Edge Options</span>
        </div>
        <button
          onClick={clearSelectedEdge}
          className="bg-transparent border-none text-xl cursor-pointer text-gray-500 p-0 w-6 h-6 flex items-center justify-center hover:text-gray-700 transition-colors ml-2"
          onMouseDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">

      <div className="mb-3 text-sm text-gray-600">
        <div><strong>From:</strong> {sourceNode?.type || selectedEdge.source}</div>
        <div><strong>To:</strong> {targetNode?.type || selectedEdge.target}</div>
      </div>

      {!rewireMode ? (
        <>
          <button
            onClick={handleDeleteClick}
            className="w-full mb-2 px-4 py-2 text-sm font-medium text-white bg-red-500 border-none rounded-md cursor-pointer hover:bg-red-600 active:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Edge
          </button>
          <button
            onClick={() => handleRewireStart('source')}
            className="w-full mb-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border-none rounded-md cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Rewire Source
          </button>
          <button
            onClick={() => handleRewireStart('target')}
            className="w-full mb-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border-none rounded-md cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Rewire Target
          </button>
        </>
      ) : (
        <>
          <div className="mb-3 text-sm font-medium text-gray-700">
            Select a node to rewire {rewireMode === 'source' ? 'source' : 'target'}:
          </div>
          <div className="mt-3 max-h-[200px] overflow-y-auto border border-gray-200 rounded p-2">
            {nodes
              .filter(node => {
                if (rewireMode === 'source') {
                  return node.id !== selectedEdge.target;
                } else {
                  return node.id !== selectedEdge.source;
                }
              })
              .map(node => (
                <div
                  key={node.id}
                  className="p-2 mb-1 bg-gray-50 rounded cursor-pointer text-sm border border-transparent hover:bg-gray-100 hover:border-blue-500 transition-colors"
                  onClick={() => handleNodeSelectForRewire(node.id)}
                >
                  {node.type} ({node.id})
                </div>
              ))}
          </div>
          <button
            onClick={handleCancelRewire}
            className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-gray-500 border-none rounded-md cursor-pointer hover:bg-gray-600 active:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </>
      )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Edge"
        message="Are you sure you want to delete this edge? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

