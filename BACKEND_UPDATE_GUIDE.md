# Backend API Update Guide - UUID to Numeric ID Migration

## Overview
This guide covers updating your RackNerd backend API to support numeric_id alongside UUID.

---

## Step 1: Update Product Model/Schema

Add `numeric_id` field to your product model:

```javascript
// models/Product.js or schema definition
{
  id: UUID,              // Keep existing UUID (primary key)
  numeric_id: INTEGER,   // Add this - unique, not null
  vendor_id: UUID,
  name: STRING,
  // ... rest of fields
}
```

---

## Step 2: Update Product Query Methods

### A. Get Single Product - Accept Both ID Types

```javascript
// routes/products.js or controllers/products.js

// GET /api/v1/products/:id
async function getProductById(req, res) {
  const { id } = req.params;

  let product;

  // Check if ID is numeric or UUID
  if (/^\d+$/.test(id)) {
    // Numeric ID
    product = await db.query(
      'SELECT * FROM products WHERE numeric_id = $1 AND status = $2',
      [parseInt(id), 'active']
    );
  } else {
    // UUID
    product = await db.query(
      'SELECT * FROM products WHERE id = $1 AND status = $2',
      [id, 'active']
    );
  }

  if (!product || product.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  return res.json({
    success: true,
    data: product.rows[0]
  });
}
```

### B. List Products - Include numeric_id in Response

```javascript
// GET /api/v1/products
async function listProducts(req, res) {
  const { page = 1, limit = 20, search, category } = req.query;

  // Your existing query logic...
  const products = await db.query(`
    SELECT
      id,
      numeric_id,  -- Include this in SELECT
      vendor_id,
      name,
      description,
      price,
      compare_price,
      sku,
      category,
      tags,
      images,
      stock,
      status,
      featured,
      weight,
      dimensions,
      seo,
      created_at,
      updated_at
    FROM products
    WHERE status = 'active'
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `, [limit, (page - 1) * limit]);

  return res.json({
    success: true,
    data: {
      data: products.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        total_pages: Math.ceil(totalCount / limit)
      }
    }
  });
}
```

---

## Step 3: Update Related Endpoints

### Cart Operations
```javascript
// POST /api/v1/cart
async function addToCart(req, res) {
  const { product_id, quantity } = req.body;

  // Normalize product_id (accept both formats)
  let productQuery;
  if (/^\d+$/.test(product_id)) {
    productQuery = 'SELECT * FROM products WHERE numeric_id = $1';
  } else {
    productQuery = 'SELECT * FROM products WHERE id = $1';
  }

  const product = await db.query(productQuery, [product_id]);

  if (!product || product.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Rest of cart logic...
}
```

### Orders
```javascript
// When creating orders, store both IDs for backward compatibility
async function createOrder(req, res) {
  const { items } = req.body;

  for (const item of items) {
    // Resolve product by either ID type
    const product = await getProductByEitherId(item.product_id);

    // Store order_item with both IDs
    await db.query(`
      INSERT INTO order_items (order_id, product_id, product_numeric_id, quantity, price)
      VALUES ($1, $2, $3, $4, $5)
    `, [orderId, product.id, product.numeric_id, item.quantity, product.price]);
  }
}
```

---

## Step 4: Add Helper Functions

```javascript
// utils/productHelpers.js

/**
 * Determine if an ID is numeric or UUID
 */
function isNumericId(id) {
  return /^\d+$/.test(String(id));
}

/**
 * Get product by either UUID or numeric ID
 */
async function getProductByEitherId(id, db) {
  const isNumeric = isNumericId(id);

  const query = isNumeric
    ? 'SELECT * FROM products WHERE numeric_id = $1'
    : 'SELECT * FROM products WHERE id = $1';

  const value = isNumeric ? parseInt(id) : id;

  const result = await db.query(query, [value]);
  return result.rows[0] || null;
}

/**
 * Normalize product response (ensure both IDs are present)
 */
function normalizeProductResponse(product) {
  return {
    ...product,
    id: product.id,              // UUID (keep for backward compatibility)
    numeric_id: product.numeric_id, // Numeric ID (new standard)
  };
}

module.exports = {
  isNumericId,
  getProductByEitherId,
  normalizeProductResponse
};
```

---

## Step 5: Update API Response Format

Ensure all product responses include both IDs:

```javascript
// Example response
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440029",  // UUID
    "numeric_id": 1,                               // Numeric ID
    "name": "MacBook Air M3 Case",
    "price": 890,
    // ... rest of fields
  }
}
```

---

## Step 6: Add API Documentation

Update your API docs to reflect dual ID support:

```markdown
### Get Product by ID

**Endpoint:** `GET /api/v1/products/:id`

**Parameters:**
- `id` - Product identifier (accepts both UUID and numeric ID)
  - UUID format: `550e8400-e29b-41d4-a716-446655440029`
  - Numeric format: `1`, `2`, `3`, etc.

**Example Requests:**
```bash
# Using numeric ID (preferred)
GET /api/v1/products/1

# Using UUID (backward compatible)
GET /api/v1/products/550e8400-e29b-41d4-a716-446655440029
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440029",
    "numeric_id": 1,
    "name": "Product Name",
    ...
  }
}
```
```

---

## Step 7: Testing Checklist

After updating the backend, test these endpoints:

### ✅ Product Endpoints
- [ ] `GET /api/v1/products` - List includes numeric_id
- [ ] `GET /api/v1/products/1` - Get by numeric ID works
- [ ] `GET /api/v1/products/{uuid}` - Get by UUID still works
- [ ] `GET /api/v1/products?search=macbook` - Search works
- [ ] `GET /api/v1/products?category=electronics` - Filter works

### ✅ Cart Endpoints
- [ ] `POST /api/v1/cart` - Add with numeric_id works
- [ ] `POST /api/v1/cart` - Add with UUID still works
- [ ] `GET /api/v1/cart` - Cart items show numeric_id
- [ ] `PUT /api/v1/cart/:id` - Update cart item works
- [ ] `DELETE /api/v1/cart/:id` - Remove cart item works

### ✅ Order Endpoints
- [ ] `POST /api/v1/orders` - Create order with numeric_id works
- [ ] `GET /api/v1/orders/:id` - Order details show numeric_id
- [ ] `GET /api/v1/orders` - List orders works

---

## Step 8: Backward Compatibility Period

Keep both ID formats working for at least 30 days:

```javascript
// Add logging to track UUID usage
function getProductById(req, res) {
  const { id } = req.params;

  if (!isNumericId(id)) {
    // Log UUID usage for tracking
    console.log(`[DEPRECATED] UUID access for product: ${id}`);
    // Consider sending to analytics
  }

  // Rest of logic...
}
```

---

## Step 9: Environment Variables

Add configuration for migration behavior:

```bash
# .env
NUMERIC_ID_ENABLED=true
UUID_DEPRECATED_WARNING=true
```

```javascript
// config.js
module.exports = {
  numericIdEnabled: process.env.NUMERIC_ID_ENABLED === 'true',
  uuidDeprecatedWarning: process.env.UUID_DEPRECATED_WARNING === 'true',
};
```

---

## Common Issues & Solutions

### Issue 1: Foreign Key Constraints
If other tables reference `products.id`:
```sql
-- Add numeric_id to related tables too
ALTER TABLE order_items ADD COLUMN product_numeric_id INTEGER;
ALTER TABLE cart_items ADD COLUMN product_numeric_id INTEGER;

-- Add foreign key constraints
ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_product_numeric_id
FOREIGN KEY (product_numeric_id) REFERENCES products(numeric_id);
```

### Issue 2: Existing Carts/Orders
```javascript
// Migration script to backfill numeric_ids
async function backfillNumericIds() {
  await db.query(`
    UPDATE cart_items ci
    SET product_numeric_id = p.numeric_id
    FROM products p
    WHERE ci.product_id = p.id
    AND ci.product_numeric_id IS NULL
  `);

  await db.query(`
    UPDATE order_items oi
    SET product_numeric_id = p.numeric_id
    FROM products p
    WHERE oi.product_id = p.id
    AND oi.product_numeric_id IS NULL
  `);
}
```

---

## Next Steps

After updating the backend:

1. ✅ Run the database migration SQL
2. ✅ Update backend code (this guide)
3. ✅ Test all endpoints
4. ✅ Deploy backend changes
5. ⏭️ Update frontend (next guide)

---

## Quick Test Command

```bash
# Test numeric ID endpoint
curl https://api.smrtmart.com/api/v1/products/1

# Should return product with both IDs:
# {
#   "success": true,
#   "data": {
#     "id": "550e8400-...",
#     "numeric_id": 1,
#     "name": "..."
#   }
# }
```

Let me know when the backend is updated, and I'll proceed with the frontend migration!
