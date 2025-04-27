import React from 'react';
import TaskCard from './TaskCard';
import useBoardStore from '../../../store/boardStore';

const ListView = () => {
  const { getFilteredTasks, columns } = useBoardStore();
  const tasks = getFilteredTasks();

  // Group tasks by column
  const tasksByColumn = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.column === column.id);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 min-h-full">
      {columns.map(column => (
        <div 
          key={column.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-opacity-70');
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('bg-opacity-70');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-opacity-70');
            const taskId = e.dataTransfer.getData('taskId');
            if (taskId) {
              const { moveTask } = useBoardStore.getState();
              moveTask(taskId, column.id);
            }
          }}
        >
          <div className={`p-4 ${column.color} border-b border-gray-100`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">{column.title}</h2>
              <span className="px-2 py-0.5 text-sm bg-white bg-opacity-50 rounded-full">
                {tasksByColumn[column.id].length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {tasksByColumn[column.id].map(task => (
              <div key={task.id} className="p-2">
                <TaskCard task={task} />
              </div>
            ))}
            {tasksByColumn[column.id].length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No tasks in this column
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView; 