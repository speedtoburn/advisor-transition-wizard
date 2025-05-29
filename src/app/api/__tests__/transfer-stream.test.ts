import { GET } from '../transfer/stream/route'
import { useWizardStore } from '@/store/wizardStore'

// Mock EventSource
class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(url: string) {
    // Simulate the 5-second delay and emit complete status
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', {
          data: JSON.stringify({ status: 'complete' })
        }))
      }
    }, 5000)
  }
}

global.EventSource = MockEventSource as typeof EventSource

describe('Transfer Stream API', () => {
  it('requires transferId parameter', async () => {
    const request = new Request('http://localhost:3000/api/transfer/stream')
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('streams complete status after 5 seconds', async () => {
    const request = new Request('http://localhost:3000/api/transfer/stream?transferId=123')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/event-stream')
    
    // Test the stream content
    const reader = response.body?.getReader()
    if (!reader) throw new Error('No reader available')
    
    const { value } = await reader.read()
    const text = new TextDecoder().decode(value)
    expect(text).toContain('"status":"complete"')
  })

  it('integrates with wizardStore', async () => {
    const store = useWizardStore.getState()
    store.setTransferId('123')
    
    const eventSource = new MockEventSource('http://localhost:3000/api/transfer/stream?transferId=123')
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.status === 'complete') {
        store.setStep('complete')
      }
    }
    
    // Wait for the mock event to fire
    await new Promise(resolve => setTimeout(resolve, 5100))
    
    expect(store.currentStep).toBe('complete')
  })
})
