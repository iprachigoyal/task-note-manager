// src/hooks/useTaskHeight.js
import { useState, useEffect, useCallback } from 'react';

export default function useTaskHeight(taskRef, dependencies = []) {
  const [height, setHeight] = useState(0);
  
  const updateHeight = useCallback(() => {
    if (taskRef.current) {
      const newHeight = taskRef.current.getBoundingClientRect().height;
      setHeight(newHeight);
    }
  }, [taskRef]);
  
  useEffect(() => {
    updateHeight();
    
    // Re-measure height when the component updates or on window resize
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [updateHeight, ...dependencies]);
  
  return height;
}