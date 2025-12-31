import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      inputHandles={[
        { id: `${id}-system`, top: '33%' },
        { id: `${id}-prompt`, top: '67%' },
      ]}
      outputHandles={[{ id: `${id}-response` }]}
    >
      <div className="text-gray-600">AI Language Model</div>
    </BaseNode>
  );
}
