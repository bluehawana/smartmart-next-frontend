package com.yourpackage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(@RequestBody OrderConfirmRequest request) {
        try {
            orderService.confirmOrder(request.getSessionId());
            return ResponseEntity.ok(new ApiResponse(true, "Order confirmed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(new ApiResponse(false, "Failed to confirm order: " + e.getMessage()));
        }
    }
} 