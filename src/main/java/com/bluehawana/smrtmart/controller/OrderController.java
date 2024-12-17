package com.bluehawana.smrtmart.controller;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final CartItemService cartItemService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, List<CartItemDTO>> request) {
        try {
            Stripe.apiKey = stripeSecretKey;
            List<CartItemDTO> items = request.get("items");
            
            if (items == null || items.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Cart is empty"));
            }

            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
            
            for (CartItemDTO item : items) {
                lineItems.add(
                    SessionCreateParams.LineItem.builder()
                        .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount((long)(item.getPrice().doubleValue() * 100))
                                .setProductData(
                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(item.getName())
                                        .setDescription(item.getDescription())
                                        .build()
                                )
                                .build()
                        )
                        .setQuantity((long)item.getQuantity())
                        .build()
                );
            }

            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:3000/cart")
                .addAllLineItem(lineItems)
                .setCustomerCreation(SessionCreateParams.CustomerCreation.ALWAYS)
                .build();

            Session session = Session.create(params);
            
            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (Exception e) {
            log.error("Failed to create checkout session", e);
            return ResponseEntity.status(500)
                .body(Map.of("message", "Failed to create checkout session: " + e.getMessage()));
        }
    }

    // ... 其他方法保持不变
} 