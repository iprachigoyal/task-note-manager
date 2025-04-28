import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import useBoardStore from '../../../store/boardStore';
import { Plus, ChevronDown, ChevronUp, X } from 'lucide-react';

const Column = ({ column, tasks }) => {
  const { collapsedColumns, toggleColumnCollapse, moveTask } = useBoardStore();
  const [showForm, setShowForm] = useState(false);
  
  const isCollapsed = collapsedColumns.includes(column.id);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-opacity-70');
  };
  
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-opacity-70');
  };
  
  const handleDrop = (e) => {
    e.currentTarget.classList.remove('bg-opacity-70');
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, column.id);
  };
  
  return (
    <>
      <div 
        className="w-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-16rem)]"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`p-4 border-b border-gray-100 ${column.color}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-gray-800">{column.title}</h2>
              <span className="px-2 py-0.5 text-sm bg-white bg-opacity-50 rounded-full">
                {tasks.length}
              </span>
            </div>
            
            <div className="flex space-x-1">
              <button 
                onClick={() => setShowForm(true)}
                className="p-1.5 rounded-md hover:bg-white hover:bg-opacity-25 transition-colors"
                title="Add Task"
              >
                <Plus size={18} />
              </button>
              
              <button 
                onClick={() => toggleColumnCollapse(column.id)}
                className="p-1.5 rounded-md hover:bg-white hover:bg-opacity-25 transition-colors"
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
            </div>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Drop tasks here
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('taskId', task.id);
                  }}
                >
                  <TaskCard task={task} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add Task to {column.title}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <TaskForm 
                column={column.id} 
                onClose={() => setShowForm(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Column;