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
