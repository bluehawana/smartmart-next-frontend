package com.bluehawana.smrtmart.repository;

import com.bluehawana.smrtmart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.productId = :productId")
    CartItem findByProductId(@Param("productId") Long productId);
} 