import React from 'react';
import Column from './Column';
import ListView from './ListView';
import CalendarView from './CalendarView';
import { TimeTrackingSummary } from './TimeTrackingSummary';
import useBoardStore from '../../../store/boardStore';

const Board = () => {
  const { columns, getFilteredTasks, viewMode } = useBoardStore();
  const filteredTasks = getFilteredTasks();
  
  if (viewMode === 'calendar') {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 space-y-4">
          <TimeTrackingSummary tasks={filteredTasks} />
          <CalendarView />
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 space-y-4">
          <TimeTrackingSummary tasks={filteredTasks} />
          <ListView />
        </div>
      </div>
    );
  }
  
  // Grid view with previous layout
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <TimeTrackingSummary tasks={filteredTasks} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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