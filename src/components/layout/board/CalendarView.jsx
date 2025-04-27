import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { X, Calendar as CalendarIcon, Clock, Tag, AlertCircle } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useBoardStore from '../../../store/boardStore';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TaskDetailsModal = ({ task, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{task.title}</h3>
          
          <div className="space-y-4">
            {task.description && (
              <div className="text-gray-600">
                <p className="whitespace-pre-line">{task.description}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            </div>
            
            {task.labels && task.labels.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-gray-600" />
                <div className="flex gap-1 flex-wrap">
                  {task.labels.map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarView = () => {
  const { getFilteredTasks } = useBoardStore();
  const tasks = getFilteredTasks();
  const [selectedTask, setSelectedTask] = useState(null);

  // Convert tasks to calendar events
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    allDay: true,
    resource: task, // Store the original task for reference
  }));

  const eventStyleGetter = (event) => {
    const task = event.resource;
    let backgroundColor = '#3B82F6'; // Default blue

    switch (task.priority) {
      case 'high':
        backgroundColor = '#EF4444'; // Red
        break;
      case 'medium':
        backgroundColor = '#F59E0B'; // Orange
        break;
      case 'low':
        backgroundColor = '#10B981'; // Green
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedTask(event.resource);
  };

  return (
    <div className="h-[calc(100vh-12rem)] p-6 bg-white rounded-lg shadow">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        defaultView="month"
        toolbar={true}
        popup={true}
        selectable={true}
        onSelectEvent={handleSelectEvent}
      />
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default CalendarView; 