import { BaseNode } from './BaseNode';

export const SplitNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Split"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[
        { id: `${id}-output1`, top: '33%' },
        { id: `${id}-output2`, top: '67%' },
      ]}
    >
      <div className="text-gray-600">Splits input into multiple outputs</div>
    </BaseNode>
  );
};

