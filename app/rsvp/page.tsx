/**
 * RSVP Page
 *
 * Protected page - requires guest authentication
 * Allows authenticated guests to submit their RSVP to the wedding
 * Features:
 * - Checks for valid guest session
 * - Form with all required fields (name, email, attending, dietary restrictions, etc.)
 * - Validates input before submission
 * - Saves to Supabase database with username
 * - Shows success/error messages
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Heart, CheckCircle, AlertCircle, LogOut } from 'lucide-react'
import { sanitizeText } from '@/utils/validation'
import { useTranslation } from '@/components/LanguageProvider'

interface UserSession {
  username: string
  guestName: string
  isAdmin: boolean
  hasRsvped: boolean
  loginTime: string
}

export default function RSVPPage() {
  const { t } = useTranslation()
  const router = useRouter()

  // Auth state
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Plus one name from guest credentials (set by admin)
  const [plusOneName, setPlusOneName] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    attending: true,
    plusOneAttending: true,
    dietaryRestrictions: '',
    accommodationNeeded: false,
    additionalNotes: '',
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * Check if user is logged in
   * This runs only once on component mount to preserve session across navigation
   */
  useEffect(() => {
    const sessionData = localStorage.getItem('userSession')
    if (!sessionData) {
      router.push('/login?redirect=/rsvp')
      return
    }

    const initSession = async () => {
      try {
        const session: UserSession = JSON.parse(sessionData)
        setUserSession(session)
        setFormData((prev) => ({ ...prev, name: session.guestName }))

        const supabase = createClient()
        const { data } = await supabase
          .from('guest_credentials')
          .select('plus_one_name')
          .eq('username', session.username)
          .single()
        if (data?.plus_one_name) {
          setPlusOneName(data.plus_one_name)
        }
      } catch (error) {
        console.error('Invalid session data:', error)
        router.push('/login?redirect=/rsvp')
      } finally {
        setIsCheckingAuth(false)
      }
    }

    initSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem('userSession')
    router.push('/')
  }

  /**
   * Handle form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  /**
   * Handle form submission
   * Validates data and saves to Supabase
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      if (!userSession) {
        throw new Error('No active session. Please log in again.')
      }

      // Sanitize text inputs to prevent XSS
      const sanitizedName = sanitizeText(formData.name)
      const sanitizedDietary = formData.dietaryRestrictions ? sanitizeText(formData.dietaryRestrictions) : null
      const sanitizedNotes = formData.additionalNotes ? sanitizeText(formData.additionalNotes) : null

      if (!sanitizedName || sanitizedName.length < 2) {
        throw new Error('Please enter your full name.')
      }

      // Create Supabase client
      const supabase = createClient()

      // Upsert RSVP: insert or overwrite based on unique username constraint
      // Requires UNIQUE constraint on guests.username in the database
      const { error } = await supabase.from('guests').upsert(
        {
          username: userSession.username,
          name: sanitizedName,
          attending: formData.attending,
          plus_one_attending: plusOneName ? formData.plusOneAttending : null,
          dietary_restrictions: sanitizedDietary,
          accommodation_needed: formData.accommodationNeeded,
          additional_notes: sanitizedNotes,
        },
        { onConflict: 'username' }
      )

      if (error) {
        console.error('Supabase upsert error details:', JSON.stringify(error, null, 2))
        throw new Error(`DB error: ${error.message || error.code || error.details || JSON.stringify(error)}`)
      }

      // Success!
      setSubmitStatus('success')
      // Update session to mark as RSVP'd
      const updatedSession = { ...userSession, hasRsvped: true }
      setUserSession(updatedSession)
      localStorage.setItem('userSession', JSON.stringify(updatedSession))

      // Reset form (keep name)
      setFormData({
        name: userSession.guestName,
        attending: true,
        plusOneAttending: true,
        dietaryRestrictions: '',
        accommodationNeeded: false,
        additionalNotes: '',
      })
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit RSVP. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-rose-500 fill-current animate-pulse" />
          <p className="text-gray-600">{t('rsvp.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-rose-500 fill-current" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('rsvp.heading')}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {t('rsvp.subtitle')}
          </p>
          {userSession && (
            <div className="flex items-center justify-center gap-4">
              <p className="text-sm text-gray-500">
                {t('rsvp.loggedInAs')} <span className="font-semibold">{userSession.guestName}</span>
              </p>
              <button
                onClick={handleLogout}
                className="text-sm text-rose-600 hover:underline inline-flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                {t('common.logout')}
              </button>
            </div>
          )}
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">{t('rsvp.success.heading')}</h3>
              <p className="text-green-700 text-sm mt-1">
                {t('rsvp.success.body')}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">{t('rsvp.error.heading')}</h3>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* RSVP Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('rsvp.field.name')} <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder={t('rsvp.field.name.placeholder')}
            />
          </div>

          {/* Attending Field — main guest */}
          <div>
            <label htmlFor="attending" className="block text-sm font-medium text-gray-700 mb-2">
              {t('rsvp.field.attending').replace('{name}', formData.name || t('rsvp.field.name'))} <span className="text-rose-600">*</span>
            </label>
            <select
              id="attending"
              name="attending"
              required
              value={formData.attending.toString()}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, attending: e.target.value === 'true' }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="true">{t('rsvp.field.attending.yes')}</option>
              <option value="false">{t('rsvp.field.attending.no')}</option>
            </select>
          </div>

          {/* Attending Field — plus one (only shown if admin set a plus one name) */}
          {plusOneName && (
            <div>
              <label htmlFor="plusOneAttending" className="block text-sm font-medium text-gray-700 mb-2">
                {t('rsvp.field.attending').replace('{name}', plusOneName)} <span className="text-rose-600">*</span>
              </label>
              <select
                id="plusOneAttending"
                name="plusOneAttending"
                required
                value={formData.plusOneAttending.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, plusOneAttending: e.target.value === 'true' }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="true">{t('rsvp.field.plusOne.attending.yes')}</option>
                <option value="false">{t('rsvp.field.plusOne.attending.no')}</option>
              </select>
            </div>
          )}

          {/* Conditional fields - only show if attending */}
          {formData.attending && (
            <>
              {/* Dietary Restrictions */}
              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.field.dietary')}
                </label>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  rows={3}
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder={t('rsvp.field.dietary.placeholder')}
                />
              </div>

              {/* Accommodation Needed */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="accommodationNeeded"
                  name="accommodationNeeded"
                  checked={formData.accommodationNeeded}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label htmlFor="accommodationNeeded" className="ml-3 text-sm text-gray-700">
                  {t('rsvp.field.accommodation')}
                </label>
              </div>

              {/* Spotify Playlist */}
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-3">
                  {t('rsvp.playlist.heading')}
                </p>
                <div className="rounded-lg overflow-hidden mb-3">
                  <iframe
                    title="Wedding Playlist"
                    src="https://open.spotify.com/embed/playlist/1q7gd1czHuYwJ3RSd8fklx"
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="border-0"
                  />
                </div>
                <a
                  href={process.env.NEXT_PUBLIC_SPOTIFY_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t('rsvp.playlist.button')}
                </a>
                <p className="mt-2 text-sm text-gray-500">
                  {t('rsvp.playlist.hint')}
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.field.notes')}
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder={t('rsvp.field.notes.placeholder')}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('rsvp.submitting') : t('rsvp.submit')}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {t('rsvp.contact')}{' '}
            <a href="mailto:hsifula@gmail.com" className="text-rose-600 hover:underline">
              hsifula@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
