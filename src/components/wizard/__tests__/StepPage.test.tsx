import { render } from '@testing-library/react'
import StepPage from '../StepPage'
import { useWizardStore } from '@/store/wizardStore'

interface WizardState {
  currentStep: string
  stepIndex: number
  formData: Record<string, unknown>
  setStep: (step: string) => void
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: Record<string, unknown>) => void
}

// Mock the wizardStore
jest.mock('@/store/wizardStore', () => ({
  useWizardStore: jest.fn()
}))

describe('StepPage', () => {
  const mockNextStep = jest.fn()

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    
    // Setup mock for useWizardStore with type assertion
    ;(useWizardStore as unknown as jest.Mock<Partial<WizardState>>).mockImplementation(() => ({
      nextStep: mockNextStep
    }))
  })

  it('renders the title and description', () => {
    const { getByText } = render(
      <StepPage
        title="Test Title"
        description="Test Description"
      >
        <div>Test Content</div>
      </StepPage>
    )

    const titleElement = getByText('Test Title')
    const descriptionElement = getByText('Test Description')

    expect(titleElement).toBeDefined()
    expect(descriptionElement).toBeDefined()
  })

  it('calls nextStep when Continue button is clicked', () => {
    const { getByRole } = render(
      <StepPage
        title="Test Title"
        description="Test Description"
      >
        <div>Test Content</div>
      </StepPage>
    )

    const continueButton = getByRole('button', { name: /continue/i })
    continueButton.click()

    expect(mockNextStep).toHaveBeenCalledTimes(1)
  })

  it('renders children content', () => {
    const { getByText } = render(
      <StepPage
        title="Test Title"
        description="Test Description"
      >
        <div>Test Child Content</div>
      </StepPage>
    )

    const childElement = getByText('Test Child Content')
    expect(childElement).toBeDefined()
  })
})
