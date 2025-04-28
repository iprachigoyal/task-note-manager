import React, { useState } from 'react'
import { useTimeTrackingStore } from '../../../store/timeTrackingStore'
import { Clock, Play, Pause } from 'lucide-react'

export const TimeTrackingSummary = ({ tasks = [] }) => {
  const { getTimeStats, isTaskActive, getTaskTotalTime } = useTimeTrackingStore()
  const [showDetails, setShowDetails] = useState(false)
  
  const stats = getTimeStats()
  
  // Create a map of taskId to task object for easier lookup
  const taskMap = tasks.reduce((map, task) => {
    map[task.id] = task
    return map
  }, {})
  
  // Get active tasks
  const activeTasks = tasks.filter(task => isTaskActive(task.id))
  
  // Format total time
  const totalHours = Math.floor(stats.totalTrackedTime / 3600)
  const totalMinutes = Math.floor((stats.totalTrackedTime % 3600) / 60)
  const formattedTotal = totalHours > 0 
    ? `${totalHours}h ${totalMinutes}m` 
    : `${totalMinutes}m`
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Time Tracking Summary</h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
      </div>
      
      <div className="mt-2 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-sm text-gray-600">Total Time</div>
          <div className="text-xl font-semibold">{formattedTotal}</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded">
          <div className="text-sm text-gray-600">Tasks Tracked</div>
          <div className="text-xl font-semibold">{stats.taskCount}</div>
        </div>
        
        <div className={`p-3 rounded ${activeTasks.length > 0 ? 'bg-green-100 animate-pulse' : 'bg-purple-50'}`}>
          <div className="text-sm text-gray-600">Active Timers</div>
          <div className="text-xl font-semibold flex items-center gap-2">
            {activeTasks.length}
            {activeTasks.length > 0 && (
              <Clock className="h-5 w-5 text-green-600 animate-spin" />
            )}
          </div>
        </div>
      </div>

      {activeTasks.length > 0 && (
        <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
          <h4 className="text-sm font-semibold text-green-800 mb-2">Currently Running</h4>
          <div className="space-y-2">
            {activeTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between bg-white p-2 rounded border border-green-100">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Timer Active</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showDetails && Object.keys(stats.taskStats).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Time by Task</h4>
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-700">
                  <th className="py-2 px-3 text-left">Task</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-right">Time</th>
                  <th className="py-2 px-3 text-right">Entries</th>
                  <th className="py-2 px-3 text-center">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(stats.taskStats)
                  .sort((a, b) => b[1].totalTime - a[1].totalTime)
                  .map(([taskId, taskStat]) => {
                    const task = taskMap[taskId] || { title: 'Unknown Task', status: 'Unknown' }
                    const taskHours = Math.floor(taskStat.totalTime / 3600)
                    const taskMinutes = Math.floor((taskStat.totalTime % 3600) / 60)
                    const taskTimeFormatted = taskHours > 0 
                      ? `${taskHours}h ${taskMinutes}m` 
                      : `${taskMinutes}m`
                    const isActive = isTaskActive(taskId)
                    
                    return (
                      <tr key={taskId} className={`text-sm ${isActive ? 'bg-green-50' : ''}`}>
                        <td className="py-2 px-3">{task.title}</td>
                        <td className="py-2 px-3">{task.status}</td>
                        <td className="py-2 px-3 text-right font-medium">{taskTimeFormatted}</td>
                        <td className="py-2 px-3 text-right">{taskStat.entriesCount}</td>
                        <td className="py-2 px-3 text-center">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <Clock className="h-4 w-4 animate-spin" />
                              <span className="text-xs font-medium">Active</span>
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeTrackingSummary;