'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Heart, LogIn, LogOut, User } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/components/LanguageProvider'
import { LOCALES, LocaleCode } from '@/lib/i18n'

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
  const { t, locale, setLocale } = useTranslation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('userSession')
      if (sessionData) {
        try {
          const session: UserSession = JSON.parse(sessionData)
          setIsLoggedIn(true)
          setUserSession(session)
        } catch {
          setIsLoggedIn(false)
          setUserSession(null)
        }
      } else {
        setIsLoggedIn(false)
        setUserSession(null)
      }
    }
    checkSession()
    window.addEventListener('storage', checkSession)
    return () => window.removeEventListener('storage', checkSession)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    if (langOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [langOpen])

  const handleLogout = () => {
    localStorage.removeItem('userSession')
    setIsLoggedIn(false)
    setUserSession(null)
    router.push('/')
  }

  const isActive = (path: string) => pathname === path
  const currentLocale = LOCALES.find(l => l.code === locale) ?? LOCALES[0]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 text-rose-600 hover:text-rose-700">
            <Heart className="w-6 h-6 fill-current" />
            <span className="font-semibold text-lg">Our Wedding</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {[
              { href: '/', label: t('nav.home') },
              { href: '/story', label: t('nav.story') },
              { href: isLoggedIn ? '/rsvp' : '/login?redirect=/rsvp', label: t('nav.rsvp') },
              { href: '/details', label: t('nav.details') },
              { href: isLoggedIn ? '/photos' : '/login?redirect=/photos', label: t('nav.photos') },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`${
                  isActive(href.split('?')[0])
                    ? 'text-rose-600 border-b-2 border-rose-600'
                    : 'text-gray-700 hover:text-rose-600'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-rose-400 transition-colors"
                aria-label="Select language"
              >
                <span>{currentLocale.flag}</span>
                <span className="text-gray-700 font-medium hidden sm:inline">{currentLocale.label}</span>
                <span className="text-gray-400 text-xs">{langOpen ? '▲' : '▼'}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                  {LOCALES.map(loc => (
                    <button
                      key={loc.code}
                      onClick={() => { setLocale(loc.code as LocaleCode); setLangOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                        loc.code === locale ? 'bg-rose-50 border-l-2 border-rose-500' : ''
                      }`}
                    >
                      <span className="text-xl">{loc.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loc.name}</div>
                        {loc.code === locale && (
                          <div className="text-xs text-rose-500">Current</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User section */}
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
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t('nav.login')}
              </Link>
            )}

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
