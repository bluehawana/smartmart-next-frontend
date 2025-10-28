import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL

    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL is not set'
      }, { status: 500 })
    }

    // Remove any query parameters for clean URL
    const cleanUrl = dbUrl.split('?')[0]

    // Try connection with explicit SSL configuration
    const pool = new Pool({
      connectionString: cleanUrl,
      ssl: {
        rejectUnauthorized: false, // Don't verify certificate
      },
      connectionTimeoutMillis: 10000,
    })

    const client = await pool.connect()

    try {
      // Try a simple query
      const result = await client.query('SELECT NOW() as current_time')

      // Check if tables exist
      const tablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('user', 'session', 'account', 'verification')
        ORDER BY table_name
      `)

      return NextResponse.json({
        success: true,
        connected: true,
        current_time: result.rows[0],
        tables_found: tablesResult.rows.map(r => r.table_name),
        tables_count: tablesResult.rows.length,
        connection_method: 'Pool with explicit SSL config'
      })
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack?.split('\n').slice(0, 5),
    }, { status: 500 })
  }
}
