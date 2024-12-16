import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // 转发到后端API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Order confirmation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to confirm order' },
      { status: 500 }
    )
  }
} 