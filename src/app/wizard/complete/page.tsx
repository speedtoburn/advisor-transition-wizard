'use client'

import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWizardStore } from '@/store/wizardStore'

export default function CompletePage() {
  const [showConfetti, setShowConfetti] = useState(true)
  const { formData } = useWizardStore()

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <div className="text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Transition Complete!
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Your advisor transition package has been successfully prepared.
            Our team will contact you shortly to begin the transition process.
          </p>

          <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg bg-white px-6 py-8 shadow-sm ring-1 ring-zinc-900/5">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Advisor Name
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {(formData.advisorName as string) || 'N/A'}
              </dd>
            </div>
            <div className="rounded-lg bg-white px-6 py-8 shadow-sm ring-1 ring-zinc-900/5">
              <dt className="text-sm font-semibold leading-6 text-zinc-600">
                Firm Name
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                {(formData.firmName as string) || 'N/A'}
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/dashboard"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Go to Dashboard
            </a>
            <a
              href="#"
              onClick={() => window.print()}
              className="text-sm font-semibold leading-6 text-zinc-900"
            >
              Download Summary <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
