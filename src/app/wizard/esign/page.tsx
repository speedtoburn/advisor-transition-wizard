'use client'

import StepPage from '@/components/wizard/StepPage'
import { useWizardStore } from '@/store/wizardStore'
import { useState } from 'react'

export default function ESignPage() {
  const { updateFormData } = useWizardStore()
  const [signatureInfo, setSignatureInfo] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    acknowledgement: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setSignatureInfo(prev => ({ ...prev, [name]: newValue }))
    updateFormData({ signatureInfo: { ...signatureInfo, [name]: newValue } })
  }

  return (
    <StepPage
      title="Electronic Signature"
      description="Please provide your signature information for document processing"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-900">
            Full Legal Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={signatureInfo.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-900">
            Title/Position
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={signatureInfo.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-900">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={signatureInfo.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-900">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={signatureInfo.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              name="acknowledgement"
              id="acknowledgement"
              checked={signatureInfo.acknowledgement}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
              required
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="acknowledgement" className="font-medium text-zinc-900">
              Electronic Signature Acknowledgement
            </label>
            <p className="text-zinc-500">
              I understand that checking this box constitutes a legal signature
              confirming that I acknowledge and agree to the terms above.
            </p>
          </div>
        </div>
      </div>
    </StepPage>
  )
}
