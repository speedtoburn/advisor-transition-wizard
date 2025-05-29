'use client'

import { useCallback } from 'react'

interface TransitionStats {
  runCount: number
  averageTime: number
  fastestRun: number
  slowestRun: number
}

const defaultStats: TransitionStats = {
  runCount: 0,
  averageTime: 0,
  fastestRun: 0,
  slowestRun: 0
}

export function useTransitionMetrics() {
  const getLocalStorage = () => {
    try {
      return window.localStorage
    } catch {
      return null
    }
  }

  const addRun = useCallback((duration: number) => {
    const storage = getLocalStorage()
    if (!storage) return

    try {
      const runs = JSON.parse(storage.getItem('runs') || '[]') as number[]
      runs.push(duration)
      storage.setItem('runs', JSON.stringify(runs))
    } catch (error) {
      console.error('Failed to save run duration:', error)
    }
  }, [])

  const getStats = useCallback((): TransitionStats => {
    const storage = getLocalStorage()
    if (!storage) return defaultStats

    try {
      const runs = JSON.parse(storage.getItem('runs') || '[]') as number[]
      
      if (runs.length === 0) return defaultStats

      const runCount = runs.length
      const averageTime = runs.reduce((sum, time) => sum + time, 0) / runCount
      const fastestRun = Math.min(...runs)
      const slowestRun = Math.max(...runs)

      return {
        runCount,
        averageTime: Number((averageTime / 1000).toFixed(1)), // Convert to seconds with 1 decimal
        fastestRun: Number((fastestRun / 1000).toFixed(1)),
        slowestRun: Number((slowestRun / 1000).toFixed(1))
      }
    } catch (error) {
      console.error('Failed to get transition stats:', error)
      return defaultStats
    }
  }, [])

  const clearStats = useCallback(() => {
    const storage = getLocalStorage()
    if (!storage) return

    try {
      storage.removeItem('runs')
    } catch (error) {
      console.error('Failed to clear stats:', error)
    }
  }, [])

  return {
    addRun,
    getStats,
    clearStats
  }
}
