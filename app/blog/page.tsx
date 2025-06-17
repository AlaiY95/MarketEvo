// app/blog/page.tsx
import Link from 'next/link'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ChartAI</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link href="/ai-engine" className="text-gray-600 hover:text-gray-900 font-medium">AI Engine</Link>
              <Link href="/success-stories" className="text-gray-600 hover:text-gray-900 font-medium">Success Stories</Link>
              <Link href="/academy" className="text-gray-600 hover:text-gray-900 font-medium">Academy</Link>
              <Link href="/blog" className="text-purple-600 font-medium">Blog</Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium">Sign Up</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>SUCCESS INSIGHTS</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            How Traders Win
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
            With ChartAI
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Discover the strategies, tools, and insights that help our community of 100k+ traders achieve consistent profitability with AI-powered analysis.
          </p>

          {/* Key Stats */}
          <div className="flex justify-center items-center space-x-16 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">89%</div>
              <div className="text-gray-600 font-medium">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100k+</div>
              <div className="text-gray-600 font-medium">Active Traders</div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/auth/signup"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>Start Winning Today</span>
          </Link>
        </div>
      </section>

      {/* The ChartAI Advantage */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The ChartAI Advantage</h2>
            <p className="text-xl text-gray-600">What makes our platform the choice of successful traders worldwide</p>
          </div>

          <div className="max-w-6xl mx-auto space-y-20">
            {/* AI-Powered Pattern Recognition */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <span>AI Technology</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Pattern Recognition</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our advanced AI analyzes millions of chart patterns to identify high-probability trading setups that human traders often miss.
                </p>
                <div className="space-y-4 text-gray-600">
                  <p>At ChartAI, we've revolutionized pattern recognition by training our AI on over 50 million historical trading patterns. Our algorithms process over 10 million historical patterns daily, learning from every market movement to provide you with precise entry and exit points.</p>
                  <p>The AI doesn't just recognize shapes – it understands market context, volume confirmation, and institutional behavior patterns that separate winning trades from losing ones.</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Proven Results</h4>
                <p className="text-gray-600 text-sm">
                  Join thousands of traders who've transformed their results with this powerful feature.
                </p>
              </div>
            </div>

            {/* Proven Risk Management */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center lg:order-1">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Proven Results</h4>
                <p className="text-gray-600 text-sm">
                  Join thousands of traders who've transformed their results with this powerful feature.
                </p>
              </div>
              <div className="lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <span>Risk Management</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Proven Risk Management</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Protect your capital with our scientifically-backed risk management tools that calculate optimal position sizes and stop losses.
                </p>
                <div className="space-y-4 text-gray-600">
                  <p>Risk management is the foundation of profitable trading, and ChartAI excels in this critical area. Our platform automatically calculates the perfect position size based on your account size, risk tolerance, and the specific trade setup. We provide dynamic stop-loss recommendations that adapt to market volatility, ensuring you never risk more than you can afford to lose while maximizing your profit potential.</p>
                </div>
              </div>
            </div>

            {/* Real-Time Market Analysis */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
                  <span>Real-Time Analysis</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Real-Time Market Analysis</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Stay ahead of the market with live analysis that processes thousands of instruments simultaneously across all timeframes.
                </p>
                <div className="space-y-4 text-gray-600">
                  <p>While other traders struggle with delayed information, ChartAI users benefit from real-time market analysis that processes data in milliseconds. Our system monitors thousands of trading instruments across multiple timeframes, identifying breakouts, trend changes, and reversal patterns as they develop. This speed advantage means you'll never miss a profitable opportunity again.</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Proven Results</h4>
                <p className="text-gray-600 text-sm">
                  Join thousands of traders who've transformed their results with this powerful feature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Path to Trading Success */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Path to Trading Success</h2>
            <p className="text-xl text-gray-600">How ChartAI transforms traders at every level</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {/* How ChartAI Users Achieve 71% Win Rates */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How ChartAI Users Achieve 71% Win Rates</h3>
              <p className="text-gray-600 mb-8">
                Our users consistently outperform the market because they have access to institutional-grade analysis tools. The AI identifies patterns with 95% accuracy by analyzing volume, price action, and market structure simultaneously. This comprehensive approach filters out false signals and focuses only on high-probability setups.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pattern accuracy verified across millions of historical trades</h4>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Multi-timeframe confirmation reduces false signals</h4>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Volume and sentiment analysis for additional confirmation</h4>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Institutional behavior pattern recognition</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* From Beginner to Profitable in 90 Days */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">From Beginner to Profitable in 90 Days</h3>
              <p className="text-gray-600 mb-8">
                ChartAI's structured approach transforms trading newcomers into confident, profitable traders in just three months. Our educational resources combined with AI guidance create the perfect learning environment where theory meets practical application.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Step-by-step learning path tailored to your experience</h4>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time feedback on your trading decisions</h4>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Progressive skill building with measurable milestones</h4>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community support from successful traders</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Your Journey CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Start Your Trading Journey Today
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already winning with ChartAI's advanced analysis tools.
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
              href="/academy"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              <span>Learn More</span>
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
                <span className="text-xl font-bold text-gray-900">ChartAI</span>
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