package com.bluehawana.smrtmart.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    public CartItem addToCart(Long productId, Integer quantity) {
        try {
            log.info("Adding product {} to cart with quantity {}", productId, quantity);
            
            // 验证输入
            if (productId == null || quantity == null || quantity < 1) {
                throw new IllegalArgumentException("Invalid product ID or quantity");
            }

            // 添加到购物车的逻辑
            CartItem cartItem = new CartItem();
            cartItem.setProductId(productId);
            cartItem.setQuantity(quantity);
            
            CartItem savedItem = cartRepository.save(cartItem);
            log.info("Successfully added item to cart: {}", savedItem);
            
            return savedItem;
        } catch (Exception e) {
            log.error("Failed to add item to cart", e);
            throw new RuntimeException("Failed to add item to cart: " + e.getMessage());
        }
    }
} 