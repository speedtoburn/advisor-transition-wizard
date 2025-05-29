'use client'

import StepPage from '@/components/wizard/StepPage'
import { useWizardStore } from '@/store/wizardStore'
import { useState } from 'react'

const COMPLIANCE_CHECKS = [
  {
    id: 'kyc',
    title: 'Know Your Customer',
    description: 'Client identification and verification complete',
    required: true
  },
  {
    id: 'aml',
    title: 'Anti-Money Laundering',
    description: 'AML screening and risk assessment',
    required: true
  },
  {
    id: 'suitability',
    title: 'Investment Suitability',
    description: 'Client investment objectives and risk profile documented',
    required: true
  },
  {
    id: 'disclosures',
    title: 'Required Disclosures',
    description: 'All necessary disclosures provided and acknowledged',
    required: true
  },
  {
    id: 'licensing',
    title: 'Advisor Licensing',
    description: 'Advisor registrations and licenses verified',
    required: true
  }
]

export default function CompliancePage() {
  const { updateFormData } = useWizardStore()
  const [checks, setChecks] = useState<Record<string, boolean>>(
    COMPLIANCE_CHECKS.reduce((acc, check) => ({ ...acc, [check.id]: false }), {})
  )

  const handleCheckToggle = (checkId: string) => {
    setChecks(prev => {
      const updated = { ...prev, [checkId]: !prev[checkId] }
      updateFormData({ complianceChecks: updated })
      return updated
    })
  }

  const allChecksComplete = Object.values(checks).every(Boolean)

  return (
    <StepPage
      title="Compliance Check"
      description="Complete required compliance verifications before proceeding"
    >
      <div className="space-y-6">
        {COMPLIANCE_CHECKS.map((check) => (
          <div
            key={check.id}
            className={`rounded-lg border p-4 ${
              checks[check.id]
                ? 'border-green-500 bg-green-50'
                : 'border-zinc-200'
            }`}
          >
            <div className="flex items-start">
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  id={check.id}
                  checked={checks[check.id]}
                  onChange={() => handleCheckToggle(check.id)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor={check.id}
                  className="font-medium text-zinc-900"
                >
                  {check.title}
                  {check.required && (
                    <span className="ml-2 text-xs font-normal text-red-500">
                      Required
                    </span>
                  )}
                </label>
                <p className="text-sm text-zinc-500">
                  {check.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {!allChecksComplete && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Compliance Verification Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    All compliance checks must be completed before proceeding to the next step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {allChecksComplete && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  All Compliance Checks Complete
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    You have completed all required compliance verifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepPage>
  )
}
