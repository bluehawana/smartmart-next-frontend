/**
 * Product ID Utilities
 * Centralized utilities for handling both UUID and numeric product IDs
 * during the migration period
 */

export type ProductId = string | number;
export type NumericId = number;
export type UuidId = string;

/**
 * Check if an ID is in numeric format
 */
export function isNumericId(id: ProductId): boolean {
  if (typeof id === 'number') return true;
  return /^\d+$/.test(String(id));
}

/**
 * Check if an ID is in UUID format
 */
export function isUuidId(id: ProductId): boolean {
  if (typeof id === 'number') return false;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(String(id));
}

/**
 * Normalize product ID to string format
 */
export function normalizeProductId(id: ProductId): string {
  if (typeof id === 'number') {
    return String(id);
  }
  return id.trim();
}

/**
 * Get the preferred ID for display (numeric)
 * Falls back to UUID if numeric_id is not available
 */
export function getDisplayId(product: { numeric_id?: number; id: string }): string {
  return product.numeric_id ? String(product.numeric_id) : product.id;
}

/**
 * Get the ID for API calls (prefers numeric if available)
 */
export function getApiId(product: { numeric_id?: number; id: string }): string | number {
  return product.numeric_id ?? product.id;
}

/**
 * Format product URL with the appropriate ID
 * Uses numeric_id if available, falls back to UUID
 */
export function getProductUrl(product: { numeric_id?: number; id: string }): string {
  const id = product.numeric_id ?? product.id;
  return `/products/${id}`;
}

/**
 * Validate product ID format
 */
export function isValidProductId(id: unknown): id is ProductId {
  if (typeof id === 'number') {
    return Number.isInteger(id) && id > 0;
  }

  if (typeof id === 'string') {
    const trimmed = id.trim();
    // Check if it's numeric
    if (/^\d+$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      return num > 0;
    }
    // Check if it's UUID
    return isUuidId(trimmed);
  }

  return false;
}

/**
 * Parse product ID from route params
 */
export function parseProductId(id: string | string[]): string {
  if (Array.isArray(id)) {
    return id[0];
  }
  return id;
}

/**
 * Compare two product IDs (handles mixed types)
 */
export function isSameProduct(
  id1: ProductId,
  id2: ProductId,
  product?: { numeric_id?: number; id: string }
): boolean {
  const norm1 = normalizeProductId(id1);
  const norm2 = normalizeProductId(id2);

  // Direct comparison
  if (norm1 === norm2) return true;

  // If we have product data, compare against both IDs
  if (product) {
    const productNumeric = product.numeric_id ? String(product.numeric_id) : null;
    const productUuid = product.id;

    return (
      norm1 === productUuid ||
      norm1 === productNumeric ||
      norm2 === productUuid ||
      norm2 === productNumeric
    );
  }

  return false;
}

/**
 * Generate product slug for SEO-friendly URLs
 * Format: /products/{id}/{name-slug}
 */
export function getProductSlug(product: {
  numeric_id?: number;
  id: string;
  name: string;
}): string {
  const id = product.numeric_id ?? product.id;
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `/products/${id}/${slug}`;
}

/**
 * Extract product ID from slug URL
 * Handles: /products/123/product-name -> 123
 */
export function extractProductIdFromSlug(slug: string): string {
  const match = slug.match(/^\/products\/([^/]+)/);
  return match ? match[1] : slug;
}

/**
 * Type guard for product with numeric_id
 */
export function hasNumericId(
  product: any
): product is { numeric_id: number; id: string } {
  return (
    typeof product === 'object' &&
    product !== null &&
    typeof product.numeric_id === 'number' &&
    typeof product.id === 'string'
  );
}

/**
 * Migration helper: Log ID usage for analytics
 */
export function logIdUsage(
  id: ProductId,
  context: string,
  isDevelopment = process.env.NODE_ENV === 'development'
) {
  if (!isDevelopment) return;

  const idType = isNumericId(id) ? 'numeric' : isUuidId(id) ? 'uuid' : 'unknown';

  console.log(`[Product ID Usage] ${context}:`, {
    id,
    type: idType,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get cache key for product (stable across ID types)
 */
export function getProductCacheKey(
  product: { numeric_id?: number; id: string } | ProductId
): string {
  if (typeof product === 'object') {
    // Prefer numeric_id for cache key stability
    return `product:${product.numeric_id ?? product.id}`;
  }
  return `product:${normalizeProductId(product)}`;
}
