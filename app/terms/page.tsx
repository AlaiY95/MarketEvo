// app/terms/page.tsx
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">ChartAI</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Terms and Conditions</h2>
          </div>

          {/* Terms Content */}
          <div className="prose prose-lg max-w-none text-gray-800 space-y-8">
            
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h3>
              <p className="leading-relaxed">
                By accessing and using ChartAI ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h3>
              <p className="leading-relaxed">
                ChartAI provides AI-powered chart analysis tools for financial markets. The Service uses algorithms to analyze patterns and provide insights on financial charts. All analysis is provided for informational purposes only and should not be construed as financial advice.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Disclaimer of Financial Advice</h3>
              <p className="leading-relaxed">
                The information provided by ChartAI does not constitute financial advice, investment advice, trading advice, or any other sort of advice. The decision to trade and the execution of trading transactions are the sole responsibility of the user.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4. Risk Disclosure</h3>
              <p className="leading-relaxed">
                Trading financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5. Subscription and Billing</h3>
              <p className="leading-relaxed">
                Some features of ChartAI require a paid subscription. By subscribing, you agree to pay the fees as described at the time of your subscription. Subscriptions renew automatically unless canceled before the renewal date. You may cancel your subscription at any time from your account settings.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">6. Refund Policy</h3>
              <p className="leading-relaxed">
                We offer a 14-day money-back guarantee for new subscribers. If you are not satisfied with our service, you may request a full refund within 14 days of your initial subscription. Refunds are processed within 5-7 business days.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">7. Data Privacy</h3>
              <p className="leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your data. We use industry-standard encryption to protect your trading chart data and personal information.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">8. User Responsibilities</h3>
              <p className="leading-relaxed">
                Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. Users agree not to use the Service for any unlawful purpose or in violation of any applicable laws or regulations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">9. Intellectual Property</h3>
              <p className="leading-relaxed">
                All content on ChartAI, including but not limited to algorithms, software, design, and graphics, is the property of ChartAI and is protected by intellectual property laws. Users may not reproduce, distribute, or create derivative works without express written permission.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">10. Service Availability</h3>
              <p className="leading-relaxed">
                While we strive to maintain continuous service availability, ChartAI does not guarantee uninterrupted access to the Service. We reserve the right to suspend or terminate the Service for maintenance, updates, or other operational reasons.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">11. Limitation of Liability</h3>
              <p className="leading-relaxed">
                ChartAI shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from the use of, or inability to use, the Service. This includes but is not limited to trading losses, lost profits, or data loss.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">12. Changes to Terms</h3>
              <p className="leading-relaxed">
                ChartAI reserves the right to modify these Terms and Conditions at any time. Users will be notified of significant changes via email or through the Service, but are encouraged to review these terms periodically. Continued use of the Service constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">13. Governing Law</h3>
              <p className="leading-relaxed">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law principles. Any disputes arising from these terms shall be resolved in the appropriate courts of the United States.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">14. Contact Information</h3>
              <p className="leading-relaxed">
                If you have any questions or concerns about these Terms and Conditions, please contact us at{' '}
                <a href="mailto:support@chartai.com" className="text-purple-600 hover:text-purple-500">
                  support@chartai.com
                </a>
              </p>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-500 mb-4">
                <strong>Last Updated:</strong> January 2025
              </p>
              <p className="text-sm text-gray-500">
                <strong>Effective Date:</strong> These terms are effective immediately upon posting and apply to all users of the Service.
              </p>
            </div>

          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <Link 
                href="/"
                className="inline-flex items-center text-purple-600 hover:text-purple-500 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Home
              </Link>
              
              <div className="flex space-x-4">
                <Link 
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}