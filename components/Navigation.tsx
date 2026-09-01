'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LogIn, LogOut, User } from 'lucide-react'
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
          <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-500">
            <Image
              src="/brownflower.jpg"
              alt=""
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover"
            />
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
                    ? 'text-yellow-600 border-b-2 border-yellow-600'
                    : 'text-gray-700 hover:text-yellow-600'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative" ref={langRef} onKeyDown={(e) => { if (e.key === 'Escape') setLangOpen(false) }}>
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-yellow-400 transition-colors"
                aria-label={`Select language, current: ${currentLocale.name}`}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
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
                        loc.code === locale ? 'bg-yellow-50 border-l-2 border-yellow-500' : ''
                      }`}
                    >
                      <span className="text-xl">{loc.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loc.name}</div>
                        {loc.code === locale && (
                          <span className="text-yellow-500 text-xs ml-auto">✓</span>
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
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t('nav.login')}
              </Link>
            )}

            <div className="md:hidden">
              <button className="text-gray-700 hover:text-yellow-600">
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
