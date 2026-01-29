'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: Date;
  onExpire?: () => void;
  className?: string;
}

export function CountdownTimer({ endDate, onExpire, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = endDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft.expired) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Clock className="w-4 h-4 text-error" />
      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <TimeUnit value={timeLeft.days} label="d" />
        )}
        <TimeUnit value={timeLeft.hours} label="h" />
        <span className="text-primary-400">:</span>
        <TimeUnit value={timeLeft.minutes} label="m" />
        <span className="text-primary-400">:</span>
        <TimeUnit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-lg font-display font-semibold text-primary-950 tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-primary-500">{label}</span>
    </div>
  );
}
