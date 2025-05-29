'use client'

import StepPage from '@/components/wizard/StepPage'
import { useWizardStore } from '@/store/wizardStore'
import { useState } from 'react'

const TEMPLATE_OPTIONS = [
  { id: 'standard', name: 'Standard Template', description: 'Basic transition package for individual advisors' },
  { id: 'team', name: 'Team Template', description: 'Customized for advisor teams with multiple members' },
  { id: 'enterprise', name: 'Enterprise Template', description: 'Full-service package for large organizations' }
]

export default function TemplatesPage() {
  const { updateFormData } = useWizardStore()
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    updateFormData({ selectedTemplate: templateId })
  }

  return (
    <StepPage
      title="Select Template"
      description="Choose the template that best fits your transition needs"
    >
      <div className="space-y-4">
        {TEMPLATE_OPTIONS.map((template) => (
          <div
            key={template.id}
            className={`relative flex items-start p-4 cursor-pointer rounded-lg border ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-zinc-200 hover:border-zinc-300'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="template"
                  value={template.id}
                  checked={selectedTemplate === template.id}
                  onChange={() => handleTemplateSelect(template.id)}
                  className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-600"
                />
                <label
                  htmlFor={template.id}
                  className="ml-3 font-medium text-zinc-900"
                >
                  {template.name}
                </label>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {template.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </StepPage>
  )
}
