'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface SearchResult {
  id: string | number
  numeric_id?: number
  name: string
  price: number
  image: string
}

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  // 搜索产品
  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // 监听搜索词变化
  useEffect(() => {
    searchProducts(debouncedQuery)
  }, [debouncedQuery])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="h-16 flex items-center gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-12 pl-12 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="py-4">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((product) => {
                    const linkTarget = product.numeric_id ?? product.id
                    const linkSlug = typeof linkTarget === 'number' ? linkTarget.toString() : String(linkTarget)

                    return (
                      <Link
                        key={linkSlug}
                        href={`/products/${linkSlug}`}
                        onClick={onClose}
                        className="flex gap-4 p-4 rounded-lg hover:bg-gray-50"
                      >
                        <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={`http://localhost:8080/api/uploads/${product.image}`}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-gray-500">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : query && (
                <p className="text-gray-500 text-center">No results found for &ldquo;{query}&rdquo;</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 
