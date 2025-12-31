import { useState, useEffect } from 'react';
import { onboardingState, ONBOARDING_STEPS } from '../utils/onboarding';

export const OnboardingFlow = ({ nodes, edges, position }) => {
  const [currentStep, setCurrentStep] = useState(() => onboardingState.getCurrentStep());
  const [isVisible, setIsVisible] = useState(() => !onboardingState.isCompleted());

  useEffect(() => {
    if (onboardingState.isCompleted()) {
      setIsVisible(false);
      return;
    }
    setCurrentStep(onboardingState.getCurrentStep());
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const checkState = () => {
      if (onboardingState.isCompleted()) {
        setIsVisible(false);
        return;
      }
      const savedStep = onboardingState.getCurrentStep();
      if (savedStep !== currentStep) {
        setCurrentStep(savedStep);
      }
    };

    const interval = setInterval(checkState, 200);
    return () => clearInterval(interval);
  }, [isVisible, currentStep]);

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep >= ONBOARDING_STEPS.length) {
      onboardingState.setCompleted();
      setIsVisible(false);
    } else {
      setCurrentStep(nextStep);
      onboardingState.setCurrentStep(nextStep);
    }
  };

  const handleSkip = () => {
    onboardingState.setCompleted();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];
  if (!step || step.position !== position) return null;

  let displayContent = step.content;
  if (step.requiresNodes && nodes.length === 0) {
    displayContent = 'After adding nodes to the canvas, you can connect them by dragging from output handles (right side) to input handles (left side).';
  }

  const content = (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-[2000] pointer-events-auto">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">{step.title}</h3>
          <p className="text-xs text-gray-600">{displayContent}</p>
        </div>
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none ml-2 flex-shrink-0"
        >
          ×
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {currentStep + 1} of {ONBOARDING_STEPS.length}
        </div>
        <div className="flex gap-2">
          {currentStep < ONBOARDING_STEPS.length - 1 && (
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Got it' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );

  switch (step.position) {
    case 'center':
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2000]">
          {content}
        </div>
      );
    case 'toolbar':
      return (
        <div className="absolute top-full left-0 mt-2 pointer-events-none z-[2000]">
          {content}
        </div>
      );
    case 'bottom-center':
      return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-[2000]">
          {content}
        </div>
      );
    case 'submit':
      return (
        <div className="absolute bottom-full right-0 mb-2 pointer-events-none z-[2000]">
          {content}
          <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
        </div>
      );
    default:
      return null;
  }
};

