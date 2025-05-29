import { renderHook, act } from '@testing-library/react'
import { useTransitionTimer } from '../useTransitionTimer'

describe('useTransitionTimer', () => {
  let mockStorage: { [key: string]: string } = {}

  beforeEach(() => {
    mockStorage = {}
    
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value },
        removeItem: (key: string) => { delete mockStorage[key] }
      },
      writable: true
    })

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value },
        removeItem: (key: string) => { delete mockStorage[key] }
      },
      writable: true
    })

    // Mock Date.now()
    jest.spyOn(Date, 'now')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should start timer and store start time in sessionStorage', () => {
    const mockTime = 1000
    ;(Date.now as jest.Mock).mockReturnValue(mockTime)

    const { result } = renderHook(() => useTransitionTimer())
    
    act(() => {
      result.current.startTimer()
    })

    expect(mockStorage['wizard:start']).toBe(mockTime.toString())
  })

  it('should stop timer and store duration in localStorage', () => {
    const startTime = 1000
    const endTime = 5000
    const expectedDuration = endTime - startTime

    mockStorage['wizard:start'] = startTime.toString()
    ;(Date.now as jest.Mock).mockReturnValue(endTime)

    const { result } = renderHook(() => useTransitionTimer())
    
    act(() => {
      result.current.stopTimer()
    })

    const storedRuns = JSON.parse(mockStorage['wizard:runs'] || '[]')
    expect(storedRuns).toContain(expectedDuration)
    expect(mockStorage['wizard:start']).toBeUndefined()
  })

  it('should calculate correct stats', () => {
    const runs = [1000, 2000, 3000] // 1, 2, and 3 seconds
    mockStorage['wizard:runs'] = JSON.stringify(runs)

    const { result } = renderHook(() => useTransitionTimer())
    
    const stats = result.current.getStats()

    expect(stats).toEqual({
      runCount: 3,
      averageTime: 2.0,
      fastestRun: 1.0,
      slowestRun: 3.0
    })
  })

  it('should clear stats', () => {
    mockStorage['wizard:runs'] = JSON.stringify([1000, 2000])

    const { result } = renderHook(() => useTransitionTimer())
    
    act(() => {
      result.current.clearStats()
    })

    expect(mockStorage['wizard:runs']).toBeUndefined()
  })
})
