import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ConditionNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [operator, setOperator] = useState(data?.operator || '>');
  const [threshold, setThreshold] = useState(data?.threshold || '0');

  useEffect(() => {
    updateNodeField(id, 'operator', operator);
  }, [id, operator, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'threshold', threshold);
  }, [id, threshold, updateNodeField]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Condition"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[
        { id: `${id}-true`, top: '33%' },
        { id: `${id}-false`, top: '67%' },
      ]}
    >
      <label className="block mb-2 text-xs font-medium text-gray-600">
        Operator:
        <select 
          value={operator} 
          onChange={(e) => setOperator(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value=">">Greater Than</option>
          <option value="<">Less Than</option>
          <option value=">=">Greater or Equal</option>
          <option value="<=">Less or Equal</option>
          <option value="==">Equal</option>
          <option value="!=">Not Equal</option>
        </select>
      </label>
      <label className="block mb-2 text-xs font-medium text-gray-600">
        Threshold:
        <input 
          type="text" 
          value={threshold} 
          onChange={(e) => setThreshold(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Threshold value"
        />
      </label>
    </BaseNode>
  );
};

