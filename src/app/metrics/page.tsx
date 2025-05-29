'use client'

import { useTransitionMetrics } from '@/hooks/metrics'

export default function MetricsPage() {
  const { getStats } = useTransitionMetrics()
  const stats = getStats()

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-6">
              Transition Metrics
            </h2>
            
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="px-4 py-5 bg-zinc-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-zinc-500 truncate">
                  Total Transitions
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-zinc-900">
                  {stats.runCount}
                </dd>
              </div>

              <div className="px-4 py-5 bg-zinc-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-zinc-500 truncate">
                  Average Time
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-zinc-900">
                  {stats.averageTime}s
                </dd>
              </div>

              <div className="px-4 py-5 bg-zinc-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-zinc-500 truncate">
                  Fastest Run
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-zinc-900">
                  {stats.fastestRun}s
                </dd>
              </div>

              <div className="px-4 py-5 bg-zinc-50 shadow rounded-lg overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-zinc-500 truncate">
                  Slowest Run
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-zinc-900">
                  {stats.slowestRun}s
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
