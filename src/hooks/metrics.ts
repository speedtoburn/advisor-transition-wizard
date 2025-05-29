'use client'

import { useCallback } from 'react'

interface TransitionStats {
  runCount: number
  averageTime: number
  fastestRun: number
  slowestRun: number
}

const STORAGE_KEYS = {
  RUNS: 'advisor_transition_runs',
  START_TIME: 'advisor_transition_start_time'
}

const defaultStats: TransitionStats = {
  runCount: 0,
  averageTime: 0,
  fastestRun: 0,
  slowestRun: 0
}

export function useTransitionMetrics() {
  const safeStorage = {
    get: (key: string): string | null => {
      if (typeof window === 'undefined') return null
      try {
        return window.localStorage.getItem(key)
      } catch (error) {
        console.error(`Failed to get ${key} from storage:`, error)
        return null
      }
    },
    set: (key: string, value: string): void => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(key, value)
        // Verify the value was set correctly
        const stored = window.localStorage.getItem(key)
        if (stored !== value) {
          console.error(`Storage verification failed for ${key}`)
        }
      } catch (error) {
        console.error(`Failed to save ${key} to storage:`, error)
      }
    },
    remove: (key: string): void => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.removeItem(key)
      } catch (error) {
        console.error(`Failed to remove ${key} from storage:`, error)
      }
    }
  }

  const startTimer = useCallback(() => {
    // Clear any existing timer first
    safeStorage.remove(STORAGE_KEYS.START_TIME)
    
    const startTime = performance.now()
    safeStorage.set(STORAGE_KEYS.START_TIME, startTime.toString())
    console.log('Timer started:', {
      time: startTime,
      stored: safeStorage.get(STORAGE_KEYS.START_TIME)
    })
  }, [])

  const stopTimer = useCallback(() => {
    const startTimeStr = safeStorage.get(STORAGE_KEYS.START_TIME)
    console.log('Retrieved start time:', startTimeStr)

    if (!startTimeStr) {
      console.log('No start time found')
      return
    }

    const startTime = parseFloat(startTimeStr)
    const endTime = performance.now()
    const duration = endTime - startTime

    console.log('Timer completed:', {
      startTime,
      endTime,
      duration,
      durationInSeconds: duration / 1000
    })

    // Get existing runs
    const runsStr = safeStorage.get(STORAGE_KEYS.RUNS)
    const runs = runsStr ? JSON.parse(runsStr) as number[] : []
    
    // Add new run
    runs.push(duration)
    safeStorage.set(STORAGE_KEYS.RUNS, JSON.stringify(runs))
    
    // Clear start time
    safeStorage.remove(STORAGE_KEYS.START_TIME)
    
    console.log('Run saved. Total runs:', runs.length)
  }, [])

  const getStats = useCallback((): TransitionStats => {
    const runsStr = safeStorage.get(STORAGE_KEYS.RUNS)
    if (!runsStr) return defaultStats

    try {
      const runs = JSON.parse(runsStr) as number[]
      if (runs.length === 0) return defaultStats

      const runCount = runs.length
      const averageTime = runs.reduce((sum, time) => sum + time, 0) / runCount
      const fastestRun = Math.min(...runs)
      const slowestRun = Math.max(...runs)

      return {
        runCount,
        averageTime: Number((averageTime / 1000).toFixed(1)),
        fastestRun: Number((fastestRun / 1000).toFixed(1)),
        slowestRun: Number((slowestRun / 1000).toFixed(1))
      }
    } catch (error) {
      console.error('Failed to calculate stats:', error)
      return defaultStats
    }
  }, [])

  const clearStats = useCallback(() => {
    safeStorage.remove(STORAGE_KEYS.RUNS)
    safeStorage.remove(STORAGE_KEYS.START_TIME)
  }, [])

  return {
    startTimer,
    stopTimer,
    getStats,
    clearStats
  }
}
