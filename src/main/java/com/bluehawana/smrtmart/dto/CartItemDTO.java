package com.bluehawana.smrtmart.dto;

import lombok.Data;
import java.math.BigDecimal;
import com.bluehawana.smrtmart.model.Product;

@Data
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private Product product;

    public String getDescription() {
        return name + (product != null ? product.getDescription() : "") + quantity;
    }
} 