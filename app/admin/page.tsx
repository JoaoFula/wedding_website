/**
 * Admin Dashboard Page
 *
 * Protected page that shows all RSVPs from the database
 * Features:
 * - Requires login with is_admin=true
 * - View all guest RSVPs in a table
 * - Filter by attending status
 * - See dietary restrictions, accommodation needs, etc.
 * - Manage guest credentials
 * - Export-friendly table view
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Guest, GuestCredential } from '@/types/database'
import { LogOut, Users, UserCheck, UserX } from 'lucide-react'

interface UserSession {
  username: string
  guestName: string
  isAdmin: boolean
  hasRsvped: boolean
  loginTime: string
}

export default function AdminPage() {
  const router = useRouter()

  // Auth state
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Data state
  const [guests, setGuests] = useState<Guest[]>([])
  const [guestCredentials, setGuestCredentials] = useState<GuestCredential[]>([])
  const [filter, setFilter] = useState<'all' | 'attending' | 'not-attending'>('all')
  const [activeTab, setActiveTab] = useState<'rsvps' | 'guests'>('rsvps')

  const supabase = createClient()

  /**
   * Check if user is logged in and is admin
   */
  useEffect(() => {
    const sessionData = localStorage.getItem('userSession')
    if (!sessionData) {
      // No session - redirect to login
      router.push('/login?redirect=/admin')
      return
    }

    try {
      const session: UserSession = JSON.parse(sessionData)

      if (!session.isAdmin) {
        // Not an admin - redirect to home
        alert('Access denied. Admin privileges required.')
        router.push('/')
        return
      }

      setUserSession(session)
      fetchData()
    } catch (error) {
      console.error('Invalid session data:', error)
      router.push('/login?redirect=/admin')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  /**
   * Fetch all data (RSVPs and guest credentials)
   */
  const fetchData = async () => {
    await Promise.all([fetchGuests(), fetchGuestCredentials()])
  }

  /**
   * Fetch all guests/RSVPs from database
   */
  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error fetching guests:', error)
    }
  }

  /**
   * Fetch all guest credentials
   */
  const fetchGuestCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('guest_credentials')
        .select('*')
        .order('guest_name', { ascending: true })

      if (error) throw error
      setGuestCredentials(data || [])
    } catch (error) {
      console.error('Error fetching guest credentials:', error)
    }
  }

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem('userSession')
    router.push('/')
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
  const totalCredentials = guestCredentials.length
  const rsvpedCount = guestCredentials.filter((g) => g.has_rsvped).length

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Logged in as: <span className="font-semibold">{userSession?.guestName}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('rsvps')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'rsvps'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              RSVPs ({totalGuests})
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'guests'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Guest List ({totalCredentials})
            </button>
          </div>
        </div>

        {/* RSVP Tab */}
        {activeTab === 'rsvps' && (
          <>
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

            {/* RSVPs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {guest.username}
                          </td>
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
          </>
        )}

        {/* Guest List Tab */}
        {activeTab === 'guests' && (
          <>
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-semibold mb-1">Guest Credentials</p>
              <p className="text-sm text-blue-800">
                This shows all users who have login credentials. Green checkmark indicates they've already RSVP'd.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PIN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Is Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Has RSVP'd
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guestCredentials.map((credential) => (
                      <tr key={credential.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {credential.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {credential.guest_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {credential.pin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {credential.is_admin ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              Admin
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {credential.has_rsvped ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {credential.last_login
                            ? new Date(credential.last_login).toLocaleString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">
                <strong>Total invited guests:</strong> {totalCredentials}
              </p>
              <p>
                <strong>Guests who have RSVP'd:</strong> {rsvpedCount} ({Math.round((rsvpedCount / totalCredentials) * 100)}%)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
