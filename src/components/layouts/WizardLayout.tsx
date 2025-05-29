'use client'

import { useWizardStore, WizardStep } from '@/store/wizardStore'
import { useState } from 'react'

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'loi', label: 'LOI' },
  { id: 'templates', label: 'Templates' },
  { id: 'epackage', label: 'e-Package' },
  { id: 'esign', label: 'e-Sign' },
  { id: 'custodian', label: 'Custodian' },
  { id: 'compliance', label: 'Compliance' }
]

export default function WizardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { currentStep, stepIndex, formData } = useWizardStore()
  const [isDebugOpen, setIsDebugOpen] = useState(false)

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
          </div>
        </div>
      )}
    </div>
  )
}
