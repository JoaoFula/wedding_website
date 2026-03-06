/**
 * Unified Login Page
 *
 * Single login page for all users (guests and admins)
 * - Everyone uses username/PIN to log in
 * - Users with is_admin=true can access admin panel
 * - Regular guests can only access RSVP
 */

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Heart, LogIn, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/rsvp'

  const [formData, setFormData] = useState({
    username: '',
    pin: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'username' ? value.toLowerCase() : value,
    }))
    setError('')
  }

  /**
   * Handle login submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const supabase = createClient()

      // Verify credentials against guest_credentials table
      const { data, error: queryError } = await supabase
        .from('guest_credentials')
        .select('*')
        .eq('username', formData.username.toLowerCase())
        .eq('pin', formData.pin)
        .single()

      if (queryError || !data) {
        throw new Error('Invalid username or PIN. Please check your credentials.')
      }

      // Store user session in localStorage
      const userSession = {
        username: data.username,
        guestName: data.guest_name,
        isAdmin: data.is_admin,
        hasRsvped: data.has_rsvped,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem('userSession', JSON.stringify(userSession))

      // Redirect based on user role
      if (redirectTo === '/admin' && !data.is_admin) {
        // Non-admin trying to access admin page - redirect to RSVP
        router.push('/rsvp')
      } else {
        // Redirect to requested page or default
        router.push(redirectTo)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 mx-auto mb-4 text-rose-500 fill-current animate-pulse" />
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Please log in to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent lowercase"
              placeholder="firstname.lastname"
              autoComplete="username"
              autoFocus
            />
            <p className="mt-1 text-sm text-gray-500">
              From your invitation (e.g., john.smith)
            </p>
          </div>

          {/* PIN Field */}
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              PIN <span className="text-rose-600">*</span>
            </label>
            <input
              type="password"
              id="pin"
              name="pin"
              required
              value={formData.pin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Enter your PIN"
              autoComplete="current-password"
              inputMode="numeric"
            />
            <p className="mt-1 text-sm text-gray-500">
              The PIN from your invitation
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Help Text */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-2">
              Don't have login credentials?
            </p>
            <p className="text-sm text-gray-500 text-center">
              Check your wedding invitation or{' '}
              <a href="mailto:your.email@example.com" className="text-rose-600 hover:underline">
                contact us
              </a>
            </p>
          </div>
        </form>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-rose-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">Why do I need to log in?</p>
          <p className="text-sm text-blue-800">
            Login credentials ensure that only invited guests can RSVP. Your username and PIN
            were included in your wedding invitation. This helps us track responses accurately
            and prevent spam RSVPs.
          </p>
        </div>
      </div>
    </div>
  )
}
