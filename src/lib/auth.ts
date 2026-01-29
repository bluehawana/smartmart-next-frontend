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

// Singleton pool instance to prevent multiple connections
let poolInstance: Pool | null = null

function getPool() {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: getSSLConfig(),
      // Serverless-optimized settings
      max: 5, // Reduced for serverless (was 10)
      min: 0, // Don't maintain minimum connections
      idleTimeoutMillis: 20000, // Close idle connections faster (was 30s)
      connectionTimeoutMillis: 5000, // Fail faster (was 10s)
      allowExitOnIdle: true,
      // Add statement timeout to prevent hanging queries
      statement_timeout: 10000, // 10 seconds max per query
    })

    // Graceful error handling
    poolInstance.on('error', (err) => {
      console.error('[Database Pool] Unexpected error:', err)
    })

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      poolInstance.on('connect', () => {
        console.log('[Database Pool] Client connected')
      })
      poolInstance.on('remove', () => {
        console.log('[Database Pool] Client removed')
      })
    }
  }
  
  return poolInstance
}

// Singleton auth instance
let authInstance: ReturnType<typeof betterAuth> | null = null

export function getAuth() {
  if (!authInstance) {
    authInstance = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET!,
      baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      database: getPool(),
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
            if (process.env.NODE_ENV === 'development') {
              console.log('╔════════════════════════════════════════════════════════════╗')
              console.log('║  🎯 BETTER-AUTH MAGIC LINK CALLBACK TRIGGERED!           ║')
              console.log('╚════════════════════════════════════════════════════════════╝')
              console.log('[Better Auth] 📧 Email:', email)
              console.log('[Better Auth] 🔗 Magic link URL:', url)
            }

            try {
              await sendMagicLinkEmail({ email, url })
              if (process.env.NODE_ENV === 'development') {
                console.log('[Better Auth] ✅ Magic link email sent successfully!')
              }
            } catch (error) {
              console.error('[Better Auth] ❌ Failed to send magic link email:', error)
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
        "http://127.0.0.1:3000",
        "http://107.175.235.220:3000",
        "https://www.smrtmart.com",
        "https://smrtmart.com",
      ],
      advanced: {
        generateSchema: true,
        useSecureCookies: process.env.NODE_ENV === 'production',
        crossSubDomainCookies: {
          enabled: true,
        },
      },
    })
  }
  
  return authInstance
}

// Export for backward compatibility
export const auth = getAuth()
