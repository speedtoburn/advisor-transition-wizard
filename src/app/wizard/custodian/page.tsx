'use client'

import StepPage from '@/components/wizard/StepPage'
import { useWizardStore } from '@/store/wizardStore'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const { updateFormData, updateStatus, setTransferId, setStep } = useWizardStore()
  const [selectedCustodian, setSelectedCustodian] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = () => {
    if (selectedCustodian && Object.values(accountTypes).some(v => v)) {
      setIsSubmitting(true)
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      const initiateCustodianTransfer = async () => {
        try {
          const response = await fetch('/api/custodian', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) throw new Error('Custodian API request failed')

          const data = await response.json()
          setTransferId(data.transferId)
          updateStatus('custodian', data.status)

          // Set up EventSource for status updates
          const eventSource = new EventSource(`/api/transfer/stream?transferId=${data.transferId}`)
          
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.status === 'complete') {
              eventSource.close()
              setStep('complete')
              router.push('/wizard/complete')
            }
          }

          return () => {
            eventSource.close()
          }
        } catch (error) {
          console.error('Error initiating custodian transfer:', error)
          setIsSubmitting(false)
        }
      }

      initiateCustodianTransfer()
    }
  }, [isSubmitting, updateStatus, setTransferId, setStep, router])

  return (
    <StepPage
      title="Custodian Selection"
      description="Select your preferred custodian and account types"
    >
      {!isSubmitting ? (
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

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={!selectedCustodian || !Object.values(accountTypes).some(v => v)}
              className="w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue with Transfer
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Please wait while we process your transfer request...
          </p>
        </div>
      )}
    </StepPage>
  )
}
