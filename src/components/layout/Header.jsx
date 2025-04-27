import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, SlidersHorizontal, LayoutGrid, List, ChevronDown, X, Calendar, RefreshCw } from 'lucide-react';
import useBoardStore from '../../store/boardStore';
import TaskForm from './board/TaskForm';

const Header = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    status: []
  });
  const filterRef = useRef(null);
  const { tasks, setSearchFilter, viewMode, setViewMode, setFilters } = useBoardStore();
  
  const inProgressTasks = tasks.filter(task => task.column === 'inProgress').length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchFilter(query.toLowerCase());
  };

  const toggleFilterMenu = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const updatedFilters = {
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter(item => item !== value)
          : [...prev[type], value]
      };
      return updatedFilters;
    });
  };

  const applyFilters = () => {
    setFilters('priority', selectedFilters.priority);
    setFilters('status', selectedFilters.status);
    setIsFilterExpanded(false);
  };

  const resetFilters = () => {
    setSelectedFilters({
      priority: [],
      status: []
    });
    setFilters('priority', []);
    setFilters('status', []);
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Main Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Logo and App Name */}
            <div className="flex items-center">
              <div className="flex items-center bg-blue-50 text-blue-600 p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 14H14V21H21V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 14H3V21H10V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 3H14V10H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 3H3V10H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800 ml-3">TaskBoard</h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search tasks..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            {/* Left side with task text */}
            <p className="text-sm text-gray-600 font-medium">
              Your workspace has <span className="text-blue-600 font-semibold">{inProgressTasks} tasks</span> in progress
            </p>

            {/* Right side with action buttons */}
            <div className="flex items-center space-x-2">
              {/* Add Task Button */}
              <button 
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Task</span>
              </button>

              {/* Filter Dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={toggleFilterMenu}
                  className={`flex items-center gap-1.5 border ${
                    selectedFilters.priority.length > 0 || selectedFilters.status.length > 0
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700'
                  } hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>

                {isFilterExpanded && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-700 text-sm">Filter Tasks</h3>
                      {(selectedFilters.priority.length > 0 || selectedFilters.status.length > 0) && (
                        <button
                          onClick={resetFilters}
                          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Priority</p>
                        <div className="space-y-1.5">
                          {['high', 'medium', 'low'].map((priority) => (
                            <label key={priority} className="flex items-center text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={selectedFilters.priority.includes(priority)}
                                onChange={() => handleFilterChange('priority', priority)}
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</p>
                        <div className="space-y-1.5">
                          {[
                            { id: 'todo', label: 'To Do' },
                            { id: 'inProgress', label: 'In Progress' },
                            { id: 'review', label: 'Review' },
                            { id: 'done', label: 'Done' }
                          ].map(({ id, label }) => (
                            <label key={id} className="flex items-center text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={selectedFilters.status.includes(id)}
                                onChange={() => handleFilterChange('status', id)}
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                        <button
                          onClick={resetFilters}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Reset All
                        </button>
                        <button
                          onClick={applyFilters}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } transition-colors`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } transition-colors`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 ${
                    viewMode === 'calendar'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } transition-colors`}
                  title="Calendar View"
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add New Task</h2>
              <button
                onClick={() => setShowTaskForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <TaskForm onClose={() => setShowTaskForm(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;