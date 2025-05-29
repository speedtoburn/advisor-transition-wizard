'use client'

import { useState, useEffect } from 'react'
import StepPage from '@/components/wizard/StepPage'
import { useWizardStore } from '@/store/wizardStore'

export default function LOIPage() {
  const { updateFormData } = useWizardStore()
  const [formState, setFormState] = useState({
    firmName: '',
    advisorName: '',
    aum: '',
    targetDate: ''
  })

  useEffect(() => {
    // Only start timing if there isn't already a timer running
    if (typeof window !== 'undefined' && !sessionStorage.getItem('transitionStartTime')) {
      const startTime = performance.now()
      sessionStorage.setItem('transitionStartTime', startTime.toString())
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
    updateFormData({ [name]: value })
  }

  return (
    <StepPage
      title="Letter of Intent"
      description="Please provide your initial transition information"
    >
      <form className="space-y-6">
        <div>
          <label htmlFor="firmName" className="block text-sm font-medium text-zinc-900">
            Firm Name
          </label>
          <input
            type="text"
            name="firmName"
            id="firmName"
            value={formState.firmName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="advisorName" className="block text-sm font-medium text-zinc-900">
            Advisor Name
          </label>
          <input
            type="text"
            name="advisorName"
            id="advisorName"
            value={formState.advisorName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="aum" className="block text-sm font-medium text-zinc-900">
            Assets Under Management
          </label>
          <input
            type="text"
            name="aum"
            id="aum"
            value={formState.aum}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="targetDate" className="block text-sm font-medium text-zinc-900">
            Target Transition Date
          </label>
          <input
            type="date"
            name="targetDate"
            id="targetDate"
            value={formState.targetDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </form>
    </StepPage>
  )
}
