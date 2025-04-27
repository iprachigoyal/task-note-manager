import { useState, useRef, useEffect } from 'react';

export const useDragAndDrop = () => {
  const [dragging, setDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const dragNode = useRef();
  
  const handleDragStart = (e, params) => {
    dragNode.current = e.target;
    setDraggedItem(params);
    setDragging(true);
    
    setTimeout(() => {
      e.target.style.opacity = '0.3';
    }, 0);
  };
  
  const handleDragEnd = (e) => {
    setDragging(false);
    dragNode.current.style.opacity = '1';
    dragNode.current = null;
    setDraggedItem(null);
  };
  
  const handleDragEnter = (e, targetParams, onDragComplete) => {
    e.preventDefault();
    
    // Don't replace items with themselves
    if (draggedItem && 
      JSON.stringify(targetParams) !== JSON.stringify(draggedItem)) {
      onDragComplete(draggedItem, targetParams);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  return {
    dragging,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragOver,
  };
};