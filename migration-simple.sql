-- ============================================================================
-- STEP 1: Run this first - Add numeric_id column and populate it
-- ============================================================================

-- Add the column
ALTER TABLE products ADD COLUMN IF NOT EXISTS numeric_id INTEGER;

-- Create sequence
CREATE SEQUENCE IF NOT EXISTS products_numeric_id_seq START WITH 1;

-- Populate with sequential IDs (based on creation date)
WITH ranked_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM products
  WHERE numeric_id IS NULL
)
UPDATE products p
SET numeric_id = rp.row_num
FROM ranked_products rp
WHERE p.id = rp.id;

-- ============================================================================
-- STEP 2: Run this second - Add constraints
-- ============================================================================

-- Make it NOT NULL
ALTER TABLE products ALTER COLUMN numeric_id SET NOT NULL;

-- Add unique constraint
ALTER TABLE products ADD CONSTRAINT products_numeric_id_unique UNIQUE (numeric_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_products_numeric_id ON products(numeric_id);

-- Set default for future products
ALTER TABLE products ALTER COLUMN numeric_id SET DEFAULT nextval('products_numeric_id_seq');

-- Update sequence to current max + 1
SELECT setval('products_numeric_id_seq', (SELECT MAX(numeric_id) FROM products));

-- ============================================================================
-- STEP 3: Verify - Run this to check results
-- ============================================================================

-- Should show all 21 products have numeric_id
SELECT
  COUNT(*) as total_products,
  COUNT(numeric_id) as with_numeric_id,
  MIN(numeric_id) as min_id,
  MAX(numeric_id) as max_id
FROM products;

-- View the mapping
SELECT
  numeric_id,
  LEFT(id::text, 8) || '...' as uuid_short,
  name,
  status
FROM products
ORDER BY numeric_id ASC;

-- Check for duplicates (should be 0)
SELECT COUNT(*)
FROM (
  SELECT numeric_id
  FROM products
  GROUP BY numeric_id
  HAVING COUNT(*) > 1
) duplicates;
