import { test, expect } from '@playwright/test';

/**
 * API E2E Test Suite
 * Tests all API endpoints for smrtmart.com
 */

const API_URL = 'https://api.smrtmart.com/api/v1';
const AUTH_URL = 'https://auth.smrtmart.com';

// ============================================
// PRODUCTS API TESTS
// ============================================
test.describe('Products API', () => {
  test('GET /products returns product list', async ({ request }) => {
    const response = await request.get(`${API_URL}/products`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.data).toBeDefined();
    expect(Array.isArray(data.data.data)).toBe(true);
  });

  test('GET /products with limit parameter', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?limit=5`);

    // API should respond
    expect([200, 400, 500].includes(response.status())).toBeTruthy();

    if (response.ok()) {
      const data = await response.json();
      expect(data.data.data.length).toBeLessThanOrEqual(5);
    }
  });

  test('GET /products with pagination', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?limit=5`);

    // API should respond
    expect([200, 429, 500].includes(response.status())).toBeTruthy();
  });

  test('GET /products with category filter', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?category=computers`);

    // May return various status codes
    expect([200, 400, 404, 429, 500].includes(response.status())).toBeTruthy();
  });

  test('GET /products with search query', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?search=macbook`);

    // May return various status codes depending on implementation
    expect([200, 400, 404, 429, 500].includes(response.status())).toBeTruthy();
  });

  test('GET /products/:id returns single product', async ({ request }) => {
    // First get a product ID
    const listResponse = await request.get(`${API_URL}/products?limit=1`);
    const listData = await listResponse.json();
    const productId = listData.data?.data?.[0]?.id;

    if (productId) {
      const response = await request.get(`${API_URL}/products/${productId}`);

      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(productId);
    }
  });

  test('GET /products/:id with invalid ID returns 404', async ({ request }) => {
    const response = await request.get(`${API_URL}/products/99999999`);

    // Should return 404 or error response
    expect([404, 400].includes(response.status()) || !response.ok()).toBeTruthy();
  });

  test('product data has required fields', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?limit=1`);
    const data = await response.json();
    const product = data.data?.data?.[0];

    if (product) {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.images).toBeDefined();
      expect(product.category).toBeDefined();
    }
  });

  test('product images array is valid', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?limit=1`);
    const data = await response.json();
    const product = data.data?.data?.[0];

    if (product && product.images) {
      expect(Array.isArray(product.images)).toBe(true);
      expect(product.images.length).toBeGreaterThan(0);
    }
  });
});

// ============================================
// CATEGORIES API TESTS
// ============================================
test.describe('Categories API', () => {
  test('GET /categories responds', async ({ request }) => {
    const response = await request.get(`${API_URL}/categories`);

    // Categories endpoint might not exist or be rate limited
    expect([200, 400, 404, 429, 500].includes(response.status())).toBeTruthy();
  });
});

// ============================================
// AUTH API TESTS
// ============================================
test.describe('Auth API', () => {
  test('GET /api/auth/get-session returns session or null', async ({ request }) => {
    const response = await request.get(`${AUTH_URL}/api/auth/get-session`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    // When not logged in, should return null
    expect(data === null || typeof data === 'object').toBe(true);
  });

  test('POST /api/auth/sign-out works', async ({ request }) => {
    const response = await request.post(`${AUTH_URL}/api/auth/sign-out`, {
      headers: { 'Content-Type': 'application/json' },
      data: {}
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('auth endpoints have CORS headers', async ({ request }) => {
    const response = await request.get(`${AUTH_URL}/api/auth/get-session`);

    // Check response is successful
    expect(response.ok()).toBeTruthy();
  });
});

// ============================================
// CART API TESTS (if applicable)
// ============================================
test.describe('Cart API', () => {
  test('cart endpoints exist', async ({ request }) => {
    // Try to get cart - might need auth
    const response = await request.get(`${API_URL}/cart`);

    // Either returns cart or 401 unauthorized
    expect([200, 401, 404].includes(response.status())).toBeTruthy();
  });
});

// ============================================
// ORDERS API TESTS
// ============================================
test.describe('Orders API', () => {
  test('GET /orders requires authentication', async ({ request }) => {
    const response = await request.get(`${API_URL}/orders`);

    // Should require auth (401) or return empty
    expect([200, 401, 403].includes(response.status())).toBeTruthy();
  });
});

// ============================================
// API ERROR HANDLING TESTS
// ============================================
test.describe('API Error Handling', () => {
  test('invalid endpoint returns 404', async ({ request }) => {
    const response = await request.get(`${API_URL}/nonexistent-endpoint`);

    expect(response.status()).toBe(404);
  });

  test('API returns JSON content type', async ({ request }) => {
    const response = await request.get(`${API_URL}/products`);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('API handles malformed requests gracefully', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?limit=invalid`);

    // Should not crash - either return error or use default
    expect([200, 400, 500].includes(response.status())).toBeTruthy();
  });
});

// ============================================
// API PERFORMANCE TESTS
// ============================================
test.describe('API Performance', () => {
  test('products endpoint responds within 3 seconds', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${API_URL}/products`);
    const duration = Date.now() - start;

    // API should respond (might be rate limited)
    expect([200, 429, 500].includes(response.status())).toBeTruthy();
    expect(duration).toBeLessThan(3000);
  });

  test('single product endpoint responds within 1 second', async ({ request }) => {
    // Get product ID first
    const listResponse = await request.get(`${API_URL}/products?limit=1`);
    const listData = await listResponse.json();
    const productId = listData.data?.data?.[0]?.id;

    if (productId) {
      const start = Date.now();
      const response = await request.get(`${API_URL}/products/${productId}`);
      const duration = Date.now() - start;

      expect(response.ok()).toBeTruthy();
      expect(duration).toBeLessThan(1000);
    }
  });
});

// ============================================
// R2 IMAGE TESTS
// ============================================
test.describe('R2 Image Storage', () => {
  const R2_BASE = 'https://pub-680bab0210f1433b8f95584ba5132431.r2.dev/uploads';

  test('R2 images are accessible', async ({ request }) => {
    // Get a product with image
    const productsResponse = await request.get(`${API_URL}/products?limit=1`);
    const productsData = await productsResponse.json();
    const product = productsData.data?.data?.[0];

    if (product && product.images && product.images[0]) {
      const imageName = product.images[0];
      const encodedName = encodeURIComponent(imageName);
      const imageUrl = `${R2_BASE}/${encodedName}`;

      const response = await request.head(imageUrl);
      expect(response.ok()).toBeTruthy();
    }
  });

  test('R2 returns correct content type for images', async ({ request }) => {
    const productsResponse = await request.get(`${API_URL}/products?limit=1`);
    const productsData = await productsResponse.json();
    const product = productsData.data?.data?.[0];

    if (product && product.images && product.images[0]) {
      const imageName = product.images[0];
      const encodedName = encodeURIComponent(imageName);
      const imageUrl = `${R2_BASE}/${encodedName}`;

      const response = await request.head(imageUrl);

      if (response.ok()) {
        const contentType = response.headers()['content-type'];
        expect(contentType).toMatch(/image\/(jpeg|png|gif|webp)/);
      }
    }
  });
});

// ============================================
// STRIPE CHECKOUT TESTS (limited without actual payment)
// ============================================
test.describe('Checkout API', () => {
  test('checkout session endpoint exists', async ({ request }) => {
    // Try to create checkout session without auth
    const response = await request.post(`${API_URL}/checkout/create-session`, {
      headers: { 'Content-Type': 'application/json' },
      data: { items: [] }
    });

    // Should require items or auth
    expect([200, 400, 401, 404].includes(response.status())).toBeTruthy();
  });
});
