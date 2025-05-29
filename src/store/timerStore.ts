'use client'

import { create } from 'zustand'

interface TimerState {
  startTime: number | null
  completedRuns: number[]
  startTimer: () => void
  stopTimer: () => void
  getStats: () => { runCount: number; averageTime: number; fastestRun: number; slowestRun: number }
  clearStats: () => void
}

export const useTimerStore = create<TimerState>()((set, get) => ({
  startTime: null,
  completedRuns: [],

  startTimer: () => {
    const startTime = Date.now()
    console.log('Starting timer:', startTime)
    set({ startTime })
  },

  stopTimer: () => {
    const { startTime, completedRuns } = get()
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

    set({
      startTime: null,
      completedRuns: [...completedRuns, duration]
    })
  },

  getStats: () => {
    const { completedRuns } = get()

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
  },

  clearStats: () => set({ completedRuns: [], startTime: null })
}))
