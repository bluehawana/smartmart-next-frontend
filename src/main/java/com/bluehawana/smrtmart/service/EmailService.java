package com.bluehawana.smrtmart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOrderConfirmation(String toEmail, String orderId, double total) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Order Confirmation - SmartMart");

            String content = String.format("""
                Dear Customer,
                
                Thank you for your purchase! Your order has been confirmed.
                
                Order Details:
                Order ID: %s
                Total Amount: €%.2f
                
                We will process your order shortly.
                
                Best regards,
                SmartMart Team
                """, orderId, total);

            helper.setText(content, false);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
} 