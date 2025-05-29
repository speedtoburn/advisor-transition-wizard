import { renderHook, act } from '@testing-library/react'
import { useTransitionMetrics } from '../metrics'

describe('useTransitionMetrics', () => {
  let localStorageMock: { [key: string]: string }
  let performanceNowMock: number

  beforeEach(() => {
    localStorageMock = {}
    performanceNowMock = 0
    
    global.window = Object.create(window)
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key],
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value
        },
        removeItem: (key: string) => {
          delete localStorageMock[key]
        }
      },
      writable: true
    })

    // Mock performance.now()
    global.performance = {
      ...global.performance,
      now: () => {
        performanceNowMock += 1000 // Increment by 1 second each call
        return performanceNowMock
      }
    }
  })

  it('should record a complete run', () => {
    const { result } = renderHook(() => useTransitionMetrics())
    
    act(() => {
      result.current.startTimer() // First call to performance.now() = 1000
      result.current.stopTimer()  // Second call to performance.now() = 2000
    })
    
    const stored = JSON.parse(localStorageMock['transition_runs'])
    expect(stored).toEqual([1000]) // 2000 - 1000 = 1000ms duration
  })

  it('should calculate stats correctly', () => {
    const { result } = renderHook(() => useTransitionMetrics())
    
    // Record multiple runs
    act(() => {
      // First run: 1000ms
      result.current.startTimer()
      result.current.stopTimer()
      
      // Second run: 1000ms
      result.current.startTimer()
      result.current.stopTimer()
      
      // Third run: 1000ms
      result.current.startTimer()
      result.current.stopTimer()
    })
    
    const stats = result.current.getStats()
    expect(stats).toEqual({
      runCount: 3,
      averageTime: 1.0, // 1 second average
      fastestRun: 1.0,
      slowestRun: 1.0
    })
  })

  it('should handle empty runs', () => {
    const { result } = renderHook(() => useTransitionMetrics())
    const stats = result.current.getStats()
    
    expect(stats).toEqual({
      runCount: 0,
      averageTime: 0,
      fastestRun: 0,
      slowestRun: 0
    })
  })

  it('should clear stats', () => {
    const { result } = renderHook(() => useTransitionMetrics())
    
    act(() => {
      result.current.startTimer()
      result.current.stopTimer()
      result.current.clearStats()
    })
    
    const stats = result.current.getStats()
    expect(stats.runCount).toBe(0)
  })

  it('should handle invalid localStorage data', () => {
    localStorageMock['transition_runs'] = 'invalid json'
    
    const { result } = renderHook(() => useTransitionMetrics())
    const stats = result.current.getStats()
    
    expect(stats).toEqual({
      runCount: 0,
      averageTime: 0,
      fastestRun: 0,
      slowestRun: 0
    })
  })
})
