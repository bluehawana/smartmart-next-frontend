'use client'

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="mt-2 text-gray-600">Failed to load product details.</p>
      </div>
    </div>
  )
} 