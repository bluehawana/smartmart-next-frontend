function resolveApiBase() {
  const fallback = 'https://smrtmart-backend-1757499174-0dfbd8d4731e.herokuapp.com/api/v1'
  const raw = process.env.NEXT_PUBLIC_API_URL
  if (!raw) return fallback
  try {
    const u = new URL(raw)
    const host = (u.hostname || '').trim()
    if (!host || host.startsWith('.')) return fallback
    return raw.replace(/\/$/, '')
  } catch {
    return fallback
  }
}

export const API_BASE = resolveApiBase()
