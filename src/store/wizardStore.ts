'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type WizardStep = 'loi' | 'templates' | 'epackage' | 'esign' | 'custodian' | 'compliance' | 'complete'

interface WizardState {
  currentStep: WizardStep
  stepIndex: number
  formData: Record<string, unknown>
  statusByStep: Record<WizardStep, string>
  transferId?: string
  timerStartTime: number | null
  completedRuns: number[]
  setStep: (step: WizardStep) => void
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: Record<string, unknown>) => void
  updateStatus: (step: WizardStep, status: string) => void
  setTransferId: (id: string) => void
  startTimer: () => void
  stopTimer: () => void
  getStats: () => { runCount: number; averageTime: number; fastestRun: number; slowestRun: number }
  clearStats: () => void
}

const STEP_ORDER: WizardStep[] = ['loi', 'templates', 'epackage', 'esign', 'custodian', 'compliance', 'complete']

const initialState = {
  currentStep: 'loi' as WizardStep,
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
  timerStartTime: null,
  completedRuns: []
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
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

      setTransferId: (id) => set({ transferId: id }),

      startTimer: () => {
        const startTime = Date.now()
        console.log('Starting timer:', startTime)
        set({ timerStartTime: startTime })
      },

      stopTimer: () => {
        const { timerStartTime, completedRuns } = get()
        
        if (!timerStartTime) {
          console.log('No timer start time found')
          return
        }

        const endTime = Date.now()
        const duration = endTime - timerStartTime

        console.log('Timer completed:', {
          startTime: timerStartTime,
          endTime,
          duration,
          durationInSeconds: duration / 1000
        })

        set({
          timerStartTime: null,
          completedRuns: [...completedRuns, duration]
        })
      },

      getStats: () => {
        const { completedRuns } = get()

        if (completedRuns.length === 0) {
          return {
            runCount: 0,
            averageTime: 0,
            fastestRun: 0,
            slowestRun: 0
          }
        }

        return {
          runCount: completedRuns.length,
          averageTime: Number((completedRuns.reduce((sum, time) => sum + time, 0) / completedRuns.length / 1000).toFixed(1)),
          fastestRun: Number((Math.min(...completedRuns) / 1000).toFixed(1)),
          slowestRun: Number((Math.max(...completedRuns) / 1000).toFixed(1))
        }
      },

      clearStats: () => set({ completedRuns: [], timerStartTime: null })
    }),
    {
      name: 'wizard-storage',
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          try {
            if (typeof window === 'undefined') return null
            const value = window.sessionStorage.getItem(key)
            return value ? JSON.parse(value) : null
          } catch (error) {
            console.error('Failed to get from storage:', error)
            return null
          }
        },
        setItem: (key, value) => {
          try {
            if (typeof window === 'undefined') return
            window.sessionStorage.setItem(key, JSON.stringify(value))
          } catch (error) {
            console.error('Failed to save to storage:', error)
          }
        },
        removeItem: (key) => {
          try {
            if (typeof window === 'undefined') return
            window.sessionStorage.removeItem(key)
          } catch (error) {
            console.error('Failed to remove from storage:', error)
          }
        }
      })),
      partialize: (state) => ({
        timerStartTime: state.timerStartTime,
        completedRuns: state.completedRuns,
        formData: state.formData,
        currentStep: state.currentStep,
        stepIndex: state.stepIndex
      })
    }
  )
)
