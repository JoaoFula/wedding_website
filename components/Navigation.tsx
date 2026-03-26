/**
 * Navigation Component
 *
 * Main navigation bar that appears on all pages
 * Shows links to all main sections of the website
 */

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Heart, LogIn, LogOut, User } from 'lucide-react'
import { useState, useEffect } from 'react'

interface UserSession {
  username: string
  guestName: string
  isAdmin: boolean
  hasRsvped: boolean
  loginTime: string
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userSession, setUserSession] = useState<UserSession | null>(null)

  // Check if user is logged in
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('userSession')
      if (sessionData) {
        try {
          const session: UserSession = JSON.parse(sessionData)
          setIsLoggedIn(true)
          setUserSession(session)
        } catch (error) {
          setIsLoggedIn(false)
          setUserSession(null)
        }
      } else {
        setIsLoggedIn(false)
        setUserSession(null)
      }
    }

    // Check on mount
    checkSession()

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkSession)

    // Also check when pathname changes (in case of login/logout)
    checkSession()

    return () => window.removeEventListener('storage', checkSession)
  }, [pathname])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userSession')
    setIsLoggedIn(false)
    setUserSession(null)
    router.push('/')
  }

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <Link href="/" className="flex items-center space-x-2 text-rose-600 hover:text-rose-700">
            <Heart className="w-6 h-6 fill-current" />
            <span className="font-semibold text-lg">Our Wedding</span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`${
                isActive('/')
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-700 hover:text-rose-600'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/story"
              className={`${
                isActive('/story')
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-700 hover:text-rose-600'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Our Story
            </Link>
            <Link
              href={isLoggedIn ? '/rsvp' : '/login?redirect=/rsvp'}
              className={`${
                isActive('/rsvp') || isActive('/login')
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-700 hover:text-rose-600'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              RSVP
            </Link>
            <Link
              href="/details"
              className={`${
                isActive('/details')
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-700 hover:text-rose-600'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Details
            </Link>
            <Link
              href={isLoggedIn ? '/photos' : '/login?redirect=/photos'}
              className={`${
                isActive('/photos') || isActive('/login')
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-700 hover:text-rose-600'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Photos
            </Link>
          </div>

          {/* Right - User Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn && userSession ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{userSession.guestName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Mobile Menu Button - simplified for now */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-rose-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
