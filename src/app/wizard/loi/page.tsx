'use client'

import { useEffect } from 'react'
import { useTransitionTimer } from '@/hooks/useTransitionTimer'
import StepPage from '@/components/wizard/StepPage'

export default function LOIPage() {
  const { startTimer } = useTransitionTimer()

  useEffect(() => {
    startTimer()
  }, [startTimer])

  return (
    <StepPage
      title="Letter of Intent"
      description="Please provide your initial transition information"
      fields={[
        {
          label: 'Firm Name',
          name: 'firmName',
          type: 'text',
          required: true
        },
        {
          label: 'Advisor Name',
          name: 'advisorName',
          type: 'text',
          required: true
        },
        {
          label: 'Assets Under Management',
          name: 'aum',
          type: 'text',
          required: true
        },
        {
          label: 'Target Transition Date',
          name: 'transitionDate',
          type: 'date',
          required: true
        }
      ]}
    />
  )
}
