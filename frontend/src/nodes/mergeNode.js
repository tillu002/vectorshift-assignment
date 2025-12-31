import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Merge"
      inputHandles={[
        { id: `${id}-input1`, top: '33%' },
        { id: `${id}-input2`, top: '67%' },
      ]}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <div className="text-gray-600">Combines multiple inputs into a single output</div>
    </BaseNode>
  );
};

