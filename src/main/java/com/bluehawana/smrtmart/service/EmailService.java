package com.bluehawana.smrtmart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.internet.MimeMessage;

@Service
@Slf4j
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOrderConfirmation(String toEmail, String orderId, double total) {
        try {
            log.info("Preparing to send order confirmation email to: {}", toEmail);
            
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
            
            log.info("Sending email...");
            mailSender.send(message);
            log.info("Email sent successfully");
            
        } catch (Exception e) {
            log.error("Failed to send email", e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
} 