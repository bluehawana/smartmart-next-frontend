/**
 * Swedish VAT (moms) utilities for SmrtMart
 *
 * Sweden requires 25% VAT on electronics.
 * Prices in the system are VAT-inclusive (the final price customers pay).
 */

// Swedish VAT rate for electronics
export const SWEDISH_VAT_RATE = 0.25 // 25%

/**
 * Calculate VAT amount from a VAT-inclusive price
 * Formula: VAT = Price - (Price / (1 + VAT_RATE))
 *
 * Example: 199 kr including 25% VAT
 * - Price excluding VAT: 199 / 1.25 = 159.20 kr
 * - VAT amount: 199 - 159.20 = 39.80 kr
 */
export function calculateVATAmount(priceInclVAT: number): number {
  const priceExclVAT = priceInclVAT / (1 + SWEDISH_VAT_RATE)
  const vatAmount = priceInclVAT - priceExclVAT
  return Math.round(vatAmount * 100) / 100 // Round to 2 decimals
}

/**
 * Calculate price excluding VAT from VAT-inclusive price
 */
export function calculatePriceExcludingVAT(priceInclVAT: number): number {
  const priceExclVAT = priceInclVAT / (1 + SWEDISH_VAT_RATE)
  return Math.round(priceExclVAT * 100) / 100 // Round to 2 decimals
}

/**
 * Get VAT breakdown for display
 * Returns an object with all VAT-related amounts
 */
export interface VATBreakdown {
  totalInclVAT: number
  totalExclVAT: number
  vatAmount: number
  vatRate: number
  vatRatePercent: string
}

export function getVATBreakdown(priceInclVAT: number): VATBreakdown {
  const totalExclVAT = calculatePriceExcludingVAT(priceInclVAT)
  const vatAmount = calculateVATAmount(priceInclVAT)

  return {
    totalInclVAT: priceInclVAT,
    totalExclVAT,
    vatAmount,
    vatRate: SWEDISH_VAT_RATE,
    vatRatePercent: `${SWEDISH_VAT_RATE * 100}%`,
  }
}

/**
 * Format price in Swedish format
 * Example: 1234.56 → "1 234,56 kr"
 */
export function formatSwedishPrice(price: number): string {
  return price.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) + ' kr'
}

/**
 * Format price with VAT indicator
 * Example: "199 kr inkl. moms"
 */
export function formatPriceWithVAT(price: number, showVATRate: boolean = false): string {
  const formattedPrice = formatSwedishPrice(price)
  if (showVATRate) {
    return `${formattedPrice} (inkl. ${SWEDISH_VAT_RATE * 100}% moms)`
  }
  return `${formattedPrice} inkl. moms`
}

/**
 * Get cart total VAT breakdown
 * For use in cart and checkout pages
 */
export interface CartVATBreakdown extends VATBreakdown {
  items: Array<{
    name: string
    quantity: number
    priceInclVAT: number
    priceExclVAT: number
    vatAmount: number
    totalInclVAT: number
    totalExclVAT: number
    totalVAT: number
  }>
}

export function getCartVATBreakdown(
  items: Array<{ name: string; price: number; quantity: number }>
): CartVATBreakdown {
  const itemBreakdowns = items.map((item) => {
    const priceExclVAT = calculatePriceExcludingVAT(item.price)
    const vatAmount = calculateVATAmount(item.price)
    const totalInclVAT = item.price * item.quantity
    const totalExclVAT = priceExclVAT * item.quantity
    const totalVAT = vatAmount * item.quantity

    return {
      name: item.name,
      quantity: item.quantity,
      priceInclVAT: item.price,
      priceExclVAT,
      vatAmount,
      totalInclVAT,
      totalExclVAT,
      totalVAT,
    }
  })

  const totalInclVAT = itemBreakdowns.reduce((sum, item) => sum + item.totalInclVAT, 0)
  const totalExclVAT = itemBreakdowns.reduce((sum, item) => sum + item.totalExclVAT, 0)
  const vatAmount = itemBreakdowns.reduce((sum, item) => sum + item.totalVAT, 0)

  return {
    totalInclVAT,
    totalExclVAT,
    vatAmount,
    vatRate: SWEDISH_VAT_RATE,
    vatRatePercent: `${SWEDISH_VAT_RATE * 100}%`,
    items: itemBreakdowns,
  }
}
