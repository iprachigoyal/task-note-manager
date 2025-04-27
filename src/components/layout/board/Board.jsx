import React from 'react';
import Column from './Column';
import ListView from './ListView';
import CalendarView from './CalendarView';
import useBoardStore from '../../../store/boardStore';

const Board = () => {
  const { columns, getFilteredTasks, viewMode } = useBoardStore();
  const filteredTasks = getFilteredTasks();
  
  if (viewMode === 'calendar') {
    return <CalendarView />;
  }

  if (viewMode === 'list') {
    return (
      <div className="h-full overflow-y-auto">
        <ListView />
      </div>
    );
  }
  
  // Grid view with previous layout
  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <div className="flex-grow overflow-x-auto min-h-[calc(100vh-12rem)]">
        <div className="flex gap-4 h-full p-4 w-full">
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