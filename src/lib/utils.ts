const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:8080/api/uploads'

// 产品图片URL
export function getProductImageUrl(filename: string) {
  if (!filename) return ''
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
