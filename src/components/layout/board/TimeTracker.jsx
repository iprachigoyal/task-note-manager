import React, { useState, useEffect } from 'react'
import { useTimeTrackingStore } from '../../../store/timeTrackingStore'

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':')
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours === 0) {
    return `${minutes}m`
  }
  return `${hours}h ${minutes}m`
}

export const TaskTimeTracker = ({ taskId, taskTitle }) => {
  const { 
    startTracking, 
    stopTracking, 
    isTaskActive, 
    getTaskTotalTime,
    getTaskEntries,
    addTimeEntry,
    deleteTimeEntry
  } = useTimeTrackingStore()
  
  const [isActive, setIsActive] = useState(isTaskActive(taskId))
  const [timer, setTimer] = useState(0)
  const [showEntries, setShowEntries] = useState(false)
  const [manualTime, setManualTime] = useState('')
  const [manualNote, setManualNote] = useState('')
  const [showManualForm, setShowManualForm] = useState(false)
  
  // Initial total time
  const totalTimeSpent = getTaskTotalTime(taskId)
  
  // Effect to update the active state and timer
  useEffect(() => {
    let interval = null
    
    if (isTaskActive(taskId)) {
      setIsActive(true)
      interval = setInterval(() => {
        setTimer(timer => timer + 1)
      }, 1000)
    } else {
      setIsActive(false)
      setTimer(0)
      clearInterval(interval)
    }
    
    return () => clearInterval(interval)
  }, [taskId, isTaskActive])
  
  const handleStartStop = () => {
    if (isActive) {
      stopTracking()
      setIsActive(false)
      setTimer(0)
    } else {
      startTracking(taskId)
      setIsActive(true)
    }
  }
  
  const handleAddManualTime = (e) => {
    e.preventDefault()
    
    // Convert input to minutes
    const minutes = parseInt(manualTime, 10)
    
    if (!isNaN(minutes) && minutes > 0) {
      addTimeEntry(taskId, minutes, manualNote)
      setManualTime('')
      setManualNote('')
      setShowManualForm(false)
    }
  }
  
  const entries = getTaskEntries(taskId)
  
  return (
    <div className="mt-2 border-t pt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStartStop}
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              isActive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
          
          {isActive && (
            <div className="text-sm font-mono">
              {formatTime(timer)}
            </div>
          )}
          
          <div 
            className="text-xs text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={() => setShowEntries(!showEntries)}
          >
            Total: {formatDuration(totalTimeSpent)}
          </div>
        </div>
        
        <button
          onClick={() => setShowManualForm(!showManualForm)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {showManualForm ? 'Cancel' : 'Log time'}
        </button>
      </div>
      
      {showManualForm && (
        <form onSubmit={handleAddManualTime} className="mb-3 flex items-center space-x-2">
          <input
            type="number"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            className="w-16 px-2 py-1 text-sm border rounded"
            placeholder="Mins"
            min="1"
            required
          />
          <input
            type="text"
            value={manualNote}
            onChange={(e) => setManualNote(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded"
            placeholder="Note (optional)"
          />
          <button
            type="submit"
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      )}
      
      {showEntries && entries.length > 0 && (
        <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-2 bg-gray-50">
          <h4 className="text-xs font-semibold mb-1">Time Entries</h4>
          
          {entries.map((entry, index) => {
            const date = new Date(entry.startTime)
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            
            return (
              <div key={index} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                <div>
                  <span className="text-gray-600">
                    {entry.isManual ? 'Manual log' : formattedDate}
                  </span>
                  {entry.note && <span className="ml-2 text-gray-800">{entry.note}</span>}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">
                    {formatDuration(entry.duration)}
                  </span>
                  <button
                    onClick={() => deleteTimeEntry(taskId, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default TaskTimeTracker;