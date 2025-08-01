export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6">About SmartMart</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted destination for premium electronics and technology products, carefully curated for the modern lifestyle.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Founded with a passion for technology and innovation, SmartMart has been at the forefront of bringing 
              cutting-edge electronics to consumers who demand quality and performance. We believe that technology 
              should enhance your life, not complicate it.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Located in the heart of Göteborg, Sweden, we've built our reputation on providing exceptional products 
              from the world's leading technology brands. From the latest MacBook Pro to premium audio equipment, 
              every product in our collection is chosen for its quality, innovation, and ability to deliver 
              outstanding user experiences.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Quality First</h3>
              <p className="text-gray-600 text-sm">
                We only stock products that meet our rigorous quality standards and come from trusted manufacturers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                We stay ahead of technology trends to bring you the latest innovations and breakthrough products.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Customer Care</h3>
              <p className="text-gray-600 text-sm">
                Your satisfaction is our priority. We provide exceptional service before, during, and after your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Visit Our Store</h2>
          <div className="bg-gray-50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Store Location</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Södra vägen 91</p>
                  <p>SmrtMart</p>
                  <p>412 63, Göteborg</p>
                  <p>Sweden</p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-medium text-black mb-2">Store Hours</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Get in Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">+46 760067977</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">info@smrtmart.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-4">Ready to Explore?</h2>
          <p className="text-gray-600 mb-8">
            Discover our carefully curated collection of premium electronics and technology products.
          </p>
          <a 
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Shop Collection
          </a>
        </div>
      </div>
    </div>
  );
}