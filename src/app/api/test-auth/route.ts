import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 25) + '...',
      hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
      hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
      hasGithubId: !!process.env.AUTH_GITHUB_ID,
      hasGithubSecret: !!process.env.AUTH_GITHUB_SECRET,
      hasMailjetKey: !!process.env.MAILJET_API_KEY,
      hasMailjetSecret: !!process.env.MAILJET_SECRET_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV,
    }

    // Test database connection
    let dbTest = null
    try {
      const { Client } = require('pg')
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      })

      await client.connect()
      const result = await client.query('SELECT NOW()')
      await client.end()

      dbTest = {
        connected: true,
        timestamp: result.rows[0].now
      }
    } catch (error: any) {
      dbTest = {
        connected: false,
        error: error.message,
        code: error.code
      }
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      database: dbTest,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
