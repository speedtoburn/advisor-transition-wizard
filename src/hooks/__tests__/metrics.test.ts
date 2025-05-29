import { renderHook, act } from '@testing-library/react'
import { useTransitionMetrics } from '../metrics'

describe('useTransitionMetrics', () => {
  let localStorageMock: { [key: string]: string }

  beforeEach(() => {
    localStorageMock = {}
    
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
  })

  it('should add a new run duration', () => {
    const { result } = renderHook(() => useTransitionMetrics())
    
    act(() => {
      result.current.addRun(5000) // 5 seconds in ms
    })
    
    const stored = JSON.parse(localStorageMock['runs'])
    expect(stored).toEqual([5000])
  })

  it('should calculate stats correctly', () => {
    const { result } = renderHook(() => useTransitionMetrics())
    
    // Add multiple runs: 5s, 7s, 3s
    act(() => {
      result.current.addRun(5000)
      result.current.addRun(7000)
      result.current.addRun(3000)
    })
    
    const stats = result.current.getStats()
    expect(stats).toEqual({
      runCount: 3,
      averageTime: 5.0, // (5 + 7 + 3) / 3 = 5.0 seconds
      fastestRun: 3.0,
      slowestRun: 7.0
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
      result.current.addRun(5000)
      result.current.clearStats()
    })
    
    const stats = result.current.getStats()
    expect(stats.runCount).toBe(0)
  })

  it('should handle invalid localStorage data', () => {
    localStorageMock['runs'] = 'invalid json'
    
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
