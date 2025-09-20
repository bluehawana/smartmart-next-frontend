const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-backend-1757499174-0dfbd8d4731e.herokuapp.com/api/v1'
const SUPABASE_IMAGE_BASE = 'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products'

// Specific filename -> absolute URL overrides
const IMAGE_OVERRIDES: Record<string, string> = {
  '8k-data-cable-dell.jpg': `${SUPABASE_IMAGE_BASE}/8k data cable dell.jpg`,
  'iphone16-promaxcase.jpg': `${SUPABASE_IMAGE_BASE}/iphone16 promaxcase.jpg`,
  'macbookair-adaptor-and-cable.png': `${SUPABASE_IMAGE_BASE}/macbookair adaptor and cable.png`,
  'usb-c-iphone-cable.jpg': `${SUPABASE_IMAGE_BASE}/usb c iphone cable.jpg`,
  'macbookair-m3-weaving-case.jpg': `${SUPABASE_IMAGE_BASE}/macbookair m3 weaving case.jpg`,
  'macbook-m4-charging-cable.png': `${SUPABASE_IMAGE_BASE}/macbook m4 charging cable.png`,
  'macbookair case.png': `${SUPABASE_IMAGE_BASE}/macbookair case.png`,
  // Use monecard.png for tracking card products
  'monecard.png': `${SUPABASE_IMAGE_BASE}/monecard.png`,
  'mtrackingtag.png': `${SUPABASE_IMAGE_BASE}/mtrackingtag.png`,
}

// 产品图片URL
export function getProductImageUrl(filename: string) {
  if (!filename) return ''

  // Normalize to last path segment for override lookup
  const cleanFilename = filename.split('/').pop() || filename

  // Check for specific overrides first
  if (IMAGE_OVERRIDES[cleanFilename]) {
    return IMAGE_OVERRIDES[cleanFilename]
  }

  // If it's already a full URL (starts with http), return as is only if it's accessible
  if (filename.startsWith('http')) {
    try {
      const u = new URL(filename)
      // If it's an R2 URL, convert to Supabase equivalent
      if (u.hostname.includes('r2.cloudflarestorage.com')) {
        const cleanName = decodeURIComponent(u.pathname.split('/').pop() || '')
        if (cleanName) return `${SUPABASE_IMAGE_BASE}/${cleanName}`
      }
      // If it's already Supabase, use it
      if (u.hostname.includes('supabase.co')) {
        return filename
      }
    } catch {}
    // For other URLs, fall back to Supabase with filename
    return `${SUPABASE_IMAGE_BASE}/${cleanFilename}`
  }

  // If it's a relative path starting with /, assume it's already correct
  if (filename.startsWith('/')) {
    return filename
  }

  // Default: use Supabase as the base
  return `${SUPABASE_IMAGE_BASE}/${cleanFilename}`
}

// 走马灯图片URL
export function getGalleryImageUrl(path: string) {
  if (!path) return ''
  // 移除开头的斜杠
  const cleanPath = path.replace(/^\/+/, '')
  return `${API_BASE_URL}/${cleanPath}`
}
