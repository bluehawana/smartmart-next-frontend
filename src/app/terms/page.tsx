export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-primary-950 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-primary-600 mb-6">Last updated: January 2026</p>
          
          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">1. Acceptance of Terms</h2>
            <p className="text-primary-600 mb-4">
              By accessing and using SmartMart ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">2. Use License</h2>
            <p className="text-primary-600 mb-4">
              Permission is granted to temporarily access the materials on SmartMart for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">3. Account Terms</h2>
            <ul className="list-disc pl-6 text-primary-600 space-y-2">
              <li>You must be 18 years or older to use this Service</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">4. Products and Services</h2>
            <p className="text-primary-600 mb-4">
              All products and services are subject to availability. We reserve the right to limit quantities and discontinue products at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">5. Pricing</h2>
            <p className="text-primary-600 mb-4">
              All prices are in Swedish Kronor (SEK) and include 25% VAT unless otherwise stated. We reserve the right to change prices at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">6. Returns and Refunds</h2>
            <p className="text-primary-600 mb-4">
              We offer a 30-day return policy on most items. Products must be in original condition with all packaging and accessories.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">7. Limitation of Liability</h2>
            <p className="text-primary-600 mb-4">
              SmartMart shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">8. Contact</h2>
            <p className="text-primary-600">
              For questions about these Terms, please contact us at: <a href="mailto:support@smrtmart.com" className="text-accent-dark hover:underline">support@smrtmart.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
