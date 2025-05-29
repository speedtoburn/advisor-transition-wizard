'use client'

import { useWizardStore } from '@/store/wizardStore'

export interface Field {
  label: string
  name: string
  type: string
  required?: boolean
}

interface StepPageProps {
  title: string
  description: string
  fields?: Field[]
  children?: React.ReactNode
}

export default function StepPage({ title, description, fields, children }: StepPageProps) {
  const { nextStep } = useWizardStore()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
        <p className="mt-2 text-sm text-zinc-600">{description}</p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-zinc-900/5 rounded-lg p-6">
        {fields ? (
          <form className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-zinc-700">
                  {field.label}
                </label>
                <div className="mt-1">
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    required={field.required}
                    className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </form>
        ) : children}
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
