# Swedish VAT (Moms) Implementation

## Overview
SmrtMart now fully complies with Swedish VAT requirements for electronics sales. All prices include 25% VAT (moms), and customers see clear VAT breakdowns throughout their shopping experience.

## Swedish VAT Requirements

### Legal Requirements
- **VAT Rate**: 25% for electronics in Sweden
- **Price Display**: Must indicate prices include VAT ("inkl. moms")
- **Invoices/Receipts**: Must show VAT breakdown separately
- **Format**: Swedish number formatting (1 234,56 kr)

### Implementation

## VAT Calculation

### Formula
For VAT-inclusive prices (which is what we use):

```
Price including VAT: 199 kr
Price excluding VAT = 199 / 1.25 = 159.20 kr
VAT amount = 199 - 159.20 = 39.80 kr
```

### Example: Mtag Tracker (199 kr)

| Component | Amount |
|-----------|--------|
| **Price (incl. VAT)** | 199 kr |
| Price (excl. VAT) | 159.20 kr |
| **VAT (25%)** | 39.80 kr |

### Example: Cart with Multiple Items

**Cart Contents:**
- Mtag Tracker × 2 @ 199 kr each = 398 kr
- MacBook Case × 1 @ 890 kr = 890 kr

**VAT Breakdown:**
```
Mtag Tracker (2 units):
  - Total incl. VAT: 398 kr
  - VAT portion: 79.60 kr

MacBook Case (1 unit):
  - Total incl. VAT: 890 kr
  - VAT portion: 178 kr

Cart Total:
  - Subtotal (inkl. moms): 1,288 kr
  - VAT amount (25%): 257.60 kr
  - Total to pay: 1,288 kr
```

## Implementation Details

### 1. VAT Utility Library (`src/lib/vat.ts`)

```typescript
// Calculate VAT amount from inclusive price
calculateVATAmount(199) // Returns: 39.80

// Calculate price without VAT
calculatePriceExcludingVAT(199) // Returns: 159.20

// Get complete VAT breakdown
getVATBreakdown(199)
// Returns: {
//   totalInclVAT: 199,
//   totalExclVAT: 159.20,
//   vatAmount: 39.80,
//   vatRate: 0.25,
//   vatRatePercent: "25%"
// }

// Get cart-wide VAT breakdown
getCartVATBreakdown(items)
// Returns detailed breakdown for all cart items
```

### 2. Product Display

**Product Cards** (`ProductCard.tsx`):
```
┌─────────────────────┐
│   Product Image     │
├─────────────────────┤
│ Product Name        │
│ 199 kr              │
│ inkl. 25% moms      │← VAT indicator
│                     │
│  [Add to Cart]      │
└─────────────────────┘
```

### 3. Cart Display

**Cart Summary** (`cart/page.tsx`):
```
Order Summary
─────────────────────────────
Subtotal (inkl. moms)   199 kr
  - varav moms (25%)     39.80 kr  ← VAT breakdown
Shipping                    Free
─────────────────────────────
Total                   199 kr
                  Inkl. 25% moms
```

### 4. Checkout Display

**Checkout Summary** (`checkout/page.tsx`):
```
Order Summary
─────────────────────────────
Mtag Tracker              199 kr
Quantity: 1

Subtotal (inkl. moms):  199 kr
  - varav moms (25%):    39.80 kr  ← VAT breakdown
Shipping:                   Free
─────────────────────────────
Total:                  199 kr
                  Inkl. 25% moms
```

### 5. Order Confirmation Email

**Email Template** (`email.ts`):
```
Order Details
═══════════════════════════════
Mtag Tracker
Quantity: 1              199 kr
───────────────────────────────
Subtotal (inkl. moms):  199 kr
  - varav moms (25%):    39.80 kr  ← VAT in email
Shipping:                   Free
═══════════════════════════════
Total:                  199 kr
                  Inkl. 25% moms
```

## Where VAT is Displayed

✅ **Product Listing Pages**
- Price in Swedish krona (kr)
- "inkl. 25% moms" label

✅ **Product Detail Pages**
- Price with VAT indicator

✅ **Shopping Cart**
- Subtotal (inkl. moms)
- VAT amount breakdown
- Total with VAT note

✅ **Checkout Page**
- Complete VAT breakdown
- Total with VAT note

✅ **Order Confirmation Emails**
- Professional VAT breakdown
- Complies with invoice requirements

✅ **Cart Sidebar**
- Total with VAT indicator

## Swedish Number Formatting

All prices use Swedish locale formatting:

```javascript
price.toLocaleString('sv-SE')

Examples:
199       → "199 kr"
1234.56   → "1 234,56 kr"
9999.99   → "9 999,99 kr"
```

## Compliance Checklist

✅ **Price Display**
- [x] All prices in Swedish krona (kr)
- [x] "inkl. moms" or "inkl. 25% moms" displayed
- [x] Swedish number formatting used

✅ **VAT Breakdown**
- [x] Cart shows VAT amount separately
- [x] Checkout shows VAT amount separately
- [x] Order confirmations include VAT details

✅ **Calculations**
- [x] VAT calculated correctly (Price / 1.25 × 0.25)
- [x] Rounding to 2 decimal places
- [x] Total matches sum of items

✅ **Legal Requirements**
- [x] Complies with Swedish E-commerce Law
- [x] Complies with EU VAT Directive
- [x] Invoice/receipt shows VAT breakdown

## Testing

### Manual Testing
1. **Product Page**
   - Verify price shows "kr" not "€"
   - Verify "inkl. 25% moms" is visible

2. **Add to Cart**
   - Add Mtag (199 kr)
   - Check cart shows VAT breakdown
   - Verify: VAT amount = 39.80 kr

3. **Checkout**
   - Proceed to checkout
   - Verify VAT breakdown in order summary
   - Total should be 199 kr (inkl. moms)

4. **Order Confirmation**
   - Complete purchase
   - Check email includes VAT breakdown
   - Verify calculations are correct

### Automated Testing
```bash
# Test VAT calculations
npm test src/lib/vat.test.ts

# Example tests:
- calculateVATAmount(199) === 39.80
- calculatePriceExcludingVAT(199) === 159.20
- getVATBreakdown(199).vatAmount === 39.80
```

## Example Calculations

### Single Product
```
Product: Mtag Tracker
Price: 199 kr (incl. VAT)

Breakdown:
- Price excl. VAT: 159.20 kr
- VAT (25%):       39.80 kr
- Total:          199.00 kr
```

### Multiple Products
```
Cart:
1. Mtag Tracker × 2     = 398 kr
2. MacBook Case × 1     = 890 kr
3. Charging Cable × 1   = 599 kr
   ─────────────────────────────
   Subtotal:            1,887 kr

VAT Breakdown:
- Total incl. VAT:     1,887.00 kr
- Total excl. VAT:     1,509.60 kr
- VAT amount (25%):      377.40 kr
```

## Support

If customers have questions about VAT:

**Common Questions:**

Q: Why do I see "inkl. moms"?
A: This indicates the price includes 25% Swedish VAT (Value Added Tax), as required by Swedish law.

Q: Can I get a VAT refund?
A: Business customers with a valid Swedish VAT number can request VAT invoices. Contact support with your VAT number.

Q: Is VAT included in shipping?
A: Shipping is free, so there's no additional VAT on shipping costs.

## Future Enhancements

### Planned Features:
- [ ] VAT invoice generation for B2B customers
- [ ] EU reverse charge for business customers
- [ ] VAT exemption for exports outside EU
- [ ] Downloadable PDF receipts with VAT breakdown

## Resources

- Swedish Tax Agency (Skatteverket): https://www.skatteverket.se/
- EU VAT Directive: https://ec.europa.eu/taxation_customs/business/vat_en
- Swedish E-commerce Law: https://www.konsumentverket.se/

---

**Last Updated**: 2025-11-20
**VAT Rate**: 25% (Standard rate for electronics in Sweden)
**Currency**: Swedish Krona (SEK/kr)
