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

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    plugins: [magicLinkClient(), ],
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient
