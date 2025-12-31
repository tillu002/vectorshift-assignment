import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [filterCondition, setFilterCondition] = useState(data?.filterCondition || 'contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  useEffect(() => {
    updateNodeField(id, 'filterCondition', filterCondition);
  }, [id, filterCondition, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'filterValue', filterValue);
  }, [id, filterValue, updateNodeField]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Filter"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <label className="block mb-2 text-xs font-medium text-gray-600">
        Condition:
        <select 
          value={filterCondition} 
          onChange={(e) => setFilterCondition(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
        </select>
      </label>
      <label className="block mb-2 text-xs font-medium text-gray-600">
        Value:
        <input 
          type="text" 
          value={filterValue} 
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Filter value"
        />
      </label>
    </BaseNode>
  );
};

