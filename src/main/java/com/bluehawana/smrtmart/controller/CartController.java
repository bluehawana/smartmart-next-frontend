package com.bluehawana.smrtmart.controller;

import com.bluehawana.smrtmart.dto.CartItemDTO;
import com.bluehawana.smrtmart.service.CartItemService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class CartController {

    private final CartItemService cartItemService;

    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request) {
        try {
            CartItemDTO itemDTO = new CartItemDTO();
            itemDTO.setProductId(request.getProductId());
            itemDTO.setQuantity(request.getQuantity());
            
            CartItemDTO addedItem = cartItemService.addItem(itemDTO);
            return ResponseEntity.ok(addedItem);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
        }
    }

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart() {
        return ResponseEntity.ok(cartItemService.getAllItems());
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        try {
            cartItemService.removeItem(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Item removed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
        }
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateQuantity(
        @PathVariable Long id,
        @RequestBody UpdateQuantityRequest request
    ) {
        try {
            CartItemDTO updated = cartItemService.updateQuantity(id, request.getQuantity());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
        }
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            cartItemService.clearCart();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cart cleared successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "message", e.getMessage()
                ));
        }
    }
}

@Data
class CartItemRequest {
    private Long productId;
    private Integer quantity;
}

@Data
class UpdateQuantityRequest {
    private Integer quantity;
} 