export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-primary-950 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-primary-600 mb-6">Last updated: January 2026</p>
          
          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">1. Information We Collect</h2>
            <p className="text-primary-600 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-primary-600 space-y-2">
              <li>Name and email address</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">2. How We Use Your Information</h2>
            <p className="text-primary-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-primary-600 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">3. Information Sharing</h2>
            <p className="text-primary-600 mb-4">
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-primary-600 space-y-2">
              <li>Service providers who assist in our operations</li>
              <li>Payment processors (Stripe) for transaction processing</li>
              <li>Shipping companies to deliver your orders</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">4. Cookies and Tracking</h2>
            <p className="text-primary-600 mb-4">
              We use cookies and similar tracking technologies to improve your experience, including:
            </p>
            <ul className="list-disc pl-6 text-primary-600 space-y-2">
              <li>Essential cookies for site functionality</li>
              <li>Analytics cookies to understand site usage</li>
              <li>Marketing cookies for personalized ads (with consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">5. Data Security</h2>
            <p className="text-primary-600 mb-4">
              We implement appropriate security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-primary-600 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing via Stripe</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">6. Your Rights</h2>
            <p className="text-primary-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-primary-600 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">7. GDPR Compliance</h2>
            <p className="text-primary-600 mb-4">
              For users in the European Union, we comply with GDPR requirements. You have additional rights under GDPR, including the right to data portability and the right to lodge a complaint with a supervisory authority.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">8. Children's Privacy</h2>
            <p className="text-primary-600 mb-4">
              Our Service is not intended for children under 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">9. Changes to This Policy</h2>
            <p className="text-primary-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-primary-950 mb-4">10. Contact Us</h2>
            <p className="text-primary-600">
              If you have questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@smrtmart.com" className="text-accent-dark hover:underline">privacy@smrtmart.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
