import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTimeTrackingStore = create(
  persist(
    (set, get) => ({
      timeEntries: {}, // Structure: { taskId: [{ startTime, endTime, duration, note }] }
      activeTask: null, // { taskId, startTime }
      
      // Start tracking time for a task
      startTracking: (taskId) => {
        const { activeTask } = get()
        
        // If there's already an active task, stop it first
        if (activeTask) {
          get().stopTracking()
        }
        
        set({ 
          activeTask: { 
            taskId, 
            startTime: new Date().toISOString() 
          } 
        })
      },
      
      // Stop tracking the current active task
      stopTracking: (note = '') => {
        const { activeTask, timeEntries } = get()
        
        if (!activeTask) return
        
        const endTime = new Date().toISOString()
        const startTime = activeTask.taskId ? activeTask.startTime : null
        
        if (!startTime) {
          set({ activeTask: null })
          return
        }
        
        // Calculate duration in seconds
        const durationMs = new Date(endTime) - new Date(startTime)
        const duration = Math.floor(durationMs / 1000)
        
        // Create new time entry
        const newEntry = { startTime, endTime, duration, note }
        
        // Get existing entries for this task or initialize empty array
        const taskEntries = timeEntries[activeTask.taskId] || []
        
        // Update time entries
        set({
          timeEntries: {
            ...timeEntries,
            [activeTask.taskId]: [...taskEntries, newEntry]
          },
          activeTask: null
        })
        
        return newEntry
      },
      
      // Add a manual time entry
      addTimeEntry: (taskId, duration, note = '', date = new Date().toISOString()) => {
        const { timeEntries } = get()
        const taskEntries = timeEntries[taskId] || []
        
        // Create a manual entry with the same date for start and end
        const entry = {
          startTime: date,
          endTime: date, 
          duration: duration * 60, // Convert minutes to seconds
          note,
          isManual: true
        }
        
        set({
          timeEntries: {
            ...timeEntries,
            [taskId]: [...taskEntries, entry]
          }
        })
      },
      
      // Delete a time entry
      deleteTimeEntry: (taskId, entryIndex) => {
        const { timeEntries } = get()
        const taskEntries = [...(timeEntries[taskId] || [])]
        
        if (entryIndex >= 0 && entryIndex < taskEntries.length) {
          taskEntries.splice(entryIndex, 1)
          
          set({
            timeEntries: {
              ...timeEntries,
              [taskId]: taskEntries
            }
          })
        }
      },
      
      // Get total time spent on a task in seconds
      getTaskTotalTime: (taskId) => {
        const { timeEntries } = get()
        const entries = timeEntries[taskId] || []
        return entries.reduce((total, entry) => total + entry.duration, 0)
      },
      
      // Get all entries for a specific task
      getTaskEntries: (taskId) => {
        const { timeEntries } = get()
        return timeEntries[taskId] || []
      },
      
      // Check if a task is currently being tracked
      isTaskActive: (taskId) => {
        const { activeTask } = get()
        return activeTask !== null && activeTask.taskId === taskId
      },
      
      // Get summary stats for all tasks
      getTimeStats: () => {
        const { timeEntries } = get()
        
        const stats = {
          totalTrackedTime: 0,
          taskCount: Object.keys(timeEntries).length,
          entriesCount: 0,
          taskStats: {}
        }
        
        Object.entries(timeEntries).forEach(([taskId, entries]) => {
          const taskTotalTime = entries.reduce((total, entry) => total + entry.duration, 0)
          stats.totalTrackedTime += taskTotalTime
          stats.entriesCount += entries.length
          stats.taskStats[taskId] = {
            totalTime: taskTotalTime,
            entriesCount: entries.length
          }
        })
        
        return stats
      }
    }),
    {
      name: 'time-tracking-storage'
    }
  )
)
export default useTimeTrackingStore;