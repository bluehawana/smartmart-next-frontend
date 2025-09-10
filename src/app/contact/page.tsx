'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    setFormData({ name: '', email: '', subject: '', message: '' });
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
          <h1 className="text-4xl font-light text-black mb-6">Let's Transform Your Business</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to digitalize your business? We've helped restaurants, SMEs, and entrepreneurs achieve remarkable growth through technology. Let's discuss your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light text-black mb-8">Our Success Story</h2>
              <div className="bg-gray-50 p-6 mb-8 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-3">Ichiban Sushi: From Local Restaurant to Top 5 in Gothenburg</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We transformed our own restaurant through digital innovation - achieving 15% growth and reaching top 5 status in just 4 years. 
                  Our website revolutionized our sales, marketing, CRM, and customer engagement.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-black">✓ Online Ordering</span>
                    <p className="text-gray-600">Integrated with Uber Eats, Foodora, Wolt</p>
                  </div>
                  <div>
                    <span className="font-medium text-black">✓ Customer Management</span>
                    <p className="text-gray-600">CRM system for loyalty & retention</p>
                  </div>
                  <div>
                    <span className="font-medium text-black">✓ Digital Marketing</span>
                    <p className="text-gray-600">SEO, social media integration</p>
                  </div>
                  <div>
                    <span className="font-medium text-black">✓ Analytics & Growth</span>
                    <p className="text-gray-600">Data-driven business decisions</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black mb-1">Location</h3>
                    <p className="text-gray-600">
                      Södra vägen 91<br />
                      412 63, Göteborg, Sweden
                    </p>
                    <p className="text-sm text-gray-500 mt-1">🇸🇪 🇪🇺 🇺🇸 Remote work available</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black mb-1">Email</h3>
                    <p className="text-gray-600">info@smrtmart.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Overview */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">How We Can Help</h3>
              <div className="space-y-4 text-sm">
                <div className="border-l-4 border-black pl-4">
                  <h4 className="font-medium text-black">Restaurant & SME Digitalization</h4>
                  <p className="text-gray-600">Complete digital transformation based on our proven restaurant success</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-medium text-black">Full Stack Development</h4>
                  <p className="text-gray-600">Java Spring Boot, React/Next.js, TypeScript, AWS cloud solutions</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-medium text-black">Business Bridging</h4>
                  <p className="text-gray-600">China-Global market entry, cultural adaptation, partnership facilitation</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-medium text-black">Immigration Support</h4>
                  <p className="text-gray-600">Helping immigrants achieve their business dreams and set examples for their children</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-light text-black mb-8">Start Your Digital Journey</h2>
            
            {submitted ? (
              <div className="bg-gray-50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">Let's Build Something Amazing!</h3>
                <p className="text-gray-600">Thank you for reaching out. We'll contact you within 24 hours to discuss your digitalization goals.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm text-gray-600 hover:text-black border-b border-gray-300 hover:border-black transition-colors"
                >
                  Discuss another project
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                      Name
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
                      Email
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
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                    Project Type
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  >
                    <option value="">Select your project type</option>
                    <option value="restaurant-digitalization">Restaurant Digitalization</option>
                    <option value="sme-transformation">SME Digital Transformation</option>
                    <option value="full-stack-development">Full Stack Development</option>
                    <option value="china-global-bridging">China-Global Business Bridging</option>
                    <option value="consultation">Technology Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                    Tell us about your business goals
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Describe your current business, digitalization goals, challenges you're facing, or how we can help transform your vision into reality..."
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Connecting...' : 'Start Your Digital Transformation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}