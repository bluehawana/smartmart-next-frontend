-- 删除已存在的表
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- 创建产品表
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建购物车项表
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 创建订单表
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_orders_session_id ON orders(session_id);

-- 插入一些示例产品数据
INSERT INTO products (name, description, price, image) VALUES
('Apple MacBook Pro 16-inch', 'The most powerful MacBook Pro ever with M2 Pro or M2 Max chip for unprecedented performance and up to 22 hours of battery life.', 3499.99, 'macbook.jpg'),
('Apple AirPods Pro', 'AirPods Pro feature Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio for immersive sound.', 249.99, 'airpods2.jpg'),
('Sony WH-1000XM5', 'Industry-leading noise cancellation with two processors and eight microphones for crystal clear audio quality.', 399.99, 'sony.jpg'),
('Dell XPS 13', 'The smallest 13-inch laptop with InfinityEdge display and 12th Gen Intel Core processors for ultimate performance.', 1299.99, 'xps.jpg'),
('Dell Alienware 34', '34-inch curved QD-OLED gaming monitor with 175Hz refresh rate and true 0.1ms response time for immersive gaming.', 999.99, 'dell.jpg'),
('Apple Watch Ultra', 'The most rugged and capable Apple Watch with precision dual-frequency GPS and up to 36 hours of battery life.', 799.99, 'ultra.jpg'); 