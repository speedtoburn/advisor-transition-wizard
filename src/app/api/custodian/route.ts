import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST() {
  const transferId = uuidv4()
  
  return NextResponse.json({
    transferId,
    status: 'pending'
  }, {
    status: 200
  })
}

// Add unit test for this endpoint
if (process.env.NODE_ENV === 'test') {
  export const test = {
    POST: async () => {
      const response = await POST()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('transferId')
      expect(data).toHaveProperty('status', 'pending')
      expect(typeof data.transferId).toBe('string')
    }
  }
}
