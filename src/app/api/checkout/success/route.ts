import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    // 转发到后端
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/success?session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to confirm order')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Order confirmation error:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to confirm order' },
      { status: 500 }
    )
  }
} 