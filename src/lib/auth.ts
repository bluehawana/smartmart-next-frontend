import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { sendMagicLinkEmail } from "./email"
import { OWNER_EMAILS } from "./auth-utils"

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      enabled: !!process.env.AUTH_GOOGLE_ID,
    },
    github: {
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
      enabled: !!process.env.AUTH_GITHUB_ID,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        // Send magic link email via Resend
        await sendMagicLinkEmail({ email, url })
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
  ],
  // Better Auth will automatically create tables on first request
  advanced: {
    generateSchema: true,
  },
  // Hooks to set owner role for specific emails
  hooks: {
    after: [
      {
        matcher: () => true,
        handler: async (ctx) => {
          if (ctx.path === "/sign-in/social" || ctx.path === "/sign-in/magic-link") {
            const user = ctx.context?.user
            if (user?.email && OWNER_EMAILS.includes(user.email.toLowerCase())) {
              // Update user role to owner
              await ctx.context.internalAdapter.updateUser(user.id, {
                role: "owner",
              })
            }
          }
        },
      },
    ],
  },
})
