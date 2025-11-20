import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Health check endpoint for authentication service
 * Tests database connectivity and environment configuration
 *
 * Usage: GET /api/health/auth
 * Returns:
 * - 200: All systems operational
 * - 503: Service unavailable (with details)
 */
export async function GET() {
  const startTime = Date.now()
  const checks = {
    database: false,
    envVars: false,
    oauth: { google: false, github: false },
    email: false,
  }
  const errors: string[] = []

  // Check environment variables
  try {
    if (!process.env.DATABASE_URL) {
      errors.push('DATABASE_URL not set')
    }
    if (!process.env.BETTER_AUTH_SECRET) {
      errors.push('BETTER_AUTH_SECRET not set')
    } else if (process.env.BETTER_AUTH_SECRET.length < 32) {
      errors.push('BETTER_AUTH_SECRET too short (should be 32+ characters)')
    }
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      errors.push('NEXT_PUBLIC_APP_URL not set')
    }

    checks.envVars = errors.length === 0
  } catch (error) {
    errors.push(`Env check failed: ${error}`)
  }

  // Check OAuth configuration
  try {
    checks.oauth.google = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    checks.oauth.github = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)

    if (!checks.oauth.google && !checks.oauth.github) {
      errors.push('No OAuth providers configured (Google and GitHub both missing)')
    }
  } catch (error) {
    errors.push(`OAuth check failed: ${error}`)
  }

  // Check email service configuration
  try {
    checks.email = !!(process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY)
    if (!checks.email) {
      errors.push('Mailjet credentials not configured')
    }
  } catch (error) {
    errors.push(`Email service check failed: ${error}`)
  }

  // Check database connection
  let pool: Pool | null = null
  try {
    if (process.env.DATABASE_URL) {
      // Determine SSL config
      const dbUrl = process.env.DATABASE_URL
      let sslConfig: any = false

      if (dbUrl.includes('supabase.co') || dbUrl.includes('amazonaws.com') || dbUrl.includes('sslmode=require')) {
        sslConfig = { rejectUnauthorized: false }
      }

      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: sslConfig,
        connectionTimeoutMillis: 5000,
        max: 1, // Only need 1 connection for health check
      })

      // Test connection with a simple query
      const result = await pool.query('SELECT NOW()')
      checks.database = !!result.rows[0]

      // Also check if Better Auth tables exist
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'user'
        )
      `)

      if (!tableCheck.rows[0].exists) {
        errors.push('Better Auth tables not initialized (run migration or access /api/auth once)')
      }
    } else {
      errors.push('DATABASE_URL not configured')
    }
  } catch (error: any) {
    checks.database = false
    errors.push(`Database check failed: ${error.message || error}`)
  } finally {
    if (pool) {
      await pool.end()
    }
  }

  const responseTime = Date.now() - startTime
  const allChecksPass = checks.database && checks.envVars && (checks.oauth.google || checks.oauth.github) && checks.email

  return NextResponse.json(
    {
      status: allChecksPass ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      checks: {
        database: {
          status: checks.database ? 'ok' : 'error',
          description: 'PostgreSQL connection',
        },
        envVars: {
          status: checks.envVars ? 'ok' : 'error',
          description: 'Required environment variables',
        },
        oauth: {
          status: checks.oauth.google || checks.oauth.github ? 'ok' : 'error',
          description: 'OAuth providers',
          providers: {
            google: checks.oauth.google ? 'configured' : 'missing',
            github: checks.oauth.github ? 'configured' : 'missing',
          },
        },
        email: {
          status: checks.email ? 'ok' : 'error',
          description: 'Mailjet email service',
        },
      },
      errors: errors.length > 0 ? errors : undefined,
      recommendation: errors.length > 0
        ? 'Check VERCEL_ENV_CHECKLIST.md for required environment variables'
        : 'All systems operational',
    },
    {
      status: allChecksPass ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    }
  )
}
