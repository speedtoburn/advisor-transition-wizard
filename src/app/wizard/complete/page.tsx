'use client'

import { useEffect } from 'react'
import { useWizardStore } from '@/store/wizardStore'
import { useTransitionMetrics } from '@/hooks/metrics'
import StepPage from '@/components/wizard/StepPage'
import Confetti from '@/components/wizard/Confetti'

interface FormData {
  advisorName?: string
  firmName?: string
}

export default function CompletePage() {
  const { formData } = useWizardStore() as { formData: FormData }
  const { addRun } = useTransitionMetrics()

  useEffect(() => {
    // Only process the timer if we're in the browser
    if (typeof window !== 'undefined') {
      const startTimeStr = sessionStorage.getItem('transitionStartTime')
      if (startTimeStr) {
        const startTime = parseFloat(startTimeStr)
        const endTime = performance.now()
        const duration = endTime - startTime

        // Add the run duration to metrics
        addRun(duration)
        
        // Clear the start time
        sessionStorage.removeItem('transitionStartTime')
      }
    }
  }, [addRun])

  return (
    <StepPage
      title="Transition Complete!"
      description="Your advisor transition package has been successfully prepared."
    >
      <>
        <Confetti />
        <div className="mt-8 space-y-6">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg bg-white px-6 py-8 shadow">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Advisor Name
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {formData?.advisorName || 'N/A'}
              </dd>
            </div>
            <div className="rounded-lg bg-white px-6 py-8 shadow">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Firm Name
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {formData?.firmName || 'N/A'}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex items-center justify-center gap-x-6">
            <a
              href="/dashboard"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Go to Dashboard
            </a>
            <button
              onClick={() => window.print()}
              className="text-sm font-semibold leading-6 text-zinc-900"
            >
              Download Summary <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </>
    </StepPage>
  )
}
