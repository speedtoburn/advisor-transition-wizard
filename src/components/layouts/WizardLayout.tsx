'use client'

import { useWizardStore, WizardStep } from '../../store/wizardStore'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'loi', label: 'LOI' },
  { id: 'templates', label: 'Templates' },
  { id: 'epackage', label: 'e-Package' },
  { id: 'esign', label: 'e-Sign' },
  { id: 'custodian', label: 'Custodian' },
  { id: 'compliance', label: 'Compliance' }
]

const STORAGE_KEY = 'wizard-timer'

export default function WizardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { currentStep, stepIndex, formData } = useWizardStore()
  const [isDebugOpen, setIsDebugOpen] = useState(false)
  const pathname = usePathname()

  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null)
  const [completedRuns, setCompletedRuns] = useState<number[]>([])

  // Load timer state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const { startTime, completedRuns } = JSON.parse(savedState)
        setStartTime(startTime)
        setCompletedRuns(completedRuns)
      }
    }
  }, [])

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime, completedRuns }))
    }
  }, [startTime, completedRuns])

  // Handle timer start
  useEffect(() => {
    if (pathname === '/wizard/loi') {
      const time = Date.now()
      console.log('Starting timer on LOI page:', time)
      setStartTime(time)
    }
  }, [pathname])

  // Handle timer stop
  useEffect(() => {
    if (pathname === '/wizard/complete' && startTime) {
      console.log('Stopping timer on complete page')
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
    }
  }, [pathname, startTime])

  const getStats = () => {
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
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-semibold text-zinc-900">Advisor Transition</h1>
              <button
                onClick={() => setIsDebugOpen(!isDebugOpen)}
                className="text-sm text-zinc-500 hover:text-zinc-700"
              >
                {isDebugOpen ? 'Hide' : 'Show'} Debug
              </button>
            </div>
            <div className="flex gap-2">
              {STEPS.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex-1"
                >
                  <div className="flex items-center">
                    <div
                      className={`h-2 flex-1 rounded-full ${
                        idx <= stepIndex
                          ? 'bg-blue-600'
                          : 'bg-zinc-200'
                      }`}
                    />
                  </div>
                  <span className={`mt-2 block text-xs ${
                    idx <= stepIndex
                      ? 'text-blue-600 font-medium'
                      : 'text-zinc-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Debug Panel */}
      {isDebugOpen && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l shadow-lg p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Debug Info</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-500">Current Step</h3>
              <p className="mt-1 text-sm">{currentStep}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-500">Step Index</h3>
              <p className="mt-1 text-sm">{stepIndex}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-500">Form Data</h3>
              <pre className="mt-1 text-xs bg-zinc-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-500">Timer Stats</h3>
              <pre className="mt-1 text-xs bg-zinc-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(getStats(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
