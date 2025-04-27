import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBoardStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      searchFilter: '',
      viewMode: 'grid',
      filters: {
        priority: [],
        status: []
      },
      columns: [
        { id: 'todo', title: 'To Do', color: 'bg-blue-100' },
        { id: 'inProgress', title: 'In Progress', color: 'bg-yellow-100' },
        { id: 'review', title: 'Review', color: 'bg-purple-100' },
        { id: 'done', title: 'Done', color: 'bg-green-100' },
      ],
      collapsedColumns: [],
      
      setSearchFilter: (query) => set({ searchFilter: query }),
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setFilters: (filterType, values) => 
        set((state) => ({
          filters: {
            ...state.filters,
            [filterType]: values
          }
        })),
      
      getFilteredTasks: () => {
        const state = get();
        const searchQuery = state.searchFilter.toLowerCase();
        let filteredTasks = state.tasks;
        
        // Apply search filter
        if (searchQuery) {
          filteredTasks = filteredTasks.filter((task) => 
            task.title.toLowerCase().includes(searchQuery) ||
            task.description?.toLowerCase().includes(searchQuery) ||
            task.labels?.some(label => label.toLowerCase().includes(searchQuery))
          );
        }
        
        // Apply priority filter
        if (state.filters.priority.length > 0) {
          filteredTasks = filteredTasks.filter((task) =>
            state.filters.priority.includes(task.priority)
          );
        }
        
        // Apply status filter
        if (state.filters.status.length > 0) {
          filteredTasks = filteredTasks.filter((task) =>
            state.filters.status.includes(task.column)
          );
        }
        
        return filteredTasks;
      },
      
      addTask: (task) => 
        set((state) => ({ 
          tasks: [...state.tasks, { 
            ...task, 
            id: Date.now().toString(),
            column: task.column || 'todo',
            createdAt: new Date().toISOString(),
          }]
        })),
        
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),
        
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
        
      moveTask: (taskId, targetColumn) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, column: targetColumn } : task
          ),
        })),
        
      toggleColumnCollapse: (columnId) =>
        set((state) => ({
          collapsedColumns: state.collapsedColumns.includes(columnId)
            ? state.collapsedColumns.filter((id) => id !== columnId)
            : [...state.collapsedColumns, columnId],
        })),
    }),
    {
      name: 'task-management-storage',
    }
  )
);

export default useBoardStore;