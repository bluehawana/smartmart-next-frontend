const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const RAW_IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products'
const R2_PUBLIC_BASE = (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE || '').replace(/\/$/, '')

function normalizeBase(base: string) {
  if (!base) return ''
  if (base.endsWith('/public')) return base + '/products'
  return base.replace(/\/$/, '')
}

const IMAGE_BASE_URL = normalizeBase(RAW_IMAGE_BASE)

// No image overrides - all images are now in Supabase
const IMAGE_OVERRIDES: Record<string, string> = {}

// 产品图片URL
export function getProductImageUrl(filename: string) {
  if (!filename) return ''
  
  const last = (() => {
    try { return decodeURIComponent(new URL(filename).pathname.split('/').pop() || '') } catch { return filename.split('/').pop() || filename }
  })()
  if (last && IMAGE_OVERRIDES[last]) {
    return IMAGE_OVERRIDES[last]
  }

  // If it's already a full URL (starts with http), extract the filename and use Supabase
  if (filename.startsWith('http')) {
    try {
      const u = new URL(filename)
      // Extract just the filename from any URL and use Supabase
      const clean = decodeURIComponent(u.pathname.split('/').pop() || '')
      if (clean) return `${IMAGE_BASE_URL}/${clean}`
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
