'use client'

import Image from "next/image";

export function PhotoGallery({ photos }: { photos: string[] }) {
  // 创建更多副本以确保完全无缝循环
  const extendedPhotos = [...photos, ...photos, ...photos, ...photos, ...photos];

  return (
    <div className="overflow-hidden bg-gray-50 rounded-lg relative">
      <div 
        className="flex animate-scroll"
        style={{ 
          animation: 'scroll 60s linear infinite',
          width: `${(photos.length * 5 * 100) / 5}%`, // 确保总宽度正确
        }}
      >
        {extendedPhotos.map((photo, index) => (
          <div 
            key={index} 
            className="relative flex-none"
            style={{ width: `${100 / (photos.length * 5)}%` }} // 动态计算每个项的宽度
          >
            <div className="relative h-48 rounded-lg overflow-hidden m-2">
              <Image
                src={photo}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="20vw"
                priority={index < 5}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${100 / 5}%);  // 只移动一组照片的距离
          }
        }
        .animate-scroll {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          transition: transform linear;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
} 