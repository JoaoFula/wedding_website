import { describe, it, expect } from 'vitest'
import { createTranslator, findKeysToTranslate } from '../lib/i18n'

describe('createTranslator', () => {
  it('returns the translation for a known key', () => {
    const t = createTranslator({ 'nav.home': 'Domů' }, { 'nav.home': 'Home' })
    expect(t('nav.home')).toBe('Domů')
  })

  it('falls back to the fallback when key is missing in translations', () => {
    const t = createTranslator({}, { 'nav.home': 'Home' })
    expect(t('nav.home')).toBe('Home')
  })

  it('returns the key itself when neither translations nor fallback has it', () => {
    const t = createTranslator({}, {})
    expect(t('missing.key')).toBe('missing.key')
  })

  it('prefers translations over fallback', () => {
    const t = createTranslator({ 'nav.home': 'Domů' }, { 'nav.home': 'Home' })
    expect(t('nav.home')).toBe('Domů')
  })
})

describe('findKeysToTranslate', () => {
  it('returns all keys when existing is empty', () => {
    const source = { a: 'Hello', b: 'World' }
    const result = findKeysToTranslate(source, {}, {})
    expect(result).toEqual(['a', 'b'])
  })

  it('skips keys that exist in target and match the cache', () => {
    const source = { a: 'Hello', b: 'World' }
    const existing = { a: 'Hola', b: 'Mundo' }
    const cache = { a: 'Hello', b: 'World' }
    const result = findKeysToTranslate(source, existing, cache)
    expect(result).toEqual([])
  })

  it('re-translates keys whose source value changed since last cache', () => {
    const source = { a: 'Hello updated', b: 'World' }
    const existing = { a: 'Hola', b: 'Mundo' }
    const cache = { a: 'Hello', b: 'World' }
    const result = findKeysToTranslate(source, existing, cache)
    expect(result).toEqual(['a'])
  })

  it('translates keys missing from existing even if in cache', () => {
    const source = { a: 'Hello', b: 'World' }
    const existing = { a: 'Hola' }
    const cache = { a: 'Hello', b: 'World' }
    const result = findKeysToTranslate(source, existing, cache)
    expect(result).toEqual(['b'])
  })
})
