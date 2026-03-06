/**
 * Home Page
 *
 * The landing page for the wedding website
 * Features:
 * - Hero section with couple's names and wedding date
 * - Beautiful background with overlay
 * - Call-to-action buttons to RSVP and view details
 * - Placeholder for couple's photo (you'll replace with your actual photo)
 */

import Link from 'next/link'
import { Calendar, MapPin, Heart } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image - Replace the src with your actual photo */}
        {/* You can add an image to /public folder and reference it here */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100" />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <Heart className="w-16 h-16 mx-auto mb-6 text-rose-500 fill-current animate-pulse" />

          {/* Replace these names with your actual names */}
          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-gray-900 mb-4">
            [Your Name] & [Partner's Name]
          </h1>

          <p className="text-2xl sm:text-3xl text-gray-700 mb-8">
            are getting married!
          </p>

          {/* Wedding Date and Location - Update these */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">June 15, 2026</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-400" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">Venue Name, City</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rsvp"
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-lg"
            >
              RSVP Now
            </Link>
            <Link
              href="/details"
              className="bg-white hover:bg-gray-50 text-rose-600 px-8 py-3 rounded-full text-lg font-semibold border-2 border-rose-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
            Join Us for Our Special Day
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            We're thrilled to invite you to celebrate our wedding with us.
            Your presence would mean the world to us as we begin this new chapter together.
          </p>
          <p className="text-lg text-gray-600">
            Please take a moment to RSVP and let us know if you can join us.
            We can't wait to celebrate with you!
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Our Story Card */}
            <Link
              href="/story"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Our Story</h3>
              <p className="text-gray-600">
                Learn about our journey together
              </p>
            </Link>

            {/* Event Details Card */}
            <Link
              href="/details"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                <MapPin className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Event Details</h3>
              <p className="text-gray-600">
                Venue, schedule, and accommodation info
              </p>
            </Link>

            {/* Photos Card */}
            <Link
              href="/photos"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                <Calendar className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">Share Photos</h3>
              <p className="text-gray-600">
                Upload and view wedding photos
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
