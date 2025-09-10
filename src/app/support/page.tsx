'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const supportCategories = [
    { id: 'orders', name: 'Orders & Shipping', icon: '📦' },
    { id: 'returns', name: 'Returns & Refunds', icon: '↩️' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
    { id: 'account', name: 'Account & Login', icon: '👤' },
    { id: 'products', name: 'Product Information', icon: '💻' },
    { id: 'billing', name: 'Billing & Payment', icon: '💳' },
  ];

  const faqs = [
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and viewing your order history. You\'ll also receive tracking information via email once your order ships.'
    },
    {
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-7 business days. Express shipping options are available for faster delivery.'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all accessories and packaging.'
    },
    {
      category: 'returns',
      question: 'How do I initiate a return?',
      answer: 'Log into your account, find your order, and click "Return Item". Follow the instructions to print your return label.'
    },
    {
      category: 'technical',
      question: 'My product isn\'t working properly. What should I do?',
      answer: 'First, check the product manual and troubleshooting guide. If the issue persists, contact our technical support team with your order details.'
    },
    {
      category: 'technical',
      question: 'Do you offer warranty support?',
      answer: 'Yes, all our products come with manufacturer warranties. We can help you with warranty claims and repairs.'
    },
    {
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link within a few minutes.'
    },
    {
      category: 'products',
      question: 'Are your products authentic?',
      answer: 'Yes, we only sell 100% authentic products directly from manufacturers or authorized distributors. All products come with original warranties.'
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay for secure checkout.'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
        <p className="text-xl text-gray-600 mb-8">
          How can we help you today?
        </p>
        
        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <a
          href="/contact"
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <div className="text-3xl mb-2">💬</div>
          <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
          <p className="text-blue-100">Get personalized help from our team</p>
        </a>
        
        <a
          href="/profile"
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-center"
        >
          <div className="text-3xl mb-2">📋</div>
          <h3 className="text-lg font-semibold mb-2">My Orders</h3>
          <p className="text-green-100">Track orders and manage returns</p>
        </a>
        
        <div className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-center cursor-pointer">
          <div className="text-3xl mb-2">🔧</div>
          <h3 className="text-lg font-semibold mb-2">Product Guides</h3>
          <p className="text-purple-100">Setup and troubleshooting guides</p>
        </div>
      </div>

      {/* Support Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory('')}
            className={`p-4 rounded-lg border-2 transition-colors text-center ${
              !selectedCategory 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm font-medium">All Topics</div>
          </button>
          
          {supportCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 transition-colors text-center ${
                selectedCategory === category.id 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {selectedCategory 
            ? `${supportCategories.find(c => c.id === selectedCategory)?.name} FAQs`
            : 'Frequently Asked Questions'
          }
          <span className="text-lg font-normal text-gray-500 ml-2">
            ({filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'})
          </span>
        </h2>
        
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.267-5.365-3.056A9.959 9.959 0 007.5 6c.896 0 1.73.133 2.5.387m0 0A9.97 9.97 0 0112 6a9.97 9.97 0 012.5.387m-7 0a9.975 9.975 0 00-1.5 6.114m0 0a10.04 10.04 0 001.5 6.114M15 6.5V12a3 3 0 11-6 0V6.5" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or category filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <details
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                  {faq.question}
                </summary>
                <div className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-gray-600 mb-6">
          Our support team is here to help you with any questions or issues.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Contact Support
          </a>
          <a
            href="mailto:support@smrtmart.com"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}