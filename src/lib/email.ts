import Mailjet from "node-mailjet"
import { getCartVATBreakdown } from "./vat"

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || "",
  process.env.MAILJET_SECRET_KEY || ""
)

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string
  url: string
}) {
  console.log('============================================')
  console.log('[Mailjet] 🚀 FUNCTION CALLED - Starting to send magic link email...')
  console.log('[Mailjet] Recipient:', email)
  console.log('[Mailjet] URL:', url)
  console.log('[Mailjet] API Key:', process.env.MAILJET_API_KEY ? `SET (${process.env.MAILJET_API_KEY.substring(0,8)}...)` : '❌ NOT SET')
  console.log('[Mailjet] Secret Key:', process.env.MAILJET_SECRET_KEY ? `SET (${process.env.MAILJET_SECRET_KEY.substring(0,8)}...)` : '❌ NOT SET')
  console.log('============================================')

  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "noreply@smrtmart.com",
            Name: "SmrtMart",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Sign in to SmrtMart",
          HTMLPart: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sign in to SmrtMart</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; text-align: center;">
                  <h1 style="color: #000000; margin: 0 0 20px 0; font-size: 24px; font-weight: 500;">Welcome to SmrtMart</h1>
                  <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 14px;">
                    Click the button below to sign in to your account
                  </p>
                  <a href="${url}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 32px; text-decoration: none; font-weight: 500; font-size: 14px;">
                    Sign in to SmrtMart
                  </a>
                  <p style="color: #9ca3af; margin: 30px 0 0 0; font-size: 12px;">
                    This link will expire in 10 minutes. If you didn't request this email, you can safely ignore it.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  <p style="color: #9ca3af; margin: 0; font-size: 11px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${url}" style="color: #6b7280; word-break: break-all;">${url}</a>
                  </p>
                </div>
              </body>
            </html>
          `,
        },
      ],
    })

    const result = await request

    console.log('[Mailjet] Response status:', result.response.status)
    console.log('[Mailjet] Response body:', JSON.stringify(result.body))

    if (result.response.status !== 200) {
      console.error("[Mailjet] Failed to send magic link email - non-200 status:", result.body)
      throw new Error("Failed to send email")
    }

    console.log('[Mailjet] Magic link email sent successfully!')
    return result.body
  } catch (error) {
    console.error("[Mailjet] Error sending magic link email:", error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error("[Mailjet] Error name:", error.name)
      console.error("[Mailjet] Error message:", error.message)
      console.error("[Mailjet] Error stack:", error.stack)
    }
    throw error
  }
}

interface OrderItem {
  productName: string
  quantity: number
  price: number
  imageUrl?: string
}

export async function sendOrderConfirmationEmail({
  email,
  orderNumber,
  orderDate,
  totalAmount,
  items,
  customerName,
}: {
  email: string
  orderNumber: string
  orderDate: Date
  totalAmount: number
  items: OrderItem[]
  customerName?: string
}) {
  try {
    // Calculate VAT breakdown
    const vatBreakdown = getCartVATBreakdown(
      items.map(item => ({
        name: item.productName,
        price: item.price,
        quantity: item.quantity
      }))
    )

    const itemsHtml = items
      .map(
        (item) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
              <div style="font-weight: 600; color: #111827;">${item.productName}</div>
              <div style="color: #6b7280; font-size: 14px;">Quantity: ${item.quantity}</div>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
              ${(item.price * item.quantity).toLocaleString("sv-SE")} kr
            </td>
          </tr>
        `
      )
      .join("")

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "noreply@smrtmart.com",
            Name: "SmrtMart",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: `Order Confirmation #${orderNumber} - SmrtMart`,
          HTMLPart: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #111827; margin: 0 0 10px 0; font-size: 28px;">Order Confirmed!</h1>
                <p style="color: #6b7280; margin: 0; font-size: 16px;">
                  Thank you for your order${customerName ? `, ${customerName}` : ""}!
                </p>
              </div>

              <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Order Number:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111827;">#${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Order Date:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #111827;">${orderDate.toLocaleDateString(
                      "sv-SE",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}</td>
                  </tr>
                </table>
              </div>

              <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px 0;">Order Details</h2>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${itemsHtml}
                <tr>
                  <td style="padding: 12px 12px 4px 12px; text-align: right; color: #6b7280;">
                    Subtotal (inkl. moms):
                  </td>
                  <td style="padding: 12px 12px 4px 12px; text-align: right; color: #111827; font-weight: 600;">
                    ${totalAmount.toLocaleString("sv-SE")} kr
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 12px 4px 24px; text-align: right; color: #9ca3af; font-size: 14px;">
                    - varav moms (25%):
                  </td>
                  <td style="padding: 4px 12px 4px 12px; text-align: right; color: #9ca3af; font-size: 14px;">
                    ${vatBreakdown.vatAmount.toLocaleString("sv-SE")} kr
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 12px 12px 12px; text-align: right; color: #6b7280;">
                    Shipping:
                  </td>
                  <td style="padding: 4px 12px 12px 12px; text-align: right; color: #111827; font-weight: 600;">
                    Free
                  </td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 16px 12px 8px 12px; text-align: right; font-size: 18px; font-weight: 700; color: #111827;">
                    Total:
                  </td>
                  <td style="padding: 16px 12px 8px 12px; text-align: right; font-size: 18px; font-weight: 700; color: #111827;">
                    ${totalAmount.toLocaleString("sv-SE")} kr
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 0 12px 12px 12px; text-align: right; font-size: 12px; color: #9ca3af;">
                    Inkl. 25% moms
                  </td>
                </tr>
              </table>

              <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 6px; margin: 30px 0;">
                <p style="margin: 0; color: #166534; font-weight: 600;">
                  We'll send you a shipping confirmation email as soon as your order ships.
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <a href="https://www.smrtmart.com/profile" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Order Status
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                  Questions? Contact us at <a href="mailto:info@smrtmart.com" style="color: #000000;">info@smrtmart.com</a>
                </p>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                  © ${new Date().getFullYear()} SmrtMart. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
        },
      ],
    })

    const result = await request

    if (result.response.status !== 200) {
      console.error("Failed to send order confirmation email:", result.body)
      throw new Error("Failed to send email")
    }

    return result.body
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    throw error
  }
}

export async function sendOrderStatusUpdateEmail({
  email,
  orderNumber,
  status,
  customerName,
}: {
  email: string
  orderNumber: string
  status: string
  customerName?: string
}) {
  const statusMessages = {
    processing: {
      title: "Your Order is Being Processed",
      message: "We're preparing your order for shipment.",
      color: "#3b82f6",
    },
    shipped: {
      title: "Your Order Has Shipped!",
      message: "Your order is on its way to you.",
      color: "#8b5cf6",
    },
    completed: {
      title: "Your Order Has Been Delivered",
      message: "We hope you enjoy your purchase!",
      color: "#22c55e",
    },
    cancelled: {
      title: "Your Order Has Been Cancelled",
      message: "Your order has been cancelled as requested.",
      color: "#ef4444",
    },
  }

  const statusInfo = statusMessages[status as keyof typeof statusMessages] || {
    title: "Order Status Update",
    message: `Your order status has been updated to: ${status}`,
    color: "#6b7280",
  }

  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "noreply@smrtmart.com",
            Name: "SmrtMart",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: `${statusInfo.title} #${orderNumber} - SmrtMart`,
          HTMLPart: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Status Update</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background-color: ${statusInfo.color}20; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 30px; height: 30px; background-color: ${statusInfo.color}; border-radius: 50%;"></div>
                </div>
                <h1 style="color: #111827; margin: 0 0 10px 0; font-size: 24px;">${statusInfo.title}</h1>
                <p style="color: #6b7280; margin: 0; font-size: 16px;">
                  Order #${orderNumber}
                </p>
              </div>

              <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 30px; text-align: center;">
                <p style="color: #111827; margin: 0; font-size: 16px;">
                  ${customerName ? `Hi ${customerName}, ` : ""}${statusInfo.message}
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://www.smrtmart.com/profile" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Track Your Order
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                  Questions? Contact us at <a href="mailto:info@smrtmart.com" style="color: #000000;">info@smrtmart.com</a>
                </p>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                  © ${new Date().getFullYear()} SmrtMart. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
        },
      ],
    })

    const result = await request

    if (result.response.status !== 200) {
      console.error("Failed to send order status update email:", result.body)
      throw new Error("Failed to send email")
    }

    return result.body
  } catch (error) {
    console.error("Error sending order status update email:", error)
    throw error
  }
}
