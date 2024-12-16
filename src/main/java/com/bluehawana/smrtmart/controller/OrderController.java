package com.bluehawana.smrtmart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private EmailService emailService;
    
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(@RequestBody OrderConfirmRequest request) {
        try {
            // 获取 Stripe session 信息
            Session session = Session.retrieve(request.getSessionId());
            
            // 发送确认邮件
            emailService.sendOrderConfirmation(
                session.getCustomerEmail(),
                request.getSessionId(),
                session.getAmountTotal() / 100.0
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Order confirmed and email sent"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "message", "Failed to confirm order: " + e.getMessage()
                ));
        }
    }
}

class OrderConfirmRequest {
    private String sessionId;
    // getters and setters
} 