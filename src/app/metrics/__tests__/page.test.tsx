import { render, screen } from '@testing-library/react'
import MetricsPage from '../page'

describe('MetricsPage', () => {
  let localStorageMock: { [key: string]: string }

  beforeEach(() => {
    localStorageMock = {}
    
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

  it('renders empty stats correctly', () => {
    render(<MetricsPage />)
    
    expect(screen.getByText('Total Transitions')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('0s')).toBeInTheDocument()
  })

  it('renders stats with data correctly', () => {
    // Mock some transition runs
    localStorageMock['runs'] = JSON.stringify([5000, 7000, 3000])
    
    render(<MetricsPage />)
    
    expect(screen.getByText('3')).toBeInTheDocument() // Total runs
    expect(screen.getByText('5.0s')).toBeInTheDocument() // Average time
    expect(screen.getByText('3.0s')).toBeInTheDocument() // Fastest run
    expect(screen.getByText('7.0s')).toBeInTheDocument() // Slowest run
  })

  it('handles invalid localStorage data gracefully', () => {
    localStorageMock['runs'] = 'invalid json'
    
    render(<MetricsPage />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getAllByText('0s').length).toBeGreaterThan(0)
  })
})
