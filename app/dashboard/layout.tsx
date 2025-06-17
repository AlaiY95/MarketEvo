// app/dashboard/layout.tsx - Add usage display to header
'use client'

import { shouldHidePricing } from '@/lib/utm';
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import DevTools from '../components/DevTools';
import UsageDisplay from '../components/UsageDisplay'; // Add this import
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [hidePricing, setHidePricing] = useState(false)

  // Check if we should hide pricing on client side
  useEffect(() => {
    setHidePricing(shouldHidePricing())
  }, [])

  // Navigation structure with sections - dynamically filter Plans
  const getNavigationSections = () => {
    const sections = [
      {
        title: 'TRADING TOOLS',
        items: [
          { name: 'Dashboard', href: '/dashboard', icon: '📊' },
          { name: 'Swing Trading', href: '/dashboard/swing-trading', icon: '📈' },
          { name: 'Day Trading', href: '/dashboard/day-trading', icon: '🕐' },
          { name: 'Scalp Trading', href: '/dashboard/scalp-trading', icon: '⚡' },
        ]
      },
      {
        title: 'ANALYSIS & LEARNING',
        items: [
          // { name: 'Learning', href: '/dashboard/learning', icon: '📚' },
          // { name: 'Journal', href: '/dashboard/journal', icon: '📝' },
          { name: 'Trade History', href: '/dashboard/history', icon: '📋', badge: 'New' },
        ]
      },
      {
        title: 'ACCOUNT',
        items: [
          // Conditionally include Plans based on UTM
          ...(hidePricing ? [] : [{ name: 'Plans', href: '/dashboard/plans', icon: '💎' }]),
          // { name: 'Creator Hub', href: '/dashboard/creator', icon: '⭐', badge: 'New' },
          { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
        ]
      },
      {
        title: 'HELP & SUPPORT',
        items: [
          { name: 'Support', href: '/dashboard/support', icon: '💬' },
        ]
      }
    ];

    // If hiding pricing, also add community/educational links
    if (hidePricing) {
      sections[1].items.unshift(
        { name: 'Trading Community', href: '/community', icon: '👥' },
        { name: 'Learning Hub', href: '/learn', icon: '📚' }
      );
    }

    return sections;
  };

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) router.push('/auth/signin')
  }, [session, status, router])

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize() // Check on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Helper function to get page title
  const getPageTitle = () => {
    for (const section of getNavigationSections()) {
      const item = section.items.find(item => item.href === pathname);
      if (item) return item.name;
    }
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">
              {hidePricing ? 'Chart Analyzer' : 'Trading Analyzer'}
            </h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Header */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-500">
              {hidePricing 
                ? 'Free trading chart analysis and educational tools.' 
                : 'Navigate your trading tools and settings.'
              }
            </p>
          </div>

          {/* 🛡️ USAGE DISPLAY IN SIDEBAR */}
          <div className="px-6 pb-4">
            <UsageDisplay compact={true} showUpgradeButton={!hidePricing} />
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
            {getNavigationSections().map((section) => (
              <div key={section.title}>
                <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => {
                        // Close sidebar on mobile after navigation
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false)
                        }
                      }}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pathname === item.href
                          ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className={`mr-3 text-lg ${
                        pathname === item.href ? 'text-white' : 'text-gray-400'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.name}</span>
                      {pathname === item.href && (
                        <span className="text-white">→</span>
                      )}
                      {item.badge && pathname !== item.href && (
                        <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Fixed User Menu */}
          <div className="border-t bg-white">
            {/* User Profile Section */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                  {session.user?.name?.slice(0, 2).toUpperCase() || 'AC'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
                <span className={`transform transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>
                  ▲
                </span>
              </button>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="mr-3">⚙️</span>
                    Settings
                    <span className="ml-auto">→</span>
                  </Link>
                  {/* Show upgrade option in user menu for Reddit users */}
                  {hidePricing && (
                    <Link
                      href="/dashboard/plans?utm_source=reddit_convert"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <span className="mr-3">⭐</span>
                      Unlock Premium Tools
                      <span className="ml-auto">→</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="mr-3">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 mr-4"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* 🛡️ USAGE DISPLAY IN HEADER */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <UsageDisplay compact={true} showUpgradeButton={false} className="bg-gray-50 px-3 py-2 rounded-lg" />
            </div>
            
            {/* Optional: Show subtle "community edition" indicator for Reddit users */}
            {hidePricing && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Community Edition
              </div>
            )}
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
      <DevTools />
    </div>
  )
}