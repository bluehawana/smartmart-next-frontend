"use client"

import { Suspense } from "react"
import { LoginPageClient } from "./LoginPageClient"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-950 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-primary-500">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageClient />
    </Suspense>
  )
}

