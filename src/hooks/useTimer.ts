'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'wizard-timer'

interface TimerState {
  startTime: number | null
  completedRuns: number[]
}

interface TimerStats {
  runCount: number
  averageTime: number
  fastestRun: number
  slowestRun: number
}

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    startTime: null,
    completedRuns: []
  })

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        setState(JSON.parse(savedState))
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state])

  const startTimer = () => {
    const time = Date.now()
    console.log('Starting timer:', time)
    setState(prev => ({ ...prev, startTime: time }))
  }

  const stopTimer = () => {
    if (!state.startTime) {
      console.log('No timer start time found')
      return
    }

    const endTime = Date.now()
    const duration = endTime - state.startTime

    console.log('Timer completed:', {
      startTime: state.startTime,
      endTime,
      duration,
      durationInSeconds: duration / 1000
    })

    setState(prev => ({
      startTime: null,
      completedRuns: [...prev.completedRuns, duration]
    }))
  }

  const getStats = (): TimerStats => {
    if (state.completedRuns.length === 0) {
      return {
        runCount: 0,
        averageTime: 0,
        fastestRun: 0,
        slowestRun: 0
      }
    }

    return {
      runCount: state.completedRuns.length,
      averageTime: Number((state.completedRuns.reduce((sum, time) => sum + time, 0) / state.completedRuns.length / 1000).toFixed(1)),
      fastestRun: Number((Math.min(...state.completedRuns) / 1000).toFixed(1)),
      slowestRun: Number((Math.max(...state.completedRuns) / 1000).toFixed(1))
    }
  }

  const clearStats = () => {
    setState({ startTime: null, completedRuns: [] })
  }

  return {
    startTime: state.startTime,
    completedRuns: state.completedRuns,
    startTimer,
    stopTimer,
    getStats,
    clearStats
  }
}
