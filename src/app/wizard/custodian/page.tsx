'use client'

import StepPage from '@/components/wizard/StepPage'
import { useWizardStore } from '@/store/wizardStore'
import { useState } from 'react'

const CUSTODIANS = [
  {
    id: 'fidelity',
    name: 'Fidelity',
    description: 'Comprehensive platform with advanced trading capabilities'
  },
  {
    id: 'schwab',
    name: 'Charles Schwab',
    description: 'Full-service custodian with extensive research tools'
  },
  {
    id: 'td',
    name: 'TD Ameritrade',
    description: 'Robust technology and competitive pricing'
  },
  {
    id: 'pershing',
    name: 'Pershing',
    description: 'Global custodian with institutional focus'
  }
]

export default function CustodianPage() {
  const { updateFormData } = useWizardStore()
  const [selectedCustodian, setSelectedCustodian] = useState('')
  const [accountTypes, setAccountTypes] = useState({
    individual: false,
    joint: false,
    ira: false,
    roth: false,
    trust: false,
    corporate: false
  })

  const handleCustodianSelect = (custodianId: string) => {
    setSelectedCustodian(custodianId)
    updateFormData({ 
      custodian: custodianId,
      accountTypes: Object.entries(accountTypes)
        .filter(([, isSelected]) => isSelected)
        .map(([type]) => type)
    })
  }

  const handleAccountTypeToggle = (type: keyof typeof accountTypes) => {
    setAccountTypes(prev => {
      const updated = { ...prev, [type]: !prev[type] }
      updateFormData({
        custodian: selectedCustodian,
        accountTypes: Object.entries(updated)
          .filter(([, isSelected]) => isSelected)
          .map(([type]) => type)
      })
      return updated
    })
  }

  return (
    <StepPage
      title="Custodian Selection"
      description="Select your preferred custodian and account types"
    >
      <div className="space-y-8">
        {/* Custodian Selection */}
        <div>
          <h3 className="text-sm font-medium text-zinc-900 mb-4">
            Choose Custodian
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CUSTODIANS.map((custodian) => (
              <div
                key={custodian.id}
                className={`relative flex cursor-pointer rounded-lg border p-4 ${
                  selectedCustodian === custodian.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-zinc-200'
                }`}
                onClick={() => handleCustodianSelect(custodian.id)}
              >
                <div className="flex flex-1">
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-zinc-900">
                      {custodian.name}
                    </span>
                    <span className="mt-1 flex text-sm text-zinc-500">
                      {custodian.description}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex h-7 items-center">
                  <input
                    type="radio"
                    name="custodian"
                    value={custodian.id}
                    checked={selectedCustodian === custodian.id}
                    onChange={() => handleCustodianSelect(custodian.id)}
                    className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Types */}
        <div>
          <h3 className="text-sm font-medium text-zinc-900 mb-4">
            Account Types to Transfer
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(accountTypes).map(([type, isChecked]) => (
              <div
                key={type}
                className="relative flex items-start"
              >
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAccountTypeToggle(type as keyof typeof accountTypes)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-zinc-900">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StepPage>
  )
}
