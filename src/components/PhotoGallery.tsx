'use client'

import Image from "next/image"
import { useEffect, useRef } from 'react'
import { getGalleryImageUrl } from '@/lib/utils'

interface PhotoGalleryProps {
  photos: string[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scrollWidth = scrollContainer.scrollWidth
    const clientWidth = scrollContainer.clientWidth
    let scrollPos = 0

    const scroll = () => {
      scrollPos = (scrollPos + 1) % scrollWidth
      scrollContainer.scrollLeft = scrollPos
      if (scrollPos >= scrollWidth - clientWidth) {
        scrollPos = 0
      }
    }

    const interval = setInterval(scroll, 50)
    return () => clearInterval(interval)
  }, [])

  // 复制照片数组以确保无缝滚动
  const extendedPhotos = [...photos, ...photos, ...photos]

  return (
    <div className="relative h-32 overflow-hidden bg-gray-50 rounded-lg">
      <div
        ref={scrollRef}
        className="flex gap-4 absolute whitespace-nowrap transition-transform duration-1000"
        style={{ willChange: 'transform' }}
      >
        {extendedPhotos.map((photo, index) => (
          <div
            key={`${photo}-${index}`}
            className="w-48 h-32 flex-shrink-0 relative"
          >
            <Image
              src={getGalleryImageUrl(photo)}
              alt={`Gallery photo ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
} 