import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering - prevent database connection during build
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30 // Increase timeout for auth operations

// Get the auth handlers
const handlers = toNextJsHandler(auth)

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://107.175.235.220:3000',
  'https://www.smrtmart.com',
  'https://smrtmart.com',
]

// Helper function to get CORS headers based on request origin
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || ''

  // Check if origin is allowed
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin.includes('.vercel.app') ||
    origin.includes('.vercel-preview.app') ||
    origin.includes('localhost')

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
  }
}

// Retry helper for transient failures
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 500
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Don't retry on authentication errors (4xx), only on server errors (5xx) or network errors
      if (error instanceof Response && error.status >= 400 && error.status < 500) {
        throw error
      }

      if (attempt < maxRetries) {
        console.warn(`[Auth API] Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`, error)
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)))
      }
    }
  }

  console.error(`[Auth API] All ${maxRetries + 1} attempts failed`)
  throw lastError
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  })
}

export async function GET(request: NextRequest) {
  try {
    const response = await retryOperation(() => handlers.GET(request))
    const corsHeaders = getCorsHeaders(request)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  } catch (error) {
    console.error('[Auth API] GET request failed:', error)
    return new NextResponse(
      JSON.stringify({
        error: 'Authentication service temporarily unavailable',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(request),
        }
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await retryOperation(() => handlers.POST(request), 1, 300)
    const corsHeaders = getCorsHeaders(request)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Add rate limit headers to help with debugging
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', '99')
    
    return response
  } catch (error) {
    console.error('[Auth API] POST request failed:', error)
    
    // Check if it's a rate limit error
    const is429 = error instanceof Response && error.status === 429
    
    return new NextResponse(
      JSON.stringify({
        error: is429 ? 'Too many requests. Please wait a moment and try again.' : 'Authentication service temporarily unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
        hint: is429 ? 'Wait 10 seconds before trying again' : 'Check environment variables and database connection'
      }),
      {
        status: is429 ? 429 : 503,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': is429 ? '10' : '5',
          ...getCorsHeaders(request),
        }
      }
    )
  }
}
