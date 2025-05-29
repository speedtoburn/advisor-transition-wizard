import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST() {
  const packageId = uuidv4()
  
  return NextResponse.json({
    packageId,
    status: 'generated'
  }, {
    status: 200
  })
}
