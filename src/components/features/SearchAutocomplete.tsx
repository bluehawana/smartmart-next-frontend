'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchAutocomplete({ onSearch, className = '' }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: 'MacBook Pro 16-inch',
          category: 'Computers',
          price: 24990,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100',
        },
        {
          id: '2',
          name: 'AirPods Pro',
          category: 'Audio',
          price: 2490,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100',
        },
      ].filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
    
    // Perform search
    onSearch?.(searchQuery);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  const trendingSearches = ['MacBook', 'AirPods', 'iPhone', 'Gaming'];

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full pl-12 pr-12 py-3 bg-primary-50 border border-primary-100 rounded-xl text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary-100 rounded-xl shadow-soft-xl max-h-96 overflow-y-auto z-50 animate-fade-in-down">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-950 rounded-full animate-spin mx-auto" />
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-primary-500 uppercase tracking-wide">
                Products
              </p>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/products/${result.id}`}
                  onClick={() => {
                    handleSearch(query);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-12 h-12 object-cover rounded-lg bg-primary-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-950 truncate">
                      {result.name}
                    </p>
                    <p className="text-xs text-primary-500">{result.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary-950">
                    {result.price.toLocaleString('sv-SE')} kr
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-primary-500">No products found for "{query}"</p>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2 border-b border-primary-100">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
                  Recent Searches
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-primary-400 hover:text-primary-600 transition-colors"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-primary-50 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-sm text-primary-950">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {!query && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-primary-500 uppercase tracking-wide">
                Trending
              </p>
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-primary-50 transition-colors text-left"
                >
                  <TrendingUp className="w-4 h-4 text-accent-dark flex-shrink-0" />
                  <span className="text-sm text-primary-950">{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
