/**
 * Admin Dashboard Page
 *
 * Protected page that shows all RSVPs from the database
 * Features:
 * - Login/logout functionality
 * - View all guest RSVPs in a table
 * - Filter by attending status
 * - See dietary restrictions, accommodation needs, etc.
 * - Export-friendly table view
 *
 * Note: You need to create a user in Supabase Auth first:
 * 1. Go to your Supabase dashboard
 * 2. Navigate to Authentication > Users
 * 3. Click "Add User" and create a user with email/password
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Guest } from '@/types/database'
import { LogOut, Users, UserCheck, UserX, Home } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Data state
  const [guests, setGuests] = useState<Guest[]>([])
  const [filter, setFilter] = useState<'all' | 'attending' | 'not-attending'>('all')

  const supabase = createClient()

  /**
   * Check if user is already logged in
   */
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Fetch guests when authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchGuests()
    }
  }, [isAuthenticated])

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    } catch (error) {
      console.error('Error checking auth:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle login
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login error:', error)
      setLoginError(error instanceof Error ? error.message : 'Failed to login')
    }
  }

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setGuests([])
  }

  /**
   * Fetch all guests from database
   */
  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setGuests(data || [])
    } catch (error) {
      console.error('Error fetching guests:', error)
    }
  }

  /**
   * Filter guests based on attendance
   */
  const filteredGuests = guests.filter((guest) => {
    if (filter === 'attending') return guest.attending
    if (filter === 'not-attending') return !guest.attending
    return true
  })

  // Stats
  const totalGuests = guests.length
  const attending = guests.filter((g) => g.attending).length
  const notAttending = guests.filter((g) => !g.attending).length

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Login form - shown when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Sign in to view RSVPs</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {loginError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>

            <div className="text-center">
              <Link href="/" className="text-sm text-rose-600 hover:underline inline-flex items-center gap-1">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Admin dashboard - shown when authenticated
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">RSVP Dashboard</h1>
            <p className="text-gray-600">Manage your wedding guest list</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold">{totalGuests}</h3>
            </div>
            <p className="text-gray-600">Total Responses</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold">{attending}</h3>
            </div>
            <p className="text-gray-600">Attending</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <UserX className="w-8 h-8 text-red-600" />
              <h3 className="text-2xl font-bold">{notAttending}</h3>
            </div>
            <p className="text-gray-600">Not Attending</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-rose-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({totalGuests})
          </button>
          <button
            onClick={() => setFilter('attending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'attending' ? 'bg-rose-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Attending ({attending})
          </button>
          <button
            onClick={() => setFilter('not-attending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'not-attending' ? 'bg-rose-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Not Attending ({notAttending})
          </button>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plus One
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dietary Restrictions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accommodation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Song Suggestion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No RSVPs yet
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {guest.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            guest.attending
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {guest.attending ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {guest.plus_one_name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {guest.dietary_restrictions || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {guest.accommodation_needed ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {guest.spotify_song_suggestion || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Notes Section */}
        {filteredGuests.some((g) => g.additional_notes) && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
              Additional Notes from Guests
            </h2>
            <div className="space-y-4">
              {filteredGuests
                .filter((g) => g.additional_notes)
                .map((guest) => (
                  <div key={guest.id} className="border-l-4 border-rose-500 pl-4">
                    <p className="font-semibold text-gray-900">{guest.name}</p>
                    <p className="text-gray-600 mt-1">{guest.additional_notes}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
