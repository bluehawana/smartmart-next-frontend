import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[TEST] Received request:", body)

    // Try to call the social sign-in endpoint directly
    const response = await auth.api.signInSocial({
      body,
      headers: request.headers,
      asResponse: false
    })

    console.log("[TEST] Response:", response)
    return NextResponse.json({ success: true, data: response })
  } catch (error: any) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      details: JSON.stringify(error, null, 2)
    }, { status: 500 })
  }
}
