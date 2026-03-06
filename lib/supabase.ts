/**
 * Supabase Client Configuration
 *
 * This file creates and exports Supabase clients for different contexts:
 * - Browser client: For client-side operations
 * - Server client: For server-side operations (API routes, server components)
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Create a Supabase client for browser/client-side usage
 * This is used in Client Components and client-side code
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
