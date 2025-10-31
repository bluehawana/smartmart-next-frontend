import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering - prevent database connection during build
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Get the auth handlers
const handlers = toNextJsHandler(auth)

// Wrap handlers with CORS support
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function GET(request: NextRequest) {
  const response = await handlers.GET(request)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export async function POST(request: NextRequest) {
  const response = await handlers.POST(request)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
