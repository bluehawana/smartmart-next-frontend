'use client'

export default function Error({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 text-lg font-semibold">Error loading product</h2>
        <p className="text-red-600 mt-1">{error.message}</p>
      </div>
    </div>
  )
} 