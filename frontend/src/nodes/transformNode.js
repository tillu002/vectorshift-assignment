import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [transformType, setTransformType] = useState(data?.transformType || 'uppercase');

  useEffect(() => {
    updateNodeField(id, 'transformType', transformType);
  }, [id, transformType, updateNodeField]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Transform"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <label className="block mb-2 text-xs font-medium text-gray-600">
        Transform Type:
        <select 
          value={transformType} 
          onChange={(e) => setTransformType(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="trim">Trim</option>
          <option value="reverse">Reverse</option>
        </select>
      </label>
    </BaseNode>
  );
};

