export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About SmartMart</h1>
        <p className="text-xl text-gray-600">
          Your trusted destination for cutting-edge technology and premium electronics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded with a passion for innovation, SmartMart has been at the forefront of bringing 
            the latest technology to consumers worldwide. We believe that everyone deserves access 
            to high-quality, cutting-edge products that enhance their daily lives.
          </p>
          <p className="text-gray-600">
            From the latest MacBook Pro to revolutionary AI-powered translation earphones, 
            we carefully curate our selection to include only the most innovative and reliable products.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            To democratize access to premium technology by offering competitive prices, 
            exceptional customer service, and a seamless shopping experience.
          </p>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Authentic products from trusted brands
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Fast and secure shipping worldwide
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Expert customer support
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Competitive pricing and deals
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose SmartMart?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-gray-600">
              Every product is thoroughly tested and verified for authenticity and quality.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable shipping with tracking, so you get your products when you need them.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
            <p className="text-gray-600">
              Our knowledgeable team is here to help you find the perfect product for your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join the SmartMart Community</h2>
        <p className="text-gray-600 mb-6">
          Discover the latest in technology and join thousands of satisfied customers who trust SmartMart.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Shop Now
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}