'use client'

import { useEffect } from 'react'
import { useTransitionTimer } from '@/hooks/useTransitionTimer'
import StepPage from '@/components/wizard/StepPage'
import Confetti from '@/components/wizard/Confetti'

export default function CompletePage() {
  const { stopTimer, getStats } = useTransitionTimer()

  useEffect(() => {
    const duration = stopTimer()
    if (duration) {
      console.log(`Wizard completed in ${duration / 1000} seconds`)
    }
  }, [stopTimer])

  const stats = getStats()

  return (
    <>
      <Confetti />
      <StepPage
        title="Transition Complete!"
        description="Your advisor transition package has been successfully prepared."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-zinc-50 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-500">Advisor Name</h3>
              <p className="mt-1 text-lg font-semibold text-zinc-900">N/A</p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-500">Firm Name</h3>
              <p className="mt-1 text-lg font-semibold text-zinc-900">N/A</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={() => window.location.href = '/metrics'}
            >
              View Metrics
            </button>
            <button
              type="button"
              className="flex-1 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50"
            >
              Download Summary →
            </button>
          </div>

          {stats.runCount > 0 && (
            <div className="mt-6 p-4 bg-zinc-50 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-500 mb-2">Completion Stats</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-zinc-500">Total Runs</dt>
                  <dd className="font-medium text-zinc-900">{stats.runCount}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Average Time</dt>
                  <dd className="font-medium text-zinc-900">{stats.averageTime}s</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Fastest Run</dt>
                  <dd className="font-medium text-zinc-900">{stats.fastestRun}s</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Slowest Run</dt>
                  <dd className="font-medium text-zinc-900">{stats.slowestRun}s</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </StepPage>
    </>
  )
}
