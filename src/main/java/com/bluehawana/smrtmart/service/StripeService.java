package com.bluehawana.smrtmart.service;

import com.stripe.Stripe;
import com.stripe.model.Session;
import com.stripe.param.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StripeService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public String createCheckoutSession(CheckoutRequest request) {
        try {
            Stripe.apiKey = stripeSecretKey;

            List<SessionCreateParams.LineItem> lineItems = request.getItems().stream()
                .map(item -> SessionCreateParams.LineItem.builder()
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("eur")
                        .setUnitAmount((long)(item.getPrice() * 100))
                        .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(item.getName())
                            .build())
                        .build())
                    .setQuantity(Long.valueOf(item.getQuantity()))
                    .build())
                .collect(Collectors.toList());

            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:3000/cart")
                .addAllLineItem(lineItems)
                .setPaymentMethodTypes(Arrays.asList("card"))
                .setBillingAddressCollection(SessionCreateParams.BillingAddressCollection.REQUIRED)
                .setCollectShippingAddress(true)
                .setShippingAddressCollection(
                    SessionCreateParams.ShippingAddressCollection.builder()
                        .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.SE)
                        .build()
                )
                .setCustomerCreation(SessionCreateParams.CustomerCreation.ALWAYS)
                .build();

            Session session = Session.create(params);
            log.info("Created Stripe session: {}", session.getId());
            return session.getUrl();
        } catch (Exception e) {
            log.error("Failed to create checkout session", e);
            throw new RuntimeException("Failed to create checkout session", e);
        }
    }
}

@Data
class CheckoutRequest {
    private List<CartItem> items;
} 