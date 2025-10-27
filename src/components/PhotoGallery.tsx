'use client'

import Image from 'next/image'

interface PhotoGalleryProps {
  photos: string[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="w-full h-32 relative overflow-hidden rounded-lg">
      <div className="animate-marquee flex">
        {/* 第一组照片 */}
        {photos.map((photo, index) => (
          <div 
            key={`first-${index}`} 
            className="relative min-w-[150px] h-32 flex-shrink-0 mx-1"
          >
            <Image
              src={photo}
              alt={`Weekly Pick ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="150px"
            />
          </div>
        ))}
        {/* 复制一组照片以实现无缝滚动 */}
        {photos.map((photo, index) => (
          <div 
            key={`second-${index}`} 
            className="relative min-w-[150px] h-32 flex-shrink-0 mx-1"
          >
            <Image
              src={photo}
              alt={`Weekly Pick ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="150px"
            />
          </div>
        ))}
      </div>
    </div>
  )
} 