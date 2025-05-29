'use client'

const SESSION_KEY = 'wizard:start'
const STORAGE_KEY = 'wizard:runs'

interface TimerStats {
  runCount: number
  averageTime: number
  fastestRun: number
  slowestRun: number
}

export function useTransitionTimer() {
  const startTimer = () => {
    if (typeof window !== 'undefined') {
      const startTime = Date.now()
      sessionStorage.setItem(SESSION_KEY, startTime.toString())
      console.log('Timer started:', startTime)
    }
  }

  const stopTimer = () => {
    if (typeof window !== 'undefined') {
      const startTimeStr = sessionStorage.getItem(SESSION_KEY)
      if (!startTimeStr) {
        console.log('No start time found')
        return
      }

      const startTime = parseInt(startTimeStr, 10)
      const endTime = Date.now()
      const duration = endTime - startTime

      // Clear the session start time
      sessionStorage.removeItem(SESSION_KEY)

      // Get existing runs from localStorage
      const existingRunsStr = localStorage.getItem(STORAGE_KEY)
      const existingRuns = existingRunsStr ? JSON.parse(existingRunsStr) : []

      // Add new run duration
      const updatedRuns = [...existingRuns, duration]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRuns))

      console.log('Timer completed:', {
        startTime,
        endTime,
        duration,
        durationInSeconds: duration / 1000
      })

      return duration
    }
  }

  const getStats = (): TimerStats => {
    if (typeof window === 'undefined') {
      return {
        runCount: 0,
        averageTime: 0,
        fastestRun: 0,
        slowestRun: 0
      }
    }

    const runsStr = localStorage.getItem(STORAGE_KEY)
    const runs = runsStr ? JSON.parse(runsStr) : []

    if (runs.length === 0) {
      return {
        runCount: 0,
        averageTime: 0,
        fastestRun: 0,
        slowestRun: 0
      }
    }

    return {
      runCount: runs.length,
      averageTime: Number((runs.reduce((sum: number, time: number) => sum + time, 0) / runs.length / 1000).toFixed(1)),
      fastestRun: Number((Math.min(...runs) / 1000).toFixed(1)),
      slowestRun: Number((Math.max(...runs) / 1000).toFixed(1))
    }
  }

  const clearStats = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    startTimer,
    stopTimer,
    getStats,
    clearStats
  }
}
