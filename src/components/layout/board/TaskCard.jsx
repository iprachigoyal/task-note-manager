import React, { useState } from 'react';
import { Calendar, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import useBoardStore from '../../../store/boardStore';

const priorityConfig = {
  low: {
    classes: 'border-l-4 border-gray-400',
    badge: 'bg-gray-100 text-gray-700'
  },
  medium: {
    classes: 'border-l-4 border-orange-400',
    badge: 'bg-orange-100 text-orange-700'
  },
  high: {
    classes: 'border-l-4 border-red-400',
    badge: 'bg-red-100 text-red-700'
  }
};

const TaskCard = ({ task }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { deleteTask } = useBoardStore();
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const priorityStyle = priorityConfig[task.priority] || priorityConfig.low;
  
  return (
    <div 
      className={`bg-white ${priorityStyle.classes} rounded-lg shadow-sm hover:shadow-md 
        transition-all duration-200 ease-in-out cursor-pointer`}
      onClick={() => setShowDetails(!showDetails)}
      draggable
    >
      <div className="p-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-gray-900 flex-grow">{task.title}</h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {task.priority && (
            <span className={`text-xs px-2 py-1 rounded-full ${priorityStyle.badge} font-medium`}>
              {task.priority}
            </span>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.labels.map((label, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {task.description && (
              <p className="text-sm text-gray-600 whitespace-pre-line mb-3">
                {task.description}
              </p>
            )}
            
            <div className="flex justify-end">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
                className="flex items-center gap-1 text-xs px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;