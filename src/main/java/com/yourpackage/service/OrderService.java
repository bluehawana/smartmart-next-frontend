package com.yourpackage.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Session;
import com.yourpackage.entity.Order;
import com.yourpackage.repository.OrderRepository;
import com.yourpackage.service.EmailService;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private Stripe stripe;
    
    public void confirmOrder(String sessionId) throws StripeException {
        Session session = Session.retrieve(sessionId);
        
        // 创建订单记录
        Order order = new Order();
        order.setSessionId(sessionId);
        order.setEmail(session.getCustomerEmail());
        order.setTotal(new BigDecimal(session.getAmountTotal()).divide(new BigDecimal(100)));
        order.setStatus("PAID");
        order.setCreatedAt(LocalDateTime.now());
        
        // 保存订单
        orderRepository.save(order);
        
        // 发送确认邮件
        sendOrderConfirmationEmail(order);
    }
    
    private void sendOrderConfirmationEmail(Order order) {
        String subject = "Order Confirmation - Thank you for your purchase!";
        String content = createEmailContent(order);
        emailService.sendEmail(order.getEmail(), subject, content);
    }
    
    private String createEmailContent(Order order) {
        return """
            Dear Customer,
            
            Thank you for your purchase! Your order has been confirmed.
            
            Order Details:
            Order ID: %s
            Total Amount: €%.2f
            
            You will receive shipping information shortly.
            
            Best regards,
            Your Store Team
            """.formatted(order.getId(), order.getTotal());
    }
} 