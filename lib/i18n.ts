export const LOCALES = [
  { code: 'en-US', flag: '🇺🇸', label: 'EN-US', name: 'English (US)',       deeplCode: 'EN-US' },
  { code: 'en-GB', flag: '🇬🇧', label: 'EN-GB', name: 'English (British)',   deeplCode: 'EN-GB' },
  { code: 'pt',    flag: '🇵🇹', label: 'PT',    name: 'Português',           deeplCode: 'PT-PT' },
  { code: 'cs',    flag: '🇨🇿', label: 'CS',    name: 'Čeština',             deeplCode: 'CS'    },
  { code: 'sv',    flag: '🇸🇪', label: 'SV',    name: 'Svenska',             deeplCode: 'SV'    },
  { code: 'it',    flag: '🇮🇹', label: 'IT',    name: 'Italiano',            deeplCode: 'IT'    },
  { code: 'de',    flag: '🇩🇪', label: 'DE',    name: 'Deutsch',             deeplCode: 'DE'    },
  { code: 'el',    flag: '🇬🇷', label: 'EL',    name: 'Ελληνικά',            deeplCode: 'EL'    },
  { code: 'pl',    flag: '🇵🇱', label: 'PL',    name: 'Polski',              deeplCode: 'PL'    },
  { code: 'es-MX', flag: '🇲🇽', label: 'ES',    name: 'Español (México)',    deeplCode: 'ES'    },
  { code: 'da',    flag: '🇩🇰', label: 'DA',    name: 'Dansk',               deeplCode: 'DA'    },
  { code: 'ar',    flag: '🇲🇦', label: 'AR',    name: 'العربية',             deeplCode: 'AR'    },
  { code: 'fr',    flag: '🇫🇷', label: 'FR',    name: 'Français',            deeplCode: 'FR'    },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']
export type Translations = Record<string, string>

export const DEFAULT_LOCALE: LocaleCode = 'en-US'
export const STORAGE_KEY = 'wedding_locale'

export function createTranslator(translations: Translations, fallback: Translations) {
  return (key: string): string => translations[key] ?? fallback[key] ?? key
}

export function findKeysToTranslate(
  source: Translations,
  existing: Translations,
  cache: Translations
): string[] {
  return Object.keys(source).filter(
    key => !(key in existing) || cache[key] !== source[key]
  )
}
