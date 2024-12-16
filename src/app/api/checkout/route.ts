import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 从请求中获取商品数据
    const body = await request.json()

    // 转发请求到后端
    const response = await fetch('http://localhost:8080/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)  // 转发原始请求体
    })

    // 获取后端响应
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create checkout session')
    }

    // 返回后端响应
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create checkout session'
      },
      { status: 500 }
    )
  }
} 