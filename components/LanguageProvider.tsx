'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  LOCALES,
  LocaleCode,
  Translations,
  DEFAULT_LOCALE,
  STORAGE_KEY,
  createTranslator,
} from '@/lib/i18n'

interface LanguageContextValue {
  locale: LocaleCode
  setLocale: (code: LocaleCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const localeImports: Record<LocaleCode, () => Promise<{ default: Translations }>> = {
  'en-US': () => import('@/locales/en-US.json'),
  'en-GB': () => import('@/locales/en-GB.json'),
  'pt':    () => import('@/locales/pt.json'),
  'cs':    () => import('@/locales/cs.json'),
  'sv':    () => import('@/locales/sv.json'),
  'it':    () => import('@/locales/it.json'),
  'de':    () => import('@/locales/de.json'),
  'el':    () => import('@/locales/el.json'),
  'pl':    () => import('@/locales/pl.json'),
  'es-MX': () => import('@/locales/es-MX.json'),
  'da':    () => import('@/locales/da.json'),
  'ar':    () => import('@/locales/ar.json'),
  'fr':    () => import('@/locales/fr.json'),
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE)
  const [translations, setTranslations] = useState<Translations>({})
  const [fallback, setFallback] = useState<Translations>({})

  useEffect(() => {
    localeImports['en-US']().then(m => setFallback(m.default))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LocaleCode | null
    if (saved && LOCALES.some(l => l.code === saved)) setLocaleState(saved)
  }, [])

  useEffect(() => {
    let cancelled = false
    localeImports[locale]().then(m => {
      if (!cancelled) setTranslations(m.default)
    })
    return () => { cancelled = true }
  }, [locale])

  const setLocale = (code: LocaleCode) => {
    setLocaleState(code)
    localStorage.setItem(STORAGE_KEY, code)
  }

  const t = createTranslator(translations, fallback)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider')
  return ctx
}
