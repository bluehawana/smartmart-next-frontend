"use client"

import {
    createAuthClient
} from "better-auth/react";
import {
    magicLinkClient,
} from "better-auth/client/plugins";

// Dynamically determine baseURL based on current origin
// This ensures it works with localhost, WSL2 IP, and production domains
const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        // Client-side: use current origin
        return window.location.origin
    }
    // Server-side: fallback to env variable
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Create auth client with enhanced configuration
export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [magicLinkClient()],
    fetchOptions: {
        credentials: 'include', // Always include cookies
        headers: {
            'Content-Type': 'application/json',
        },
        // Add retry logic for transient failures
        onError: async (context) => {
            const { error, response } = context
            
            // Log errors in development
            if (process.env.NODE_ENV === 'development') {
                console.error('[Auth Client] Request failed:', {
                    error,
                    status: response?.status,
                    url: response?.url,
                })
            }

            // Don't retry on client errors (4xx)
            if (response?.status && response.status >= 400 && response.status < 500) {
                return
            }

            // Retry on server errors (5xx) or network errors
            if (!response || response.status >= 500) {
                // Wait a bit before retry
                await new Promise(resolve => setTimeout(resolve, 1000))
                throw error // This will trigger a retry
            }
        },
    },
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient
