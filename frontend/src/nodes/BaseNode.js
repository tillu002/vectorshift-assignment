import { Handle, Position } from 'reactflow';

export const BaseNode = ({ 
  id, 
  data, 
  title, 
  inputHandles = [], 
  outputHandles = [], 
  children,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}
      style={style}
    >
      {inputHandles.map((handle, index) => (
        <Handle
          key={handle.id || `input-${index}`}
          type="target"
          position={handle.position || Position.Left}
          id={handle.id}
          className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white hover:!bg-slate-500 transition-colors"
          style={handle.top !== undefined ? { top: handle.top } : {}}
        />
      ))}

      {title && (
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 flex items-center">
          {title}
        </div>
      )}

      <div className="p-3 text-sm text-gray-700">
        {children}
      </div>

      {outputHandles.map((handle, index) => (
        <Handle
          key={handle.id || `output-${index}`}
          type="source"
          position={handle.position || Position.Right}
          id={handle.id}
          className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white hover:!bg-blue-600 transition-colors"
          style={handle.top !== undefined ? { top: handle.top } : {}}
        />
      ))}
    </div>
  );
};

