import fs from 'fs'
import path from 'path'

const API_KEY = process.env.DEEPL_API_KEY
if (!API_KEY) {
  console.error('Error: DEEPL_API_KEY environment variable is not set')
  process.exit(1)
}

const LOCALES_DIR = path.join(process.cwd(), 'locales')
const CACHE_FILE = path.join(LOCALES_DIR, '.cache.json')
const SOURCE_FILE = path.join(LOCALES_DIR, 'en-US.json')

const TARGETS: Array<{ code: string; deeplCode: string }> = [
  { code: 'en-GB', deeplCode: 'EN-GB' },
  { code: 'pt',    deeplCode: 'PT-PT' },
  { code: 'cs',    deeplCode: 'CS' },
  { code: 'sv',    deeplCode: 'SV' },
  { code: 'it',    deeplCode: 'IT' },
  { code: 'de',    deeplCode: 'DE' },
  { code: 'el',    deeplCode: 'EL' },
  { code: 'pl',    deeplCode: 'PL' },
  { code: 'es-MX', deeplCode: 'ES' },
  { code: 'da',    deeplCode: 'DA' },
  { code: 'ar',    deeplCode: 'AR' },
  { code: 'fr',    deeplCode: 'FR' },
]

type Translations = Record<string, string>
type Cache = Record<string, Record<string, string>> // cache[locale][key] = english source value when translated

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const params = new URLSearchParams()
  params.append('auth_key', API_KEY!)
  params.append('target_lang', targetLang)
  params.append('source_lang', 'EN')
  params.append('tag_handling', 'xml')
  params.append('ignore_tags', 'keep')
  for (const text of texts) {
    params.append('text', text)
  }

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`DeepL API error ${response.status}: ${errorBody}`)
  }

  const data = await response.json() as { translations: Array<{ text: string }> }
  return data.translations.map(t => t.text)
}

function readJson<T>(filePath: string, defaultValue: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch {
    return defaultValue
  }
}

function findKeysToTranslate(
  source: Translations,
  existing: Translations,
  localeCache: Translations
): string[] {
  return Object.keys(source).filter(
    key => !(key in existing) || localeCache[key] !== source[key]
  )
}

async function processLocale(
  locale: { code: string; deeplCode: string },
  source: Translations,
  cache: Cache
): Promise<number> {
  const localeFile = path.join(LOCALES_DIR, `${locale.code}.json`)
  const existing = readJson<Translations>(localeFile, {})
  const localeCache = cache[locale.code] ?? {}

  const keysToTranslate = findKeysToTranslate(source, existing, localeCache)

  if (keysToTranslate.length === 0) {
    console.log(`  ${locale.code}: up to date, skipping`)
    return 0
  }

  console.log(`  ${locale.code}: translating ${keysToTranslate.length} key(s)...`)

  const BATCH_SIZE = 50
  const translated: Translations = { ...existing }
  const updatedCache: Translations = { ...localeCache }

  for (let i = 0; i < keysToTranslate.length; i += BATCH_SIZE) {
    const batch = keysToTranslate.slice(i, i + BATCH_SIZE)
    const texts = batch.map(k => source[k])
    const results = await translateBatch(texts, locale.deeplCode)

    for (let j = 0; j < batch.length; j++) {
      translated[batch[j]] = results[j]
      updatedCache[batch[j]] = source[batch[j]]
    }

    if (i + BATCH_SIZE < keysToTranslate.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  fs.writeFileSync(localeFile, JSON.stringify(translated, null, 2) + '\n', 'utf-8')
  cache[locale.code] = updatedCache

  return keysToTranslate.length
}

async function main() {
  console.log('Reading source file...')
  const source = readJson<Translations>(SOURCE_FILE, {})
  const keyCount = Object.keys(source).length
  console.log(`  ${keyCount} keys in en-US.json`)

  const cache = readJson<Cache>(CACHE_FILE, {})

  console.log('\nProcessing locales...')
  let totalTranslated = 0

  for (const locale of TARGETS) {
    try {
      const count = await processLocale(locale, source, cache)
      totalTranslated += count
    } catch (err) {
      console.error(`  ${locale.code}: ERROR - ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n', 'utf-8')

  console.log(`\nDone. ${totalTranslated} key(s) translated across all locales.`)
  console.log('Cache updated at locales/.cache.json')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
