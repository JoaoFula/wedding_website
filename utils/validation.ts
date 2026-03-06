/**
 * Input Validation and Sanitization Utilities
 *
 * These functions help prevent SQL injection, XSS, and other security issues
 * by validating and sanitizing user input before it's processed.
 */

/**
 * Validate and sanitize username
 * - Only allows lowercase letters, numbers, dots, hyphens, underscores
 * - Prevents SQL injection and path traversal attacks
 */
export function sanitizeUsername(username: string): string {
  // Convert to lowercase and trim
  let sanitized = username.toLowerCase().trim()

  // Remove any characters that aren't alphanumeric, dots, hyphens, or underscores
  sanitized = sanitized.replace(/[^a-z0-9._-]/g, '')

  // Limit length to prevent DoS
  sanitized = sanitized.substring(0, 50)

  return sanitized
}

/**
 * Validate username format
 * Returns true if username is valid
 */
export function isValidUsername(username: string): boolean {
  // Check minimum length
  if (username.length < 2) {
    return false
  }

  // Check maximum length
  if (username.length > 50) {
    return false
  }

  // Must contain only lowercase letters, numbers, dots, hyphens, underscores
  const usernameRegex = /^[a-z0-9._-]+$/
  return usernameRegex.test(username)
}

/**
 * Validate and sanitize PIN
 * - Only allows alphanumeric characters
 * - Prevents injection attacks
 */
export function sanitizePin(pin: string): string {
  // Trim whitespace
  let sanitized = pin.trim()

  // Remove non-alphanumeric characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '')

  // Limit length
  sanitized = sanitized.substring(0, 20)

  return sanitized
}

/**
 * Validate PIN format
 * Returns true if PIN is valid
 */
export function isValidPin(pin: string): boolean {
  // Check minimum length (at least 4 characters)
  if (pin.length < 4) {
    return false
  }

  // Check maximum length
  if (pin.length > 20) {
    return false
  }

  // Must contain only alphanumeric characters
  const pinRegex = /^[a-zA-Z0-9]+$/
  return pinRegex.test(pin)
}

/**
 * Sanitize text input (for names, notes, etc.)
 * Prevents XSS by removing potentially dangerous characters
 */
export function sanitizeText(text: string): string {
  // Trim whitespace
  let sanitized = text.trim()

  // Remove HTML tags to prevent XSS
  sanitized = sanitized.replace(/<[^>]*>/g, '')

  // Remove script tags and event handlers
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')
  sanitized = sanitized.replace(/<script/gi, '')
  sanitized = sanitized.replace(/<\/script>/gi, '')

  // Limit length to prevent DoS
  sanitized = sanitized.substring(0, 1000)

  return sanitized
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().substring(0, 255)
}

/**
 * Rate limiting helper - tracks login attempts
 * Simple in-memory rate limiting (resets on page reload)
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  /**
   * Check if user has exceeded rate limit
   * @param identifier - Usually username or IP
   * @param maxAttempts - Maximum attempts allowed
   * @param windowMs - Time window in milliseconds
   */
  isRateLimited(identifier: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    // Reset if time window has passed
    if (now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    // Increment attempts
    record.count++

    // Check if rate limited
    if (record.count > maxAttempts) {
      return true
    }

    return false
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }

  /**
   * Clear all rate limit records
   */
  clearAll(): void {
    this.attempts.clear()
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

/**
 * Comprehensive validation for login credentials
 */
export function validateLoginCredentials(username: string, pin: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate username
  if (!username || username.trim() === '') {
    errors.push('Username is required')
  } else if (!isValidUsername(sanitizeUsername(username))) {
    errors.push('Username must be 2-50 characters and contain only letters, numbers, dots, hyphens, or underscores')
  }

  // Validate PIN
  if (!pin || pin.trim() === '') {
    errors.push('PIN is required')
  } else if (!isValidPin(sanitizePin(pin))) {
    errors.push('PIN must be 4-20 alphanumeric characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
