/**
 * Database Types
 *
 * TypeScript types for Supabase database tables
 * This ensures type safety when working with database queries
 */

export interface GuestCredential {
  id: string
  created_at: string
  username: string
  pin: string
  guest_name: string
  is_admin: boolean
  has_rsvped: boolean
  last_login?: string
}

export interface Guest {
  id: string
  created_at: string
  username: string
  name: string
  attending: boolean
  plus_one_name?: string
  dietary_restrictions?: string
  accommodation_needed: boolean
  spotify_song_suggestion?: string
  additional_notes?: string
}

/**
 * Type for inserting a new guest credential (without auto-generated fields)
 */
export type GuestCredentialInsert = Omit<GuestCredential, 'id' | 'created_at' | 'has_rsvped' | 'last_login'>

/**
 * Type for updating a guest credential (all fields optional)
 */
export type GuestCredentialUpdate = Partial<GuestCredentialInsert>

/**
 * Type for inserting a new guest (without auto-generated fields)
 */
export type GuestInsert = Omit<Guest, 'id' | 'created_at'>

/**
 * Type for updating a guest (all fields optional)
 */
export type GuestUpdate = Partial<GuestInsert>
