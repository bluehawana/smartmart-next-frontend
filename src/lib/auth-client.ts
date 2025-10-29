"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

// Use current origin in browser, fallback to env variable for SSR
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Browser: use current origin
    return window.location.origin
  }
  // Server: use environment variable
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [magicLinkClient()],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useUser
} = authClient
