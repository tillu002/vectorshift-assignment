import { useState, useEffect, useMemo, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

const extractVariables = (text) => {
  const variablePattern = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const variables = new Set();
  let match;
  
  while ((match = variablePattern.exec(text)) !== null) {
    const varName = match[1].trim();
    if (varName) {
      variables.add(varName);
    }
  }
  
  return variables;
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(60, scrollHeight)}px`;
    }
  }, [currText]);

  useEffect(() => {
    updateNodeField(id, 'text', currText);
  }, [id, currText, updateNodeField]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  const inputHandles = useMemo(() => {
    const variableArray = Array.from(variables);
    return variableArray.map((varName, index) => {
      const totalVars = variableArray.length;
      const topPercent = totalVars === 1 
        ? '50%' 
        : `${((index + 1) / (totalVars + 1)) * 100}%`;
      
      return {
        id: `${id}-${varName}`,
        top: topPercent,
      };
    });
  }, [id, variables]);

  const containerWidth = useMemo(() => {
    const minWidth = 200;
    const maxWidth = 400;
    return Math.max(minWidth, Math.min(maxWidth, currText.length * 8 + 50));
  }, [currText]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      inputHandles={inputHandles}
      outputHandles={[{ id: `${id}-output` }]}
      style={{ width: `${containerWidth}px` }}
      className=""
    >
      <label className="block mb-2 text-xs font-medium text-gray-600">
        Text:
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          className="w-full min-h-[60px] mt-1 px-2 py-1.5 text-sm border border-gray-300 rounded resize-y font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter text with {{ variables }}"
        />
      </label>
      {variables.size > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-medium">Variables:</span>{' '}
          <span className="font-mono text-gray-700">
            {Array.from(variables).map((v, i) => (
              <span key={v}>
                <span className="text-blue-600">{'{{'}</span>
                {v}
                <span className="text-blue-600">{'}}'}</span>
                {i < variables.size - 1 && ', '}
              </span>
            ))}
          </span>
        </div>
      )}
    </BaseNode>
  );
}
