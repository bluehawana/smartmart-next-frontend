const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const RAW_IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products'
const R2_PUBLIC_BASE = (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE || '').replace(/\/$/, '')

function normalizeBase(base: string) {
  if (!base) return ''
  if (base.endsWith('/public')) return base + '/products'
  return base.replace(/\/$/, '')
}

const IMAGE_BASE_URL = normalizeBase(RAW_IMAGE_BASE)

const IMAGE_OVERRIDES: Record<string, string> = {
  '8k-data-cable-dell.jpg': `${R2_PUBLIC_BASE}/uploads/${encodeURIComponent('8k data cable dell.jpg')}`,
  'iphone16-promaxcase.jpg': `${R2_PUBLIC_BASE}/uploads/${encodeURIComponent('iphone16 promaxcase.jpg')}`,
  'macbookair-adaptor-and-cable.png': `${R2_PUBLIC_BASE}/uploads/${encodeURIComponent('macbookair adaptor and cable.png')}`,
  'usb-c-iphone-cable.jpg': `${R2_PUBLIC_BASE}/uploads/${encodeURIComponent('usb c iphone cable.jpg')}`,
  'macbookair-m3-weaving-case.jpg': `${R2_PUBLIC_BASE}/uploads/${encodeURIComponent('macbookair m3 weaving case.jpg')}`,
  'macbook-m4-charging-cable.png': `${R2_PUBLIC_BASE}/uploads/${encodeURIComponent('macbook m4 charging cable.png')}`,
}

// 产品图片URL
export function getProductImageUrl(filename: string) {
  if (!filename) return ''
  
  const last = (() => {
    try { return decodeURIComponent(new URL(filename).pathname.split('/').pop() || '') } catch { return filename.split('/').pop() || filename }
  })()
  if (last && IMAGE_OVERRIDES[last]) {
    return IMAGE_OVERRIDES[last]
  }

  // If it's already a full URL (starts with http), return as is
  if (filename.startsWith('http')) {
    try {
      const u = new URL(filename)
      if (u.hostname.includes('r2.cloudflarestorage.com')) {
        const clean = decodeURIComponent(u.pathname.split('/').pop() || '')
        if (R2_PUBLIC_BASE && clean) {
          return `${R2_PUBLIC_BASE}/uploads/${encodeURIComponent(clean)}`
        }
        if (clean) return `${IMAGE_BASE_URL}/${encodeURIComponent(clean)}`
      }
      if (u.hostname.includes('cloudfront.net')) {
        const clean = decodeURIComponent(u.pathname.split('/').pop() || '')
        if (clean && IMAGE_OVERRIDES[clean]) return IMAGE_OVERRIDES[clean]
        if (clean) return `${IMAGE_BASE_URL}/${encodeURIComponent(clean)}`
      }
    } catch {}
    return filename
  }
  
  // If it's a relative path starting with /, assume it's already correct
  if (filename.startsWith('/')) {
    return filename
  }
  
  // 确保文件名不包含完整路径
  const cleanFilename = filename.split('/').pop() || filename
  return `${IMAGE_BASE_URL}/${cleanFilename}`
}

// 走马灯图片URL
export function getGalleryImageUrl(path: string) {
  if (!path) return ''
  // 移除开头的斜杠
  const cleanPath = path.replace(/^\/+/, '')
  return `${API_BASE_URL}/${cleanPath}`
}
