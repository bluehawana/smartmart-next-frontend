package com.bluehawana.smrtmart.config;

import com.stripe.Stripe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class StripeConfig {
    
    @Value("${stripe.secret.key}")
    private String secretKey;
    
    @PostConstruct
    public void init() {
        log.info("Initializing Stripe configuration...");
        Stripe.apiKey = secretKey;
        log.info("Stripe configuration initialized successfully");
    }
} 