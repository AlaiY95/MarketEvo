// app/success-stories/page.tsx
import Link from 'next/link'

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
           <div className="flex items-center space-x-2">
            <img 
              src="/m_logo.png" 
              alt="MarketEvo Logo" 
              className="w-10 h-10 rounded-lg"
            />
          </div>
          <span className="text-xl font-bold text-gray-900">MarketEvo</span>
        </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link href="/ai-engine" className="text-gray-600 hover:text-gray-900 font-medium">AI Engine</Link>
              <Link href="/success-stories" className="text-purple-600 font-medium">Success Stories</Link>
              <Link href="/academy" className="text-gray-600 hover:text-gray-900 font-medium">Academy</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-medium">Blog</Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium">Sign Up</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Real Traders.
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            Real Results.
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Don't take our word for it. See how traders are transforming their results with AI-powered analysis.
          </p>

          {/* Key Stats */}
          <div className="flex justify-center items-center space-x-16 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100k</div>
              <div className="text-gray-600 font-medium">Community Size</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10M+</div>
              <div className="text-gray-600 font-medium">Trades Analyzed</div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="#share-story"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <span>Start Your Success Story</span>
          </Link>
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Success Stories</h2>
            <p className="text-xl text-gray-600">Meet traders who transformed their results with AI</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Success Story 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  JL
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Jessica Liu</h3>
                  <p className="text-gray-600">Crypto Trader</p>
                </div>
                <div className="ml-auto flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-6">
                "The AI identified market reversals before they happened. I've never been this confident in my entries."
              </blockquote>
              <p className="text-gray-600 mb-6">
                Transformed from emotional trading to systematic profits using AI pattern recognition.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+$31k</div>
                  <div className="text-sm text-gray-600">Profit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">8 months</div>
                  <div className="text-sm text-gray-600">Using MarketEvo</div>
                </div>
              </div>
            </div>

            {/* Success Story 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  AT
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Alex Torres</h3>
                  <p className="text-gray-600">Options Trader</p>
                </div>
                <div className="ml-auto flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-6">
                "Finally, an AI that understands options flow. My strike selection accuracy is through the roof."
              </blockquote>
              <p className="text-gray-600 mb-6">
                Went from guessing options plays to data-driven decisions with 85% win rate.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+$47k</div>
                  <div className="text-sm text-gray-600">Profit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5 months</div>
                  <div className="text-sm text-gray-600">Using MarketEvo</div>
                </div>
              </div>
            </div>

            {/* Success Story 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  RJ
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Rachel Johnson</h3>
                  <p className="text-gray-600">Futures Trader</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Trading ES futures with AI confirmation signals. Consistent profits even in volatile markets.
              </p>
              <div className="text-lg font-semibold text-green-600">+72%</div>
            </div>

            {/* Success Story 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  MP
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Marcus Powell</h3>
                  <p className="text-gray-600">Scalp Trader</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                AI helps me catch micro-movements in real-time. Turned scalping into a consistent income stream.
              </p>
              <div className="text-lg font-semibold text-green-600">+89%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Community Feedback */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live From Our Community</h2>
            <p className="text-xl text-gray-600">Real feedback from our Discord trading community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {[
              {
                platform: "Discord",
                verified: true,
                message: "Just hit a 12-trade winning streak using the AI signals. This is unreal.",
                author: "CryptoNinja_2024"
              },
              {
                platform: "Discord", 
                verified: true,
                message: "The AI caught a divergence I completely missed. Saved me from a $5k loss.",
                author: "TradingMaven"
              },
              {
                platform: "Discord",
                verified: true,
                message: "Best investment I've made. The AI pays for itself every single week.",
                author: "FlowTrader_99"
              }
            ].map((feedback, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Discord</span>
                  </div>
                  {feedback.verified && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs text-green-600">Verified</span>
                    </div>
                  )}
                </div>
                <blockquote className="text-gray-700 italic mb-4">"{feedback.message}"</blockquote>
                <div className="text-sm text-gray-600">- {feedback.author}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.30z"/>
              </svg>
              <span>Join Our Community</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Your Success Story Starts Here CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Success Story Starts Here
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join 100k traders who are already winning with AI-powered analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Start Free Trial</span>
            </Link>
            <Link
              href="/ai-engine"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>See How It Works</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">MarketEvo</span>
              </div>
              <p className="text-gray-600 text-sm">AI mentorship. No gurus—just data.</p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="/#features" className="block text-gray-600 hover:text-gray-900 text-sm">Features</Link>
                <Link href="/ai-engine" className="block text-gray-600 hover:text-gray-900 text-sm">AI Engine</Link>
                <Link href="/dashboard" className="block text-gray-600 hover:text-gray-900 text-sm">Dashboard</Link>
              </div>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <div className="space-y-2">
                <Link href="/academy" className="block text-gray-600 hover:text-gray-900 text-sm">Academy</Link>
                <Link href="/blog" className="block text-gray-600 hover:text-gray-900 text-sm">Blog</Link>
                <Link href="/success-stories" className="block text-gray-600 hover:text-gray-900 text-sm">Success Stories</Link>
                <Link href="/terms" className="block text-gray-600 hover:text-gray-900 text-sm">Terms</Link>
              </div>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Get Started</h4>
              <p className="text-gray-600 text-sm mb-4">Ready to transform your trading with AI?</p>
              <Link
                href="/auth/signup"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium text-sm"
              >
                Start Analyzing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}