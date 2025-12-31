const ONBOARDING_COMPLETED_KEY = 'vectorshift_onboarding_completed';
const ONBOARDING_CURRENT_STEP_KEY = 'vectorshift_onboarding_current_step';
const ONBOARDING_SESSION_KEY = 'vectorshift_onboarding_session';

const initializeSession = () => {
  try {
    if (!sessionStorage.getItem(ONBOARDING_SESSION_KEY)) {
      sessionStorage.setItem(ONBOARDING_SESSION_KEY, Date.now().toString());
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem(ONBOARDING_CURRENT_STEP_KEY);
    }
  } catch {}
};

initializeSession();

export const onboardingState = {
  isCompleted: () => {
    try {
      if (!sessionStorage.getItem(ONBOARDING_SESSION_KEY)) {
        return false;
      }
      return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setCompleted: () => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {}
  },

  getCurrentStep: () => {
    try {
      const step = localStorage.getItem(ONBOARDING_CURRENT_STEP_KEY);
      return step ? parseInt(step, 10) : 0;
    } catch {
      return 0;
    }
  },

  setCurrentStep: (step) => {
    try {
      localStorage.setItem(ONBOARDING_CURRENT_STEP_KEY, step.toString());
    } catch {}
  },

  reset: () => {
    try {
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem(ONBOARDING_CURRENT_STEP_KEY);
    } catch {}
  },
};

// Onboarding steps configuration
export const ONBOARDING_STEPS = [
  {
    id: 0,
    key: 'canvas',
    title: 'Get Started',
    content: 'Drag nodes from the top bar onto the canvas to get started.',
    position: 'center',
  },
  {
    id: 1,
    key: 'toolbar',
    title: 'Node Toolbar',
    content: 'Drag these nodes onto the canvas to build your pipeline.',
    position: 'toolbar',
  },
  {
    id: 2,
    key: 'connect',
    title: 'Connect Nodes',
    content: 'Connect nodes by dragging from an output handle (right side) to an input handle (left side).',
    position: 'bottom-center',
    requiresNodes: true,
  },
  {
    id: 3,
    key: 'submit',
    title: 'Submit Pipeline',
    content: 'Submit validates your pipeline and checks for cycles.',
    position: 'submit',
  },
];

