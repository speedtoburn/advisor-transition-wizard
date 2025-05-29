'use client'

import { useTransitionTimer } from '@/hooks/useTransitionTimer'

export default function MetricsPage() {
  const { getStats, clearStats } = useTransitionTimer()
  const stats = getStats()

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Transition Metrics
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Performance statistics for your advisor transitions
          </p>
        </div>

        <div className="mt-12">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white px-6 py-8 shadow">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Total Transitions
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {stats.runCount}
              </dd>
            </div>

            <div className="rounded-lg bg-white px-6 py-8 shadow">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Average Time
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {stats.averageTime}s
              </dd>
            </div>

            <div className="rounded-lg bg-white px-6 py-8 shadow">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Fastest Run
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {stats.fastestRun}s
              </dd>
            </div>

            <div className="rounded-lg bg-white px-6 py-8 shadow">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Slowest Run
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {stats.slowestRun}s
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex justify-center">
            <button
              onClick={clearStats}
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Clear Statistics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
