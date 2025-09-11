-- Update products to use simple filenames instead of full R2/CloudFront URLs
-- This script extracts the filename from the URL and updates the images array

-- Product 1: Sony WH-1000XM5 Headphones
UPDATE products SET images = ARRAY['sony.jpg'] WHERE numeric_id = 1;

-- Product 2: MacBook Pro 16-inch
UPDATE products SET images = ARRAY['macbook.jpg'] WHERE numeric_id = 2;

-- Product 3: AirPods Pro 2nd Generation
UPDATE products SET images = ARRAY['airpods2.jpg'] WHERE numeric_id = 3;

-- Product 4: Dell Alienware 34 Curved Monitor
UPDATE products SET images = ARRAY['ultra.jpg'] WHERE numeric_id = 4;

-- Product 5: AI Translate Earphones Pro
UPDATE products SET images = ARRAY['ai-translate-pro.jpg'] WHERE numeric_id = 5;

-- Product 6: Apple Watch Ultra
UPDATE products SET images = ARRAY['ultra.jpg'] WHERE numeric_id = 6;

-- Product 7: Dell XPS 13 Laptop
UPDATE products SET images = ARRAY['dell.jpg'] WHERE numeric_id = 7;

-- Product 8: Smart Language Translator Buds
UPDATE products SET images = ARRAY['smart-translator.jpg'] WHERE numeric_id = 8;

-- Product 9: Dell XPS 15 Developer Edition (already using Supabase)
UPDATE products SET images = ARRAY['dell-xps-15-2023.jpg'] WHERE numeric_id = 9;

-- Product 10: iPhone 15 Pro Max (already using simple filename)
-- No update needed, already has simple filename

-- Product 11: ASUS ROG Rapture GT-BE98 Gaming Router
UPDATE products SET images = ARRAY['asus.jpg'] WHERE numeric_id = 11;

-- Product 12: Braided Magnetic Charging Cable with Organizer Clip
UPDATE products SET images = ARRAY['usb-c-iphone-cable.jpg'] WHERE numeric_id = 12;

-- Product 13: Dell Thunderbolt 5/USB4 Full-Featured Dual Type-C Data Cable
UPDATE products SET images = ARRAY['8k-data-cable-dell.jpg'] WHERE numeric_id = 13;

-- Product 14: Apple iPhone 13/13 Pro MagSafe Liquid Silicone Case
UPDATE products SET images = ARRAY['iphone16-promaxcase.jpg'] WHERE numeric_id = 14;

-- Product 15: Apple 29W USB-C Power Adapter A1534
UPDATE products SET images = ARRAY['macbookair-adaptor-and-cable.png'] WHERE numeric_id = 15;

-- Product 16: MacBook Air M3 13-inch Protective Case - Grass Green
UPDATE products SET images = ARRAY['macbookair-m3-weaving-case.jpg'] WHERE numeric_id = 16;

-- Product 17: MacBook Pro MagSafe 3 Charging Cable - Midnight Blue
UPDATE products SET images = ARRAY['macbook-m4-charging-cable.png'] WHERE numeric_id = 17;

-- Product 18: Huawei GT2 Pro Smart Watch - Phantom Black
UPDATE products SET images = ARRAY['huaweismartwatch.jpg'] WHERE numeric_id = 18;

-- Product 19 & 20: Keep their current filenames (already correct)
-- No updates needed for products 19 and 20

-- Product 21: MacBook Air M3 Power Adapter and Cable (CloudFront URL)
UPDATE products SET images = ARRAY['macbookair-adaptor-and-cable.png'] WHERE numeric_id = 21;