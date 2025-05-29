import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const transferId = searchParams.get('transferId')

  if (!transferId) {
    return new NextResponse('Missing transferId', { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Wait 5 seconds before sending complete status
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      const data = encoder.encode('data: ' + JSON.stringify({ status: 'complete' }) + '\n\n')
      controller.enqueue(data)
      controller.close()
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
