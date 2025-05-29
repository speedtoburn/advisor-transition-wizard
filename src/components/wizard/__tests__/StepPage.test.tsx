import { render, screen, fireEvent } from '@testing-library/react'
import StepPage from '../StepPage'
import { useWizardStore } from '@/store/wizardStore'

// Mock the wizardStore
jest.mock('@/store/wizardStore', () => ({
  useWizardStore: jest.fn()
}))

describe('StepPage', () => {
  const mockNextStep = jest.fn()

  beforeEach(() => {
    // Setup mock for useWizardStore
    ;(useWizardStore as jest.Mock).mockImplementation(() => ({
      nextStep: mockNextStep
    }))
  })

  it('renders the title and description', () => {
    render(
      <StepPage
        title="Test Title"
        description="Test Description"
      >
        <div>Test Content</div>
      </StepPage>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('calls nextStep when Continue button is clicked', () => {
    render(
      <StepPage
        title="Test Title"
        description="Test Description"
      >
        <div>Test Content</div>
      </StepPage>
    )

    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)

    expect(mockNextStep).toHaveBeenCalled()
  })

  it('renders children content', () => {
    render(
      <StepPage
        title="Test Title"
        description="Test Description"
      >
        <div>Test Child Content</div>
      </StepPage>
    )

    expect(screen.getByText('Test Child Content')).toBeInTheDocument()
  })
})
