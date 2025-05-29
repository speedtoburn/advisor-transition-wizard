import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    status: 'signed'
  }, {
    status: 200
  })
}
