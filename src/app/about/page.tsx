export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6">About SmrtMart</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bringing price-value technology from Huaqiang Bei to families across Europe
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Our Mission</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              SmrtMart was founded on a simple belief: Everyone deserves access to quality technology at fair prices.
              Located in the heart of the world's electronics market – Huaqiang Bei, Shenzhen –
              we source the best products at competitive prices and bring them directly to European consumers.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our flagship products, Mtag and Mcard, offer the same functionality as premium alternatives
              but at <strong>half the price</strong>. Why pay more when you can get the same quality
              for less?
            </p>
            <p className="text-gray-600 leading-relaxed">
              From Huaqiang Bei to families across the EU, we're committed to making technology
              accessible to everyone. Smart products, smart prices.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6">
              <div className="w-12 h-12 mb-4 bg-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13-9 4-9 4v20m17-20V9m0 0-4h4m-12 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Direct from Source</h3>
              <p className="text-gray-600 text-sm">
                We source directly from Huaqiang Bei, eliminating middlemen and passing the savings to you.
              </p>
            </div>

            <div className="bg-gray-50 p-6">
              <div className="w-12 h-12 mb-4 bg-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h2v7h-4v-4h14zM9 19h6v2H9v-2zm0-4h6v2H9v-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Half the Price</h3>
              <p className="text-gray-600 text-sm">
                Mtag and Mcard deliver the same tracking functionality at 50% of the price of premium alternatives.
              </p>
            </div>

            <div className="bg-gray-50 p-6">
              <div className="w-12 h-12 mb-4 bg-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4-4-4h2a2 2 0 012 2v2a2 2 0 01-2 2h6a2 2 0 012-2v-6a2 2 0 01-2-2h-8a2 2 0 01-2 2v6a2 2 0 012 2h6zm0-6v6h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">EU-Wide Delivery</h3>
              <p className="text-gray-600 text-sm">
                Fast, reliable shipping across Sweden and the entire European Union.
              </p>
            </div>

            <div className="bg-gray-50 p-6">
              <div className="w-12 h-12 mb-4 bg-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Quality Tested</h3>
              <p className="text-gray-600 text-sm">
                All products are rigorously tested for quality, reliability, and performance before shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Product Showcase */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Our Products</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-black pl-6 bg-gray-50 p-6">
              <h3 className="text-lg font-medium text-black mb-3">Mtag - Smart Item Tracker</h3>
              <p className="text-gray-600 text-sm mb-3">
                Never lose your belongings again. Mtag works exactly like premium alternatives –
                attach to keys, wallets, bags, and track them instantly from your phone.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>✓ Precision tracking with your existing devices</li>
                <li>✓ Replaceable battery for long-lasting use</li>
                <li>✓ Water and dust resistant</li>
                <li>✓ Works with iOS and Android</li>
                <li>✓ <strong className="text-black">½ the price of premium alternatives</strong></li>
              </ul>
            </div>

            <div className="border-l-4 border-black pl-6 bg-gray-50 p-6">
              <h3 className="text-lg font-medium text-black mb-3">Mcard - Smart Card Tracker</h3>
              <p className="text-gray-600 text-sm mb-3">
                Thin, sleek, and powerful. Mcard slips into wallets and cards for discreet tracking
                with the same precision as premium options.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>✓ Ultra-slim profile for wallets and cards</li>
                <li>✓ Extended range with precision tracking</li>
                <li>✓ Loud alert for easy finding</li>
                <li>✓ Replaceable battery</li>
                <li>✓ <strong className="text-black">½ the price of premium alternatives</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Contact Us</h2>
          <div className="bg-gray-50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Location</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Södra vägen 91</p>
                  <p>412 63, Göteborg</p>
                  <p>Sweden</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Support</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">info@smrtmart.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-gray-600">Orders, Returns, Product Inquiries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-4">Ready to Save Smart?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of smart shoppers who are saving money without sacrificing quality.
          </p>
          <a
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
