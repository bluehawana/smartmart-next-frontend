'use client';

import { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  lowQualitySrc?: string;
}

export function ProgressiveImage({
  src,
  alt,
  className = '',
  fallback = '/placeholder-product.svg',
  lowQualitySrc,
}: ProgressiveImageProps) {
  const [imgSrc, setImgSrc] = useState(lowQualitySrc || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (lowQualitySrc) {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsLoading(false);
      };
      img.onerror = () => {
        setImgSrc(fallback);
        setHasError(true);
        setIsLoading(false);
      };
    } else {
      setIsLoading(false);
    }
  }, [src, lowQualitySrc, fallback]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'blur-md' : 'blur-0'} transition-all duration-500`}
      onError={(e) => {
        if (!hasError) {
          const target = e.target as HTMLImageElement;
          target.src = fallback;
          setHasError(true);
        }
      }}
      loading="lazy"
    />
  );
}
