export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6">About SmartMart</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From restaurant entrepreneurs to technology innovators - helping SMEs achieve their digitalization dreams.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Our Journey</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Our story began in China, where Hongzhi and Yan shared a passion for culinary excellence and entrepreneurship. 
              In 2016, we embarked on a new adventure and moved to Gothenburg, Sweden, where Hongzhi pursued a second 
              master's degree at Gothenburg University.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              In 2017, we acquired the charming Ichiban Sushi Bar, fueled by our love for Asian cuisine and our desire 
              to create a truly unique dining experience. Through relentless dedication and commitment to quality, we 
              propelled Ichiban Sushi Bar into the top 5 sushi restaurants in Gothenburg within just four years, 
              achieving a remarkable 15% growth rate from 2017 to 2020.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our digital transformation journey began with implementing online ordering and table booking systems. 
              Customers can now easily book a table or order dishes directly through our website at{' '}
              <a href="https://www.ichiban.biz" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
                ichiban.biz
              </a>{' '}
              or through Google Maps. This virtual presence has been a game-changer - when we first bought the restaurant, 
              our daily income was around 4-5k SEK. Now, with our strong online presence, many tourists discover us while 
              visiting Liseberg. During summer vacation, our daily income has almost tripled. This impressive and promising 
              transformation demonstrates how we can help you achieve the same revolutionary results.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Today, we continue to innovate and push boundaries, partnering with industry leaders such as Wix, Zettle, 
              Uber Eats, Foodora, Wolt, and more. But our goal extends beyond running a successful restaurant - we're 
              passionate about helping SMEs achieve their digitalization dreams, launch their businesses through effective 
              localization, and transform from traditional business models to thrive in the digital world.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6">
              <div className="w-12 h-12 mb-4 bg-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Digitalization Support</h3>
              <p className="text-gray-600 text-sm">
                Helping SMEs transform their traditional businesses into digital-first enterprises, 
                enabling them to compete and thrive in the modern marketplace.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6">
              <div className="w-12 h-12 mb-4 bg-black rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-3">Empowering Dreams</h3>
              <p className="text-gray-600 text-sm">
                Supporting entrepreneurs to achieve their dreams and set examples for their children, 
                especially helping immigrants navigate the business landscape in their new home.
              </p>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">What We Offer</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-lg font-medium text-black mb-2">Full Stack Development</h3>
              <p className="text-gray-600 text-sm">
                Professional software development services using Java Spring Boot, React/Next.js, TypeScript, 
                and modern cloud technologies for scalable business solutions.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-lg font-medium text-black mb-2">Business Digitalization</h3>
              <p className="text-gray-600 text-sm">
                Complete digital transformation services including e-commerce platforms, mobile applications, 
                and cloud infrastructure to modernize traditional businesses.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-lg font-medium text-black mb-2">China-Global Business Bridging</h3>
              <p className="text-gray-600 text-sm">
                Specialized consulting for international market entry, cultural adaptation, and 
                cross-border business development between China and global markets.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-300 pl-6">
              <h3 className="text-lg font-medium text-black mb-2">Technology Consultation</h3>
              <p className="text-gray-600 text-sm">
                Expert guidance on technology stack selection, system architecture, DevOps implementation, 
                and digital strategy for businesses of all sizes.
              </p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-black mb-8">Find Us</h2>
          <div className="bg-gray-50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Location</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Södra vägen 91</p>
                  <p>SmrtMart</p>
                  <p>412 63, Göteborg</p>
                  <p>Sweden</p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-medium text-black mb-2">Availability</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>🇸🇪 Gothenburg & Stockholm (onsite preferred)</p>
                    <p>🇪🇺 European Union (remote opportunities)</p>
                    <p>🇺🇸 US remote positions considered</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Get in Touch</h3>
                <div className="space-y-3">
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
          <h2 className="text-2xl font-light text-black mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-600 mb-8">
            Let's discuss how we can help you achieve your digitalization goals and business dreams.
          </p>
          <a 
            href="/contact"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}