'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  quality?: number;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallback = '/placeholder-product.svg',
  priority = false,
  fill = false,
  width,
  height,
  sizes,
  quality = 85,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`${className} ${isLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-300`}
          onError={() => setImgSrc(fallback)}
          onLoad={() => setIsLoading(false)}
          priority={priority}
          sizes={sizes}
          quality={quality}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-300`}
          onError={() => setImgSrc(fallback)}
          onLoad={() => setIsLoading(false)}
          priority={priority}
          sizes={sizes}
          quality={quality}
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-primary-100 animate-pulse" />
      )}
    </div>
  );
}
