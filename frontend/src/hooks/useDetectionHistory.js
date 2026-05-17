import { useState, useCallback } from 'react'

const MAX_HISTORY = 20

// Hook to track detection history across sessions (in memory)
export function useDetectionHistory() {
  const [history, setHistory] = useState([])

  const addDetection = useCallback((detections, source = 'upload') => {
    const entry = {
      id:         Date.now(),
      timestamp:  new Date().toLocaleTimeString(),
      detections,
      source,
      count:      detections.length,
    }

    setHistory(prev => [entry, ...prev].slice(0, MAX_HISTORY))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return { history, addDetection, clearHistory }
}
