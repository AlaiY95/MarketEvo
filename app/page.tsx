// app/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  trackCTAClick, 
  trackPricingToggle, 
  trackFAQClick, 
  trackNavClick,
  trackUTMParameters,
  trackTimeOnPage,
  trackScrollDepth,
  trackSectionView,
  testTracking,
  isTrackingReady
} from './lib/gtag'

// FAQ Item Component with TypeScript
interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFAQClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      trackFAQClick(question)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
      <button
        onClick={handleFAQClick}
        className="w-full text-left p-6 focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white pr-4">{question}</h3>
          <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <div className="px-6">
          <p className="text-gray-300 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Analytics tracking setup
  useEffect(() => {
    console.log('🏠 Home page loaded - initializing analytics')
    
    // Track UTM parameters on page load
    trackUTMParameters()
    
    // Start time tracking
    const stopTimeTracking = trackTimeOnPage()
    
    // Check if tracking is ready
    setTimeout(() => {
      const ready = isTrackingReady()
      console.log('📊 Analytics ready:', ready)
    }, 2000)
    
    // Track page sections when they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.id || entry.target.getAttribute('data-section') || 'unknown_section'
            trackSectionView(sectionName)
          }
        })
      },
      { threshold: 0.5 }
    )

    // Observe main sections
    const sections = document.querySelectorAll('#features, #pricing, [data-section]')
    sections.forEach(section => observer.observe(section))

    // Scroll depth tracking
    const scrollPercentages = [25, 50, 75, 90]
    const trackedPercentages = new Set<number>()

    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      scrollPercentages.forEach(percentage => {
        if (scrollPercent >= percentage && !trackedPercentages.has(percentage)) {
          trackedPercentages.add(percentage)
          trackScrollDepth(percentage)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup function
    return () => {
      stopTimeTracking()
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
    setIsVisible(true)
  }, [session, router])

  // Enhanced CTA click handler
  const handleCTAClick = (ctaName: string, location: string, utmCampaign?: string, utmContent?: string) => {
    trackCTAClick(ctaName, location, utmCampaign, utmContent)
  }

  // Enhanced pricing toggle handler
  const handlePricingToggle = (planType: string) => {
    trackPricingToggle(planType)
    setIsAnnual(planType === 'annual')
  }

  // Navigation click handler
  const handleNavClick = (navItem: string) => {
    trackNavClick(navItem)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  // Pricing data
  const pricingData = {
    monthly: {
      price: "29",
      period: "/month",
      savings: null,
      equivalent: null
    },
    annual: {
      price: "199",
      period: "/year",
      savings: "Save $149 (43% off)",
      equivalent: "$16.58/month"
    }
  }

  const currentPricing = isAnnual ? pricingData.annual : pricingData.monthly

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileNavClick = (navItem: string) => {
    handleNavClick(navItem)
    setIsMobileMenuOpen(false) // Close menu after click
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Floating chart lines animation */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-10">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 Q200,300 400,350 T800,320 L800,500 L0,500 Z"
            fill="url(#chartGradient)"
            className="animate-pulse"
          />
          <path
            d="M0,500 Q300,400 600,450 T1200,420"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
            className="animate-pulse delay-700"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 relative">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">MarketEvo</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={() => handleNavClick('features')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Features
            </a>
            <Link 
              href="/ai-engine" 
              onClick={() => handleNavClick('ai-engine')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              AI-Engine
            </Link>
            <Link 
              href="/success-stories" 
              onClick={() => handleNavClick('success-stories')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Success Stories
            </Link>
            <Link 
              href="/academy" 
              onClick={() => handleNavClick('academy')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Academy
            </Link>
            <Link 
              href="/blog" 
              onClick={() => handleNavClick('blog')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Blog
            </Link>
            <Link 
              href="/auth/signin" 
              onClick={() => handleNavClick('login')}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              onClick={() => handleCTAClick('header_signup', 'navigation')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors"
            >
              Sign Up
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {/* Hamburger icon that transforms to X when open */}
            <div className="w-6 h-6 relative">
              <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
              }`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'opacity-0' : 'top-2.5'
              }`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
              }`}></span>
            </div>
          </button>

          {/* MOBILE NAVIGATION MENU */}
          <div className={`absolute top-full left-0 right-0 md:hidden transition-all duration-300 ease-in-out z-50 ${
            isMobileMenuOpen 
              ? 'opacity-100 visible transform translate-y-0' 
              : 'opacity-0 invisible transform -translate-y-4'
          }`}>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" 
                onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-2xl mt-4 p-6 shadow-2xl">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="#features" 
                  onClick={() => handleMobileNavClick('features')}
                  className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/10"
                >
                  Features
                </a>
                <Link 
                  href="/ai-engine" 
                  onClick={() => handleMobileNavClick('ai-engine')}
                  className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/10"
                >
                  AI-Engine
                </Link>
                <Link 
                  href="/success-stories" 
                  onClick={() => handleMobileNavClick('success-stories')}
                  className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/10"
                >
                  Success Stories
                </Link>
                <Link 
                  href="/academy" 
                  onClick={() => handleMobileNavClick('academy')}
                  className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/10"
                >
                  Academy
                </Link>
                <Link 
                  href="/blog" 
                  onClick={() => handleMobileNavClick('blog')}
                  className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/10"
                >
                  Blog
                </Link>
                
                {/* Divider */}
                <div className="border-t border-white/10 my-2"></div>
                
                <Link 
                  href="/auth/signin" 
                  onClick={() => handleMobileNavClick('login')}
                  className="text-gray-300 hover:text-white transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/10"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  onClick={() => {
                    handleCTAClick('mobile_header_signup', 'mobile_navigation')
                    setIsMobileMenuOpen(false)
                  }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors text-center"
                >
                  Sign Up
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-section="hero">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-300% animate-gradient">
              AI-Powered
            </span>
            <br />
            <span className="text-gray-100">Trading Analysis</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your trading charts into profitable insights with cutting-edge AI technology. 
            Get <span className="text-blue-400 font-semibold">precise entry points</span>, 
            <span className="text-green-400 font-semibold"> risk management</span>, and 
            <span className="text-purple-400 font-semibold"> price targets</span> in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/auth/signup?utm_source=landing&utm_medium=cta&utm_campaign=hero_primary&utm_content=start_free_analysis"
              onClick={() => handleCTAClick('start_free_analysis', 'hero_section', 'hero_primary', 'start_free_analysis')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10">Start Free Analysis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/auth/signin?utm_source=landing&utm_medium=cta&utm_campaign=hero_secondary&utm_content=sign_in"
              onClick={() => handleCTAClick('sign_in', 'hero_section', 'hero_secondary', 'sign_in')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
            {[
              { number: "10K+", label: "Charts Analyzed" },
              { number: "95%", label: "Accuracy Rate" },
              { number: "2.5s", label: "Analysis Time" },
              { number: "500+", label: "Happy Traders" }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div id="features" className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Traders Choose <span className="text-blue-400">MarketEvo</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Precise Entry Points",
                description: "AI identifies optimal entry zones with mathematical precision, maximizing your profit potential."
              },
              {
                icon: "🛡️",
                title: "Smart Risk Management",
                description: "Automatically calculates stop-loss levels and position sizing based on your risk tolerance."
              },
              {
                icon: "📈",
                title: "Price Targets",
                description: "Get multiple take-profit levels with probability scores for each target zone."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 mb-20" data-section="demo">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-gray-300 text-lg">Upload a chart and watch AI work its magic</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h3 className="text-white font-semibold">Upload Your Chart</h3>
                  <p className="text-gray-400">Any timeframe, any market</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h3 className="text-white font-semibold">AI Analysis</h3>
                  <p className="text-gray-400">Advanced pattern recognition</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h3 className="text-white font-semibold">Get Results</h3>
                  <p className="text-gray-400">Entry, stop-loss, and targets</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-mono text-sm">EURUSD • M15</span>
                    <span className="text-gray-400 text-sm">Analysis Complete</span>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entry Zone:</span>
                    <span className="text-blue-400">1.0850 - 1.0865</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stop Loss:</span>
                    <span className="text-red-400">1.0820</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target 1:</span>
                    <span className="text-green-400">1.0920 (85%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Features Section */}
        <div className="mb-20" data-section="comprehensive-features">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100/10 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>POWERFUL FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need for{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                data-driven trading success
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI doesn't just analyze charts—it understands market psychology, risk, and 
              opportunity to give you the edge you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: "🤖",
                title: "AI Trade Analysis",
                description: "Get detailed trade reviews with our AI that analyzes your chart patterns and trading decisions.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: "📊",
                title: "Swing Trading Analysis",
                description: "Identify optimal entry and exit points with our AI-powered swing trading pattern recognition.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: "⚡",
                title: "Scalp Trading Analysis",
                description: "Discover short-term opportunities with lightning-fast AI analysis for scalp traders.",
                color: "from-green-500 to-green-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📈",
                title: "Price Action Analysis",
                description: "Understand key support, resistance levels and market structure with AI-driven insights.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: "🎯",
                title: "Risk Management",
                description: "Optimize your position sizes and see potential returns based on AI-calculated risk profiles.",
                color: "from-purple-500 to-indigo-600"
              },
              {
                icon: "📝",
                title: "Trade Journaling",
                description: "Track your trading progress with our comprehensive journaling system to improve consistency.",
                color: "from-cyan-500 to-blue-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to experience the power?</h3>
              <p className="text-gray-300 mb-6">Start analyzing charts with AI today</p>
              <Link
                href="/auth/signup?utm_source=landing&utm_medium=cta&utm_campaign=features_section&utm_content=get_started"
                onClick={() => handleCTAClick('get_started', 'features_section', 'features_section', 'get_started')}
                className="inline-block bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Success Stories / Testimonials Section */}
        <div className="mb-20" data-section="testimonials">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100/10 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>SUCCESS STORIES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What Traders Say</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-white font-bold text-xl">4.9/5</span>
              <span className="text-gray-400">from 347+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "The AI swing trading analysis identified a perfect head and shoulders pattern I completely missed. Made a 23% return following its exact entry and exit points.",
                name: "Marcus Rodriguez",
                handle: "@swingtrader_pro",
                avatar: "MR",
                color: "from-blue-500 to-blue-600"
              },
              {
                quote: "The risk management calculations have revolutionized my position sizing. My drawdowns are minimal now while my profits have increased by 34% over the last quarter.",
                name: "Emma Chen",
                handle: "@tradingqueen",
                avatar: "EC",
                color: "from-purple-500 to-purple-600"
              },
              {
                quote: "As a scalp trader, timing is everything. The AI analysis gives me clear levels for quick 1:3 R:R trades. I've tripled my win rate since subscribing.",
                name: "David Kim",
                handle: "@scalper_elite",
                avatar: "DK",
                color: "from-green-500 to-green-600"
              }
            ].map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                  {/* Quote icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm flex items-center space-x-1">
                        <span>{testimonial.handle}</span>
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-green-400 text-xs">verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100/10 text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>SIMPLE PRICING</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Choose Your Plan</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              No upsells or hidden fees, just results
            </p>

            {/* Monthly/Annual Toggle */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 mb-12">
              <button 
                onClick={() => handlePricingToggle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  !isAnnual 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => handlePricingToggle('annual')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 relative ${
                  isAnnual 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Annual
                {/* Savings badge - only show when not annual */}
                {!isAnnual && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    43% off
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              {/* Most Popular Badge */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-center py-3 font-semibold flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>MOST POPULAR</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>

              <div className="p-8">
                {/* Price */}
                <div className="text-center mb-8">
                  <div className="text-purple-400 text-6xl font-bold mb-2 transition-all duration-500">
                    ${currentPricing.price}
                  </div>
                  <div className="text-gray-400">{currentPricing.period}</div>
                  
                  {/* Annual equivalent and savings */}
                  {isAnnual && currentPricing.equivalent && (
                    <div className="mt-4 space-y-2">
                      <div className="text-green-400 font-semibold text-lg">
                        {currentPricing.equivalent}
                      </div>
                      <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        {currentPricing.savings}
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {[
                    "Unlimited AI chart analysis",
                    "Swing & scalp trading patterns", 
                    "Advanced risk management",
                    "Trade journaling system",
                    "Learning resources center",
                    "Real-time market insights",
                    "Position sizing calculator",
                    "AI trade performance reviews"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href="/auth/signup?utm_source=landing&utm_medium=cta&utm_campaign=pricing_section&utm_content=start_analyzing"
                  onClick={() => handleCTAClick('start_analyzing', 'pricing_section', 'pricing_section', 'start_analyzing')}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                  <span>Start Analyzing</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-2">Ready to get started?</h3>
              <p className="text-gray-300 mb-4">Join thousands of traders using AI to make better decisions</p>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Instant Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20" data-section="faq">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100/10 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>SUPPORT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about our AI trading analysis platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "Do you offer a refund policy?",
                answer: "Yes! We offer a 14-day money-back guarantee. If you're not satisfied with our AI trading analysis, contact us within 14 days for a full refund, no questions asked."
              },
              {
                question: "How do I cancel my subscription?",
                answer: "You can cancel your subscription anytime from your account dashboard. Go to Settings > Billing > Cancel Subscription. You'll continue to have access to premium features until the end of your current billing period."
              },
              {
                question: "Can I switch between monthly and annual plans?",
                answer: "Absolutely! You can upgrade from monthly to annual anytime to start saving immediately. We'll automatically prorate the difference and adjust your billing cycle."
              },
              {
                question: "Is my trading data secure?",
                answer: "Your data security is our top priority. We use bank-level encryption (AES-256) and never store your actual trading account credentials. Chart images are processed securely and deleted after analysis."
              },
              {
                question: "What markets and timeframes does the AI support?",
                answer: "Our AI works with all major markets including Forex, Stocks, Crypto, and Commodities. It supports all timeframes from 1-minute scalping to daily swing trading charts."
              },
              {
                question: "How accurate is the AI analysis?",
                answer: "Our AI has a 95% pattern recognition accuracy rate based on backtesting over 10,000+ charts. However, trading involves risk and past performance doesn't guarantee future results."
              }
            ].map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 border-t border-white/10 pt-8">
          <p>&copy; 2025 MarketEvo. All rights reserved. Trade responsibly.</p>
        </footer>
      </div>

      {/* Analytics Debug Component - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => testTracking()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 text-sm"
          >
            🧪 Test Analytics
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .bg-300\% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  )
}