'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
  pulse = false,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider rounded-md';
  
  const variants = {
    primary: 'bg-primary-950 text-white',
    accent: 'bg-accent text-primary-950',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning-dark border border-warning/20',
    error: 'bg-error/10 text-error border border-error/20',
    outline: 'bg-transparent border border-current',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${pulse ? 'animate-pulse' : ''} ${className}`}
    >
      {children}
    </span>
  );
}
