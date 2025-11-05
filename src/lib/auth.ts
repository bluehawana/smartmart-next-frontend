import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { sendMagicLinkEmail } from "./email"
import { OWNER_EMAILS } from "./auth-utils"
import { Pool } from "pg"

// Initialize PostgreSQL Pool as per Better Auth documentation
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
})

export const auth = betterAuth({
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
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://www.smrtmart.com",
    "https://smrtmart.com",
    // Allow all Vercel preview deployments
    (origin) => {
      return origin?.includes('.vercel.app') ?? false
    },
  ],
  // Better Auth will automatically create tables on first request
  advanced: {
    generateSchema: true,
  },
  // TODO: Re-implement hooks for owner role assignment after verifying basic auth works
  // The hooks API may have changed in the current version of better-auth
})
