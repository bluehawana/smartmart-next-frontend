import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Force dynamic rendering - prevent database connection during build
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Export the auth handlers
export const { GET, POST } = toNextJsHandler(auth)
