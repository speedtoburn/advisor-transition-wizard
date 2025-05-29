'use client'

import { useWizardStore } from '@/store/wizardStore'

interface StepPageProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function StepPage({ title, description, children }: StepPageProps) {
  const { nextStep } = useWizardStore()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
        <p className="mt-2 text-sm text-zinc-600">{description}</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-zinc-900/5 rounded-lg p-6">
        {children}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={nextStep}
          className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
