import React from 'react';
import Column from './Column';
import CalendarView from './CalendarView';
import useBoardStore from '../../../store/boardStore';

const Board = () => {
  const { columns, getFilteredTasks } = useBoardStore();
  const filteredTasks = getFilteredTasks();
  const viewMode = useBoardStore((state) => state.viewMode);
  
  if (viewMode === 'calendar') {
    return <CalendarView />;
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-grow overflow-x-auto min-h-[calc(100vh-12rem)]">
        <div className="flex gap-6 h-full p-6">
          {columns.map((column) => (
            <Column 
              key={column.id} 
              column={column}
              tasks={filteredTasks.filter(task => task.column === column.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;