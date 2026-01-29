'use client';

import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface LazyLoadProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyLoad({
  children,
  placeholder,
  rootMargin = '100px',
  threshold = 0.01,
  className = '',
}: LazyLoadProps) {
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin,
    threshold,
    freezeOnceVisible: true,
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
}
