
export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className="cursor-grab active:cursor-grabbing min-w-[80px] h-[60px] flex items-center justify-center flex-col rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors shadow-sm"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => {}}
        draggable
      >
          <span className="text-white text-sm font-medium">{label}</span>
      </div>
    );
  };
  