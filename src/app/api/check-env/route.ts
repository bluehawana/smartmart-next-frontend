import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 })
  }

  // Parse the URL to show config without exposing password
  try {
    const url = new URL(dbUrl.replace('postgresql://', 'http://'))
    const passwordLength = url.password?.length || 0

    return NextResponse.json({
      protocol: 'postgresql',
      username: url.username,
      passwordLength: passwordLength,
      host: url.hostname,
      port: url.port,
      database: url.pathname.substring(1),
      full_host_port: `${url.hostname}:${url.port}`,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to parse DATABASE_URL',
      message: error.message
    }, { status: 500 })
  }
}
