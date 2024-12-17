-- 如果表已存在，先删除
DROP TABLE IF EXISTS cart_items;

-- 重新创建表
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(255),
    price DECIMAL(10,2),
    quantity INTEGER,
    created_at TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id); 