import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { sendMagicLinkEmail } from "./email"
import { OWNER_EMAILS } from "./auth-utils"
import { Pool } from "pg"

// Determine SSL configuration based on DATABASE_URL
function getSSLConfig() {
  const dbUrl = process.env.DATABASE_URL || ''

  // If connecting to Supabase, AWS RDS, or using sslmode=require
  if (dbUrl.includes('supabase.co') || dbUrl.includes('amazonaws.com') || dbUrl.includes('sslmode=require')) {
    return {
      rejectUnauthorized: false, // Accept self-signed certificates
    }
  }

  // For local development or VPS without SSL
  if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || dbUrl.includes('sslmode=disable')) {
    return false // Disable SSL
  }

  // Default: try with SSL but don't reject unauthorized
  return {
    rejectUnauthorized: false,
  }
}

// Initialize PostgreSQL Pool optimized for serverless
// Connection pooling best practices for Vercel/serverless environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: getSSLConfig(),
  // Serverless-optimized settings
  max: 10, // Maximum pool size (lower for serverless)
  min: 0, // Don't maintain minimum connections in serverless
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Fail fast if can't connect in 10 seconds
  // Prevent connection exhaustion
  allowExitOnIdle: true, // Allow process to exit when idle
})

// Graceful error handling for pool errors
pool.on('error', (err) => {
  console.error('[Database Pool] Unexpected error on idle client:', err)
  // Don't exit - let the connection be recreated
})

// Log pool events for debugging (remove in production if needed)
pool.on('connect', () => {
  console.log('[Database Pool] New client connected')
})

pool.on('remove', () => {
  console.log('[Database Pool] Client removed from pool')
})

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: pool,
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!process.env.GITHUB_CLIENT_ID,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        // Send magic link email via Mailjet
        console.log('╔════════════════════════════════════════════════════════════╗')
        console.log('║  🎯 BETTER-AUTH MAGIC LINK CALLBACK TRIGGERED!           ║')
        console.log('╚════════════════════════════════════════════════════════════╝')
        console.log('[Better Auth] 📧 Email:', email)
        console.log('[Better Auth] 🔑 Token:', token)
        console.log('[Better Auth] 🔗 Magic link URL:', url)
        console.log('[Better Auth] ⏰ Timestamp:', new Date().toISOString())

        try {
          console.log('[Better Auth] 📤 Calling sendMagicLinkEmail function...')
          await sendMagicLinkEmail({ email, url })
          console.log('[Better Auth] ✅ Magic link email sent successfully!')
        } catch (error) {
          console.error('[Better Auth] ❌ Failed to send magic link email!')
          console.error('[Better Auth] Error details:', error)
          // Re-throw to ensure Better Auth knows it failed
          throw error
        }
      },
      expiresIn: 60 * 10, // 10 minutes
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: false,
      },
      marketingConsent: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://107.175.235.220:3000",
    "https://www.smrtmart.com",
    "https://smrtmart.com",
  ],
  // Better Auth will automatically create tables on first request
  advanced: {
    generateSchema: true,
  },
  // TODO: Re-implement hooks for owner role assignment after verifying basic auth works
  // The hooks API may have changed in the current version of better-auth
})
