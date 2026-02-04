# SmrtMart Testing Documentation

This directory contains a comprehensive test suite for the SmrtMart e-commerce application.

## Test Structure

```
smartmart-frontend-next/
├── e2e/                          # End-to-End Tests (Playwright)
│   ├── smrtmart.spec.ts         # Main E2E tests for user flows
│   ├── admin.spec.ts            # Admin panel E2E tests
│   └── README.md                # This file
├── src/__tests__/                # Unit & Integration Tests (Vitest)
│   ├── components.test.tsx      # Component unit tests
│   ├── api.test.ts              # API route tests
│   └── utils.test.ts            # Utility function tests
├── playwright.config.ts         # Playwright configuration
├── vitest.config.ts              # Vitest configuration
└── vitest.setup.ts               # Test setup file
```

## Test Coverage

### End-to-End Tests (Playwright)

E2E tests simulate real user interactions in a browser environment. They test the complete flow from the user's perspective.

#### Main User Flows (smrtmart.spec.ts)

1. **Homepage Tests**
   - Page loads successfully
   - Contains navigation elements
   - Product grid displays products

2. **Product Catalog Tests**
   - Product listing page loads
   - Individual product pages load
   - Product details display correctly
   - Search functionality works

3. **Shopping Cart Tests**
   - Add products to cart
   - View cart contents
   - Update product quantities
   - Remove items from cart
   - Cart persists across page navigation

4. **Checkout Tests**
   - Checkout process initiation
   - Shipping information form
   - Payment processing (Stripe integration)
   - Order confirmation
   - Error handling for invalid inputs

5. **Authentication Tests**
   - Sign in with credentials
   - Sign in with OAuth (Google)
   - Sign up new account
   - Password reset flow
   - Protected route access
   - Sign out

6. **User Account Tests**
   - View account dashboard
   - Update profile information
   - View order history
   - Manage addresses

7. **Static Pages Tests**
   - About page
   - Contact page
   - Privacy policy
   - Terms of service
   - Support page

#### Admin Panel Tests (admin.spec.ts)

1. **Admin Authentication**
   - Admin login
   - Role-based access control

2. **Product Management**
   - View all products
   - Create new product
   - Edit existing product
   - Delete product
   - Upload product images

3. **Order Management**
   - View all orders
   - Update order status
   - Filter and search orders

4. **User Management**
   - View all users
   - Manage user roles
   - Disable/enable user accounts

5. **Analytics Dashboard**
   - View sales statistics
   - Check revenue metrics
   - User growth charts

### Unit & Integration Tests (Vitest)

Unit tests verify individual components and functions in isolation.

#### Component Tests (components.test.tsx)

- ProductCard rendering
- CartSidebar functionality
- Button component variants
- Header navigation
- SearchBar autocomplete
- Form validations

#### API Tests (api.test.ts)

- Authentication endpoints
- Product API routes
- Cart API operations
- Checkout API
- User profile API
- Admin API routes

#### Utility Tests (utils.test.ts)

- Price formatting
- Date formatting
- Cart calculations
- Validation functions
- Helper utilities

## Running Tests

### Prerequisites

1. Install dependencies:
```bash
cd smartmart-frontend-next
npm install
```

2. Playwright browsers are installed automatically via postinstall hook.
   If you need to install manually:
```bash
npx playwright install
```

### Environment Setup

Create a `.env.test` file in the project root:

```env
# Test Environment Configuration
TEST_BASE_URL=http://localhost:3000
TEST_ADMIN_EMAIL=admin@smrtmart.com
TEST_ADMIN_PASSWORD=testpassword123
TEST_USER_EMAIL=user@example.com
TEST_USER_PASSWORD=testpassword123
STRIPE_TEST_PUBLISHABLE_KEY=pk_test_...
STRIPE_TEST_SECRET_KEY=sk_test_...
```

### Running E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI for debugging
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/smrtmart.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests with specific project (browser)
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

### Running Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run specific test file
npx vitest run src/__tests__/components.test.tsx
```

## Test Scripts Summary

| Command | Description |
|---------|-------------|
| `npm run test` | Run all unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:coverage` | Run unit tests with coverage report |
| `npm run test:e2e` | Run all E2E tests (Playwright) |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run test:all` | Run both unit and E2E tests |

## Writing Tests

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('user can add product to cart', async ({ page }) => {
  // Navigate to products page
  await page.goto('/products');
  
  // Click on first product
  await page.click('[data-testid="product-card"]:first-child');
  
  // Wait for product page to load
  await page.waitForSelector('[data-testid="product-details"]');
  
  // Add to cart
  await page.click('[data-testid="add-to-cart-button"]');
  
  // Verify cart update
  const cartCount = await page.textContent('[data-testid="cart-count"]');
  expect(cartCount).toBe('1');
});
```

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      image: '/test.jpg'
    };
    
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Use data-testid attributes** for reliable element selection in E2E tests
2. **Mock external APIs** (Stripe, etc.) in unit tests
3. **Test user flows** not implementation details
4. **Use realistic test data** that matches production
5. **Clean up test data** after each test (use setup/teardown)
6. **Run tests in CI/CD** before deployments

## CI/CD Integration

Add to your GitHub Actions or CI pipeline:

```yaml
- name: Run Unit Tests
  run: npm run test

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    TEST_BASE_URL: ${{ secrets.TEST_BASE_URL }}
    TEST_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
    TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}
```

## Troubleshooting

### Common Issues

**1. Tests failing due to timeouts**
- Increase timeout in playwright.config.ts
- Check network conditions
- Ensure dev server is running

**2. Element not found errors**
- Add proper waits: `await page.waitForSelector()`
- Check if element is in viewport
- Verify data-testid attributes

**3. Flaky tests**
- Use retry configuration
- Add proper setup/teardown
- Avoid time-dependent assertions

## Support

For questions or issues with the test suite:
1. Check Playwright docs: https://playwright.dev
2. Check Vitest docs: https://vitest.dev
3. Review test examples in this directory
