'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface TimerContextType {
  startTime: number | null
  completedRuns: number[]
  startTimer: () => void
  stopTimer: () => void
  getStats: () => { runCount: number; averageTime: number; fastestRun: number; slowestRun: number }
  clearStats: () => void
}

const TimerContext = createContext<TimerContextType | null>(null)

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [completedRuns, setCompletedRuns] = useState<number[]>([])

  const startTimer = useCallback(() => {
    const time = Date.now()
    console.log('Starting timer:', time)
    setStartTime(time)
  }, [])

  const stopTimer = useCallback(() => {
    if (!startTime) {
      console.log('No timer start time found')
      return
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log('Timer completed:', {
      startTime,
      endTime,
      duration,
      durationInSeconds: duration / 1000
    })

    setStartTime(null)
    setCompletedRuns(prev => [...prev, duration])
  }, [startTime])

  const getStats = useCallback(() => {
    if (completedRuns.length === 0) {
      return {
        runCount: 0,
        averageTime: 0,
        fastestRun: 0,
        slowestRun: 0
      }
    }

    return {
      runCount: completedRuns.length,
      averageTime: Number((completedRuns.reduce((sum, time) => sum + time, 0) / completedRuns.length / 1000).toFixed(1)),
      fastestRun: Number((Math.min(...completedRuns) / 1000).toFixed(1)),
      slowestRun: Number((Math.max(...completedRuns) / 1000).toFixed(1))
    }
  }, [completedRuns])

  const clearStats = useCallback(() => {
    setStartTime(null)
    setCompletedRuns([])
  }, [])

  return (
    <TimerContext.Provider value={{
      startTime,
      completedRuns,
      startTimer,
      stopTimer,
      getStats,
      clearStats
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
