import { POST } from '../custodian/route'

describe('Custodian API', () => {
  it('returns a transfer ID and pending status', async () => {
    const response = await POST()
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('transferId')
    expect(data).toHaveProperty('status', 'pending')
    expect(typeof data.transferId).toBe('string')
  })
})
