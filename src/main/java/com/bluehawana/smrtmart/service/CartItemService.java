package com.bluehawana.smrtmart.service;

import com.bluehawana.smrtmart.dto.CartItemDTO;
import com.bluehawana.smrtmart.model.CartItem;
import com.bluehawana.smrtmart.model.Product;
import com.bluehawana.smrtmart.repository.CartItemRepository;
import com.bluehawana.smrtmart.repository.ProductRepository;
import com.bluehawana.smrtmart.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartItemDTO addItem(CartItemDTO itemDTO) {
        log.info("Adding item to cart: {}", itemDTO);

        try {
            // 查找商品信息
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            // 检查是否已存在该商品
            CartItem existingItem = cartItemRepository.findByProductId(itemDTO.getProductId());

            if (existingItem != null) {
                log.info("Updating existing cart item: {}", existingItem);
                // 如果存在，更新数量
                existingItem.setQuantity(existingItem.getQuantity() + itemDTO.getQuantity());
                CartItem savedItem = cartItemRepository.save(existingItem);
                return convertToDTO(savedItem, product);
            }

            log.info("Creating new cart item for product: {}", product);
            // 如果不存在，创建新的购物车项
            CartItem newItem = new CartItem();
            newItem.setProductId(itemDTO.getProductId());
            newItem.setName(product.getName());
            newItem.setPrice(BigDecimal.valueOf(product.getPrice()));
            newItem.setQuantity(itemDTO.getQuantity());

            CartItem savedItem = cartItemRepository.save(newItem);
            log.info("Successfully saved cart item: {}", savedItem);
            return convertToDTO(savedItem, product);
        } catch (Exception e) {
            log.error("Error adding item to cart", e);
            throw new RuntimeException("Failed to add item to cart: " + e.getMessage(), e);
        }
    }

    private CartItemDTO convertToDTO(CartItem item, Product product) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProductId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setProduct(product);
        return dto;
    }

    // ... 其他方法保持不变
} 