import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Test if DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL

    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL is not set',
        env: Object.keys(process.env).filter(k => k.includes('DATABASE')),
      }, { status: 500 })
    }

    // Don't expose the full URL, just check format
    const urlParts = dbUrl.split('@')
    const hasPassword = urlParts[0].includes(':')
    const hasHost = urlParts.length > 1

    return NextResponse.json({
      success: true,
      database_url_configured: true,
      has_password: hasPassword,
      has_host: hasHost,
      host: hasHost ? urlParts[1].split('/')[0] : 'not found',
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
