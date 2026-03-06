/**
 * Navigation Component
 *
 * Main navigation bar that appears on all pages
 * Shows links to all main sections of the website
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

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

          {/* Navigation Links */}
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
              href="/rsvp"
              className={`${
                isActive('/rsvp')
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
              href="/photos"
              className={`${
                isActive('/photos')
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-700 hover:text-rose-600'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Photos
            </Link>
          </div>

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
    </nav>
  )
}
