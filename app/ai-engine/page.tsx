// app/ai-engine/page.tsx
import Link from 'next/link'

export default function ChartDatabasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">MarketEvo</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link href="/ai-engine" className="text-purple-600 font-medium">AI-Engine</Link>
              <Link href="/success-stories" className="text-gray-600 hover:text-gray-900 font-medium">Success Stories</Link>
              <Link href="/academy" className="text-gray-600 hover:text-gray-900 font-medium">Academy</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-medium">Blog</Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium">Sign Up</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-teal-50 py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>MASSIVE DATA ADVANTAGE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Power Behind<br />
            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              AI Trading Analysis
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            Discover how MarketEvo's massive chart database of over 10 million analyzed 
            patterns creates the most sophisticated AI trading system ever built.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">10M+</div>
              <div className="text-gray-600 font-medium">Patterns Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">89%</div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Live Analysis</div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/auth/signup"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
            <span>Start Analyzing Charts</span>
          </Link>
        </div>
      </section>

      {/* Data Scale & Quality Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Unmatched Data Scale & Quality
            </h2>
            <p className="text-xl text-gray-600">
              The foundation of superior AI trading analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: "📊",
                iconBg: "from-blue-500 to-blue-600",
                title: "Massive Scale",
                description: "Over 10 million chart patterns analyzed from global markets, creating the largest trading pattern database in the world."
              },
              {
                icon: "🧠", 
                iconBg: "from-purple-500 to-purple-600",
                title: "AI Learning",
                description: "Our AI continuously learns from every pattern, improving accuracy and identifying subtle nuances human traders miss."
              },
              {
                icon: "⚡",
                iconBg: "from-yellow-500 to-orange-500", 
                title: "Real-Time Processing",
                description: "Live market data processed in milliseconds, ensuring you never miss a trading opportunity as it develops."
              },
              {
                icon: "✅",
                iconBg: "from-green-500 to-green-600",
                title: "Proven Accuracy", 
                description: "Historical validation across millions of trades proves our pattern recognition delivers consistent results."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.iconBg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Massive Data Creates Superior AI */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                How Massive Data Creates Superior AI
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Every chart you analyze benefits from millions of previous patterns. Our 
                AI doesn't just recognize shapes - it understands market context, 
                timing, and probability based on historical outcomes.
              </p>

              {/* Features List */}
              <div className="space-y-4">
                {[
                  "Multi-timeframe pattern analysis across all major markets",
                  "Historical pattern validation with real outcome tracking", 
                  "Institutional-grade data feeds from premium providers",
                  "Machine learning models trained on decades of market data",
                  "Cross-asset pattern correlation and validation",
                  "Real-time sentiment and volume confirmation",
                  "Advanced risk metrics calculated for every pattern",
                  "Backtested strategies with verified performance data"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Advanced Features */}
            <div className="space-y-6">
              {[
                {
                  title: "Real-Time Learning",
                  description: "Every trade outcome feeds back into our system, continuously improving pattern recognition and success prediction accuracy.",
                  color: "blue"
                },
                {
                  title: "Cross-Market Validation", 
                  description: "Patterns validated across stocks, forex, crypto, and commodities ensure robust analysis regardless of your preferred markets.",
                  color: "purple"
                },
                {
                  title: "Institutional Quality",
                  description: "The same level of data analysis previously available only to hedge funds and institutional traders, now accessible to everyone.",
                  color: "green"
                }
              ].map((feature, index) => (
                <div key={index} className={`bg-${feature.color}-50 border border-${feature.color}-200 rounded-xl p-6`}>
                  <h3 className={`font-bold text-${feature.color}-900 mb-2`}>{feature.title}</h3>
                  <p className={`text-${feature.color}-800 text-sm`}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Comprehensive Data Matters */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Comprehensive Data Matters
            </h2>
            <p className="text-xl text-gray-600">
              The difference between amateur and professional trading analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🔴",
                title: "Traditional Analysis",
                subtitle: "Limited to basic indicators and manual pattern recognition. High error rates and emotional bias.",
                features: [
                  "Manual pattern identification",
                  "Limited historical context", 
                  "Emotional decision making",
                  "Basic technical indicators only"
                ],
                bgColor: "bg-red-50",
                borderColor: "border-red-200"
              },
              {
                icon: "🟡", 
                title: "Basic AI Tools",
                subtitle: "Simple pattern matching with limited data. No context or probability assessment.",
                features: [
                  "Basic pattern matching",
                  "Limited training data",
                  "No market context",
                  "Generic recommendations"
                ],
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200"
              },
              {
                icon: "🟢",
                title: "MarketEvo",
                subtitle: "Deep learning from millions of patterns with context-aware analysis and proven accuracy.",
                features: [
                  "10M+ pattern database",
                  "Context-aware analysis", 
                  "Real-time market data",
                  "Proven track record"
                ],
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                highlight: true
              }
            ].map((approach, index) => (
              <div key={index} className={`${approach.bgColor} border ${approach.borderColor} rounded-2xl p-8 ${approach.highlight ? 'ring-2 ring-green-300' : ''}`}>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{approach.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{approach.title}</h3>
                  <p className="text-gray-600 text-sm">{approach.subtitle}</p>
                </div>
                <ul className="space-y-3">
                  {approach.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700 text-sm">• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience the Data Advantage
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            See how millions of analyzed patterns can transform your trading decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Start Analyzing Charts</span>
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Learn More About Features</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}