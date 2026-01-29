"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import toast from "react-hot-toast"
import Link from "next/link"
import { Mail, ArrowLeft, Sparkles, AlertCircle } from "lucide-react"

export function LoginPageClient() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  // Check if already authenticated
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (session && !isPending) {
      // Already logged in, redirect
      router.push(callbackUrl)
    }
  }, [session, isPending, router, callbackUrl])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: callbackUrl,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to send magic link')
      }

      setEmailSent(true)
      toast.success("Check your email for the magic link!")
      setRetryCount(0)
    } catch (error: any) {
      console.error('[Login] Magic link error:', error)
      
      let errorMessage = "Failed to send magic link. Please try again."
      
      if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again."
      } else if (error?.message?.includes('email')) {
        errorMessage = "Invalid email address. Please check and try again."
      } else if (error?.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again."
      } else if (error?.message?.includes('503') || error?.message?.includes('unavailable')) {
        errorMessage = "Service temporarily unavailable. Please try again in a moment."
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
      setRetryCount(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      })

      if (result.error) {
        throw new Error(result.error.message || `Failed to sign in with ${provider}`)
      }
    } catch (error: any) {
      console.error(`[Login] ${provider} sign-in error:`, error)
      
      let errorMessage = `Failed to sign in with ${provider}. Please try again.`
      
      if (error?.message?.includes('popup')) {
        errorMessage = "Popup blocked. Please allow popups and try again."
      } else if (error?.message?.includes('closed')) {
        errorMessage = "Sign-in window was closed. Please try again."
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-950 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-primary-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Email sent confirmation
  if (emailSent) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Left - Confirmation */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm animate-fade-in-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-7 h-7 text-accent-dark" />
              </div>
              <h2 className="font-display text-2xl text-primary-950 mb-3">Check your email</h2>
              <p className="text-primary-500 mb-2">
                We sent a magic link to
              </p>
              <p className="font-medium text-primary-950 mb-6">{email}</p>
              <p className="text-sm text-primary-400 mb-8">
                Click the link in the email to sign in. The link expires in 10 minutes.
              </p>
              
              {/* Troubleshooting */}
              <div className="bg-primary-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-primary-700 mb-2">Didn't receive the email?</p>
                <ul className="text-xs text-primary-600 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure {email} is correct</li>
                  <li>• Wait a minute and check again</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                  setError(null)
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Use a different email
              </button>
            </div>
          </div>
        </div>

        {/* Right - Branding */}
        <div className="hidden lg:flex lg:flex-1 bg-primary-950 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="relative text-center text-white">
            <h1 className="font-display text-4xl mb-4">Almost there!</h1>
            <p className="text-white/70 max-w-sm">
              Check your inbox for the magic link. One click and you're in.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block font-display text-2xl font-semibold text-primary-950 tracking-tight mb-4">
              SMRTMART
            </Link>
            <h1 className="font-display text-xl text-primary-950 mb-2">Welcome back</h1>
            <p className="text-sm text-primary-500">Sign in to access your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-xl flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-error mb-1">Authentication Error</p>
                <p className="text-xs text-error/80">{error}</p>
                {retryCount >= 2 && (
                  <p className="text-xs text-error/80 mt-2">
                    Still having issues? Try refreshing the page or contact support.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialSignIn('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-primary-200 rounded-xl text-sm font-medium text-primary-900 hover:bg-primary-50 hover:border-primary-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialSignIn('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-primary-200 rounded-xl text-sm font-medium text-primary-900 hover:bg-primary-50 hover:border-primary-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs text-primary-400 uppercase tracking-wide">Or continue with email</span>
            </div>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null) // Clear error on input change
                }}
                required
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full px-4 py-3.5 text-sm border border-primary-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all disabled:opacity-50 disabled:bg-primary-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full flex items-center justify-center gap-2 bg-primary-950 text-white py-3.5 px-4 text-sm font-medium rounded-xl hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Send Magic Link
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-primary-400">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary-600 hover:text-primary-950 underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-950 underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right - Branding Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-primary-950 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative text-center">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-primary-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="font-display text-3xl text-white mb-4">
            Premium Tech
            <br />
            <span className="text-accent">Curated for You</span>
          </h2>
          <p className="text-white/60 max-w-sm mx-auto">
            Join thousands of tech enthusiasts who trust SmrtMart for their premium electronics needs.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <p className="font-display text-2xl text-white">10K+</p>
              <p className="text-xs text-white/50">Customers</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="font-display text-2xl text-white">500+</p>
              <p className="text-xs text-white/50">Products</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="font-display text-2xl text-accent">4.9</p>
              <p className="text-xs text-white/50">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
