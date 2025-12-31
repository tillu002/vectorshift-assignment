
import { DraggableNode } from './draggableNode';
import { OnboardingFlow } from './components/OnboardingFlow';
import { useStore } from './store';

export const PipelineToolbar = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    
    return (
        <div className="p-2.5 bg-white border-b border-gray-200 relative">
            <div className="mt-5 flex flex-wrap gap-2.5 relative">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='merge' label='Merge' />
                <DraggableNode type='split' label='Split' />
                <DraggableNode type='condition' label='Condition' />
                <OnboardingFlow nodes={nodes} edges={edges} position="toolbar" />
            </div>
        </div>
    );
};
