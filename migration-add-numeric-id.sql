-- ============================================================================
-- SmartMart: UUID to Numeric ID Migration Script
-- ============================================================================
-- Description: Adds numeric_id column to products table for better API management
-- Database: Supabase PostgreSQL
-- Date: 2025-10-25
-- ============================================================================

-- STEP 1: Add numeric_id column to products table
-- ============================================================================
ALTER TABLE products
ADD COLUMN IF NOT EXISTS numeric_id INTEGER;

-- STEP 2: Create a sequence for numeric_id (if not exists)
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'products_numeric_id_seq') THEN
    CREATE SEQUENCE products_numeric_id_seq START WITH 1;
  END IF;
END $$;

-- STEP 3: Populate numeric_id for existing products
-- ============================================================================
-- This assigns sequential numeric IDs to all existing products
-- Order by created_at to maintain chronological order
UPDATE products
SET numeric_id = nextval('products_numeric_id_seq')
WHERE numeric_id IS NULL
ORDER BY created_at ASC;

-- Alternative: If you want to assign specific numeric IDs to specific products
-- (based on your current hardcoded mappings), uncomment and run these instead:

/*
-- Map specific UUIDs to specific numeric IDs to match your frontend mappings
UPDATE products SET numeric_id = 1 WHERE id = '7a82d048-b478-4b4b-8b78-64eeb3a7ab86'; -- Sony WH-1000XM5 Headphones
UPDATE products SET numeric_id = 2 WHERE id = '88d35c54-ce2d-40d5-92e9-4af5c7e5e330'; -- MacBook Pro 16-inch
UPDATE products SET numeric_id = 3 WHERE id = 'c0d069ee-031f-4340-8588-4706103e6b04'; -- AirPods Pro 2nd Generation
UPDATE products SET numeric_id = 4 WHERE id = 'a4e33218-57c3-4133-ac51-ca9aa711eddb'; -- Dell Alienware 34 Curved Monitor
UPDATE products SET numeric_id = 5 WHERE id = 'a87117d8-e9dd-49ab-a131-245cff3cbf2d'; -- AI Translate Earphones Pro
UPDATE products SET numeric_id = 6 WHERE id = 'ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1'; -- Apple Watch Ultra
UPDATE products SET numeric_id = 7 WHERE id = '611bac4c-ef16-484e-899d-1e7992819a88'; -- Dell XPS 13 Laptop
UPDATE products SET numeric_id = 8 WHERE id = 'eed7ffb1-5dc5-45fe-8e77-63430419dce3'; -- Smart Language Translator Buds
UPDATE products SET numeric_id = 9 WHERE id = 'a3f5302f-f496-4211-9737-e55de3b526c2'; -- Dell XPS 15 Developer Edition
UPDATE products SET numeric_id = 10 WHERE id = '4dc6d3bf-ec23-4c1b-b47d-f156c82e92fa'; -- iPhone 15 Pro Max
UPDATE products SET numeric_id = 11 WHERE id = '13e2b89d-4f65-4ad0-8c4a-5150657e5bde'; -- ASUS ROG Rapture GT-BE98 Gaming Router

-- Then assign sequential IDs to remaining products
WITH numbered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) + 11 as new_id
  FROM products
  WHERE numeric_id IS NULL
)
UPDATE products p
SET numeric_id = np.new_id
FROM numbered_products np
WHERE p.id = np.id;
*/

-- STEP 4: Add constraints
-- ============================================================================
-- Make numeric_id NOT NULL after populating
ALTER TABLE products
ALTER COLUMN numeric_id SET NOT NULL;

-- Add unique constraint
ALTER TABLE products
ADD CONSTRAINT products_numeric_id_unique UNIQUE (numeric_id);

-- STEP 5: Create index for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_numeric_id
ON products(numeric_id);

-- STEP 6: Set default for new products
-- ============================================================================
ALTER TABLE products
ALTER COLUMN numeric_id SET DEFAULT nextval('products_numeric_id_seq');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the migration was successful

-- Check that all products have numeric_id
SELECT
  COUNT(*) as total_products,
  COUNT(numeric_id) as products_with_numeric_id,
  COUNT(*) - COUNT(numeric_id) as missing_numeric_id
FROM products;

-- View the mapping of UUID to numeric_id
SELECT
  numeric_id,
  id as uuid,
  name,
  created_at
FROM products
ORDER BY numeric_id ASC;

-- Check for duplicate numeric_ids (should return 0)
SELECT numeric_id, COUNT(*)
FROM products
GROUP BY numeric_id
HAVING COUNT(*) > 1;

-- ============================================================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================================================
-- Run this if you need to undo the migration

/*
-- Remove constraints
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_numeric_id_unique;
DROP INDEX IF EXISTS idx_products_numeric_id;

-- Remove column
ALTER TABLE products DROP COLUMN IF EXISTS numeric_id;

-- Drop sequence
DROP SEQUENCE IF EXISTS products_numeric_id_seq;
*/

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. This migration is safe to run multiple times (uses IF NOT EXISTS)
-- 2. Existing UUID primary key (id) is preserved
-- 3. numeric_id is added as a separate, unique column
-- 4. Both IDs can be used for lookups (UUID internally, numeric for API)
-- 5. New products will automatically get sequential numeric_id
