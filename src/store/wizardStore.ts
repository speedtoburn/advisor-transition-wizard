import { create } from 'zustand'

export type WizardStep = 'loi' | 'templates' | 'epackage' | 'esign' | 'custodian' | 'compliance' | 'complete'

interface WizardState {
  currentStep: WizardStep
  stepIndex: number
  formData: Record<string, unknown>
  statusByStep: Record<WizardStep, string>
  transferId?: string
  setStep: (step: WizardStep) => void
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: Record<string, unknown>) => void
  updateStatus: (step: WizardStep, status: string) => void
  setTransferId: (id: string) => void
}

const STEP_ORDER: WizardStep[] = ['loi', 'templates', 'epackage', 'esign', 'custodian', 'compliance', 'complete']

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 'loi',
  stepIndex: 0,
  formData: {},
  statusByStep: {
    loi: '',
    templates: '',
    epackage: '',
    esign: '',
    custodian: '',
    compliance: '',
    complete: ''
  },
  transferId: undefined,
  
  setStep: (step) => set({ 
    currentStep: step,
    stepIndex: STEP_ORDER.indexOf(step)
  }),
  
  nextStep: () => set((state) => {
    const nextIndex = Math.min(state.stepIndex + 1, STEP_ORDER.length - 1)
    return {
      currentStep: STEP_ORDER[nextIndex],
      stepIndex: nextIndex
    }
  }),
  
  previousStep: () => set((state) => {
    const prevIndex = Math.max(state.stepIndex - 1, 0)
    return {
      currentStep: STEP_ORDER[prevIndex],
      stepIndex: prevIndex
    }
  }),
  
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  updateStatus: (step, status) => set((state) => ({
    statusByStep: { ...state.statusByStep, [step]: status }
  })),

  setTransferId: (id) => set({ transferId: id })
}))
