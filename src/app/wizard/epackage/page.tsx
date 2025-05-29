'use client'

import StepPage from '@/components/wizard/StepPage'
import { useWizardStore } from '@/store/wizardStore'
import { useState } from 'react'

const DOCUMENT_TYPES = [
  { id: 'acat', name: 'ACAT Form', required: true },
  { id: 'clientAgreement', name: 'Client Agreement', required: true },
  { id: 'disclosures', name: 'Disclosures', required: true },
  { id: 'investmentPolicy', name: 'Investment Policy Statement', required: false },
  { id: 'powerOfAttorney', name: 'Power of Attorney', required: false }
]

export default function EPackagePage() {
  const { updateFormData } = useWizardStore()
  const [selectedDocs, setSelectedDocs] = useState<string[]>(['acat', 'clientAgreement', 'disclosures'])

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocs(prev => {
      const newSelection = prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
      
      updateFormData({ selectedDocuments: newSelection })
      return newSelection
    })
  }

  return (
    <StepPage
      title="e-Package Builder"
      description="Select the documents to include in your transition package"
    >
      <div className="space-y-4">
        {DOCUMENT_TYPES.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-zinc-200"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={doc.id}
                checked={selectedDocs.includes(doc.id)}
                onChange={() => handleDocumentToggle(doc.id)}
                disabled={doc.required}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
              />
              <label
                htmlFor={doc.id}
                className="ml-3 text-sm font-medium text-zinc-900"
              >
                {doc.name}
                {doc.required && (
                  <span className="ml-2 text-xs font-normal text-red-500">
                    Required
                  </span>
                )}
              </label>
            </div>
          </div>
        ))}

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Document Package Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Selected documents: {selectedDocs.length}</p>
                <p className="mt-1">
                  Required documents will be automatically included in your package.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StepPage>
  )
}
