'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', orderNumber: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6">Customer Support</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Need help with your order? Have questions about our products? We're here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light text-black mb-8">How Can We Help?</h2>

              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 p-4">
                  <h3 className="font-medium text-black mb-2">📦 Order Inquiries</h3>
                  <p className="text-gray-600 text-sm">Questions about your order status, shipping, or delivery</p>
                </div>

                <div className="bg-gray-50 p-4">
                  <h3 className="font-medium text-black mb-2">↩️ Returns & Refunds</h3>
                  <p className="text-gray-600 text-sm">30-day return policy for unused items in original condition</p>
                </div>

                <div className="bg-gray-50 p-4">
                  <h3 className="font-medium text-black mb-2">📧 Product Support</h3>
                  <p className="text-gray-600 text-sm">Setup help, troubleshooting, and usage guidance</p>
                </div>

                <div className="bg-gray-50 p-4">
                  <h3 className="font-medium text-black mb-2">❓ General Questions</h3>
                  <p className="text-gray-600 text-sm">Any other questions about Mtag, Mcard, or SmrtMart</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Location</h3>
              <div className="space-y-2 text-gray-600">
                <p>Södra vägen 91</p>
                <p>412 63, Göteborg</p>
                <p>Sweden</p>
                <p className="text-sm text-gray-500 mt-2">🇸🇪 🇪🇺 EU-wide shipping available</p>
              </div>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Email Us</h3>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">info@smrtmart.com</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">We typically respond within 24-48 hours</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-light text-black mb-8">Send Us a Message</h2>

            {submitted ? (
              <div className="bg-gray-50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">Message Received!</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. Our support team will review your message
                  and get back to you within 24-48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm text-gray-600 hover:text-black border-b border-gray-300 hover:border-black transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-black mb-2">
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    placeholder="e.g., SMRT-12345"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  >
                    <option value="">Select your inquiry type</option>
                    <option value="order-status">Order Status</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="product-support">Product Support</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Please describe your question or issue in detail..."
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-light text-black mb-6 text-center">Quick Help</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <a href="/products" className="bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="text-sm font-medium text-black">Browse Products</h3>
            </a>
            <a href="/cart" className="bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
              <div className="text-2xl mb-2">🛒</div>
              <h3 className="text-sm font-medium text-black">View Cart</h3>
            </a>
            <a href="/support" className="bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
              <div className="text-2xl mb-2">❓</div>
              <h3 className="text-sm font-medium text-black">FAQ & Support</h3>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
