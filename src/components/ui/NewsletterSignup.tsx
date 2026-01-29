'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
  className?: string;
}

export function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox.');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }, 1000);
  };

  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-br from-primary-950 to-primary-800 rounded-2xl p-8 text-white ${className}`}>
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-display text-2xl mb-2">Stay in the Loop</h3>
          <p className="text-white/70 mb-6">
            Get exclusive offers, new arrivals, and tech insights delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={status === 'loading'}
              disabled={status === 'success'}
              className="w-full"
            >
              {status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </Button>
          </form>

          {message && (
            <div className={`mt-4 flex items-center justify-center gap-2 text-sm ${
              status === 'success' ? 'text-accent' : 'text-error'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-4 py-3 text-sm border border-primary-200 rounded-lg focus:border-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-900/5 transition-all disabled:opacity-50 disabled:bg-primary-50"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={status === 'loading'}
          disabled={status === 'success'}
          className="whitespace-nowrap"
        >
          {status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </Button>
      </form>

      {message && (
        <div className={`mt-3 flex items-center gap-2 text-sm ${
          status === 'success' ? 'text-success' : 'text-error'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message}
        </div>
      )}
    </div>
  );
}
