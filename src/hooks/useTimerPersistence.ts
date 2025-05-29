'use client'

import { useCallback } from 'react'
import { useWizardStore } from '../store/wizardStore'

const TIMER_KEY = 'advisor_transition_timer'

const safeStorage = {
  getItem: () => {
    try {
      if (typeof window === 'undefined') return null
      return sessionStorage.getItem(TIMER_KEY)
    } catch (error) {
      console.error('Failed to get timer from storage:', error)
      return null
    }
  },
  setItem: (value: string) => {
    try {
      if (typeof window === 'undefined') return
      sessionStorage.setItem(TIMER_KEY, value)
    } catch (error) {
      console.error('Failed to save timer to storage:', error)
    }
  },
  removeItem: () => {
    try {
      if (typeof window === 'undefined') return
      sessionStorage.removeItem(TIMER_KEY)
    } catch (error) {
      console.error('Failed to remove timer from storage:', error)
    }
  }
}

export function useTimerPersistence() {
  const { startTimer: storeStartTimer, stopTimer: storeStopTimer } = useWizardStore()

  const startTimer = useCallback(() => {
    const startTime = Date.now()
    safeStorage.setItem(startTime.toString())
    console.log('Timer started with time:', startTime)
    storeStartTimer()
  }, [storeStartTimer])

  const stopTimer = useCallback(() => {
    const startTimeStr = safeStorage.getItem()
    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10)
      const endTime = Date.now()
      const duration = endTime - startTime
      console.log('Timer completed:', {
        startTime,
        endTime,
        duration,
        durationInSeconds: duration / 1000
      })
      safeStorage.removeItem()
      storeStopTimer()
    } else {
      console.log('No start time found in storage')
    }
  }, [storeStopTimer])

  return {
    startTimer,
    stopTimer
  }
}
