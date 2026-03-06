/**
 * Database Types
 *
 * TypeScript types for Supabase database tables
 * This ensures type safety when working with database queries
 */

export interface Guest {
  id: string
  created_at: string
  name: string
  email: string
  attending: boolean
  plus_one_name?: string
  dietary_restrictions?: string
  accommodation_needed: boolean
  spotify_song_suggestion?: string
  additional_notes?: string
}

/**
 * Type for inserting a new guest (without auto-generated fields)
 */
export type GuestInsert = Omit<Guest, 'id' | 'created_at'>

/**
 * Type for updating a guest (all fields optional)
 */
export type GuestUpdate = Partial<GuestInsert>
