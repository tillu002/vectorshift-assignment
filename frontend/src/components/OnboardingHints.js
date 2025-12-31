// OnboardingHints.js
// Lightweight onboarding hints for first-time users

import { useEffect, useState } from 'react';
import { onboardingState, ONBOARDING_KEYS } from '../utils/onboarding';

// Canvas hint for first-time users
export const CanvasHint = ({ nodes, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenHint = onboardingState.get(ONBOARDING_KEYS.FIRST_NODE);
    const hasNodes = nodes.length > 0;
    
    if (!hasSeenHint && !hasNodes) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [nodes]);

  useEffect(() => {
    if (nodes.length > 0 && isVisible) {
      onboardingState.set(ONBOARDING_KEYS.FIRST_NODE);
      setIsVisible(false);
    }
  }, [nodes, isVisible]);

  const handleDismiss = () => {
    onboardingState.set(ONBOARDING_KEYS.FIRST_NODE);
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm pointer-events-auto">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-900">Get Started</h3>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Drag nodes from the top bar onto the canvas to get started.
        </p>
      </div>
    </div>
  );
};

// Toolbar hint for drag & drop
export const ToolbarHint = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenHint = onboardingState.get(ONBOARDING_KEYS.DRAG_NODES);
    if (!hasSeenHint) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    onboardingState.set(ONBOARDING_KEYS.DRAG_NODES);
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="relative">
      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-20">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs text-gray-600 flex-1">
            Drag these nodes onto the canvas to build your pipeline.
          </p>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm leading-none ml-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Connection hint when nodes exist
export const ConnectionHint = ({ nodes, edges, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenHint = onboardingState.get(ONBOARDING_KEYS.CONNECT_NODES);
    const hasNodes = nodes.length > 0;
    const hasEdges = edges.length > 0;
    
    if (!hasSeenHint && hasNodes && !hasEdges) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [nodes, edges]);

  useEffect(() => {
    if (edges.length > 0 && isVisible) {
      onboardingState.set(ONBOARDING_KEYS.CONNECT_NODES);
      setIsVisible(false);
    }
  }, [edges, isVisible]);

  const handleDismiss = () => {
    onboardingState.set(ONBOARDING_KEYS.CONNECT_NODES);
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-sm z-10 pointer-events-auto">
      <div className="flex justify-between items-start">
        <p className="text-xs text-gray-600 flex-1">
          Connect nodes by dragging from an output handle (right side) to an input handle (left side).
        </p>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm leading-none ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Submit button hint
export const SubmitHint = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenHint = onboardingState.get(ONBOARDING_KEYS.SUBMIT_PIPELINE);
    if (!hasSeenHint) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    onboardingState.set(ONBOARDING_KEYS.SUBMIT_PIPELINE);
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-20">
      <div className="flex justify-between items-start">
        <p className="text-xs text-gray-600 flex-1">
          Submit validates your pipeline and checks for cycles.
        </p>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm leading-none ml-2"
        >
          ×
        </button>
      </div>
      <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
    </div>
  );
};

