/**
 * RSVP Page
 *
 * Allows guests to submit their RSVP to the wedding
 * Features:
 * - Form with all required fields (name, email, attending, dietary restrictions, etc.)
 * - Validates input before submission
 * - Saves to Supabase database
 * - Shows success/error messages
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Heart, CheckCircle, AlertCircle } from 'lucide-react'

export default function RSVPPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: true,
    plusOneName: '',
    dietaryRestrictions: '',
    accommodationNeeded: false,
    spotifySongSuggestion: '',
    additionalNotes: '',
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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
      // Create Supabase client
      const supabase = createClient()

      // Insert the RSVP data
      const { error } = await supabase.from('guests').insert({
        name: formData.name,
        email: formData.email,
        attending: formData.attending,
        plus_one_name: formData.plusOneName || null,
        dietary_restrictions: formData.dietaryRestrictions || null,
        accommodation_needed: formData.accommodationNeeded,
        spotify_song_suggestion: formData.spotifySongSuggestion || null,
        additional_notes: formData.additionalNotes || null,
      })

      if (error) {
        throw error
      }

      // Success!
      setSubmitStatus('success')
      // Reset form
      setFormData({
        name: '',
        email: '',
        attending: true,
        plusOneName: '',
        dietaryRestrictions: '',
        accommodationNeeded: false,
        spotifySongSuggestion: '',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-rose-500 fill-current" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            RSVP to Our Wedding
          </h1>
          <p className="text-lg text-gray-600">
            We'd love to know if you can join us on our special day!
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">RSVP Submitted Successfully!</h3>
              <p className="text-green-700 text-sm mt-1">
                Thank you for your response. We can't wait to celebrate with you!
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error Submitting RSVP</h3>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* RSVP Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Attending Field */}
          <div>
            <label htmlFor="attending" className="block text-sm font-medium text-gray-700 mb-2">
              Will you be attending? <span className="text-rose-600">*</span>
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
              <option value="true">Yes, I'll be there!</option>
              <option value="false">Sorry, I can't make it</option>
            </select>
          </div>

          {/* Conditional fields - only show if attending */}
          {formData.attending && (
            <>
              {/* Plus One Name */}
              <div>
                <label htmlFor="plusOneName" className="block text-sm font-medium text-gray-700 mb-2">
                  Plus One Name (if applicable)
                </label>
                <input
                  type="text"
                  id="plusOneName"
                  name="plusOneName"
                  value={formData.plusOneName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Guest's name (optional)"
                />
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions or Allergies
                </label>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  rows={3}
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Please let us know about any dietary restrictions or allergies"
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
                  I would like help with accommodation
                </label>
              </div>

              {/* Spotify Song Suggestion */}
              <div>
                <label htmlFor="spotifySongSuggestion" className="block text-sm font-medium text-gray-700 mb-2">
                  Song Suggestion for Our Playlist
                </label>
                <input
                  type="text"
                  id="spotifySongSuggestion"
                  name="spotifySongSuggestion"
                  value={formData.spotifySongSuggestion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Song name - Artist (optional)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Suggest a song you'd love to hear at the wedding!
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes or Messages
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Any special requests or messages for us?"
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
              {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Need to update your RSVP? Contact us at{' '}
            <a href="mailto:your.email@example.com" className="text-rose-600 hover:underline">
              your.email@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
