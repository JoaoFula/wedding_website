/**
 * Details Page
 *
 * Wedding event details, schedule, venue information, and accommodation
 * Features:
 * - Venue information with map link
 * - Event schedule/timeline
 * - Dress code
 * - Accommodation recommendations
 * - FAQs
 *
 * Instructions:
 * - Update all placeholder text with your actual details
 * - Update map link with your venue address
 */

import { MapPin, Clock, Hotel, Info, Navigation } from 'lucide-react'

export default function DetailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          Event Details
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about our special day
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        {/* Venue Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">Venue</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                [Venue Name]
              </h3>
              <p className="text-gray-600 mb-4">
                [Street Address]<br />
                [City, State ZIP]<br />
                [Country]
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=VENUE+ADDRESS+HERE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Parking Information</h4>
                <p className="text-gray-600">
                  Add parking details here - for example, free parking available on-site or street parking nearby
                </p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-64 md:h-auto flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Replace this with an embedded map<br />
                  or image of the venue
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">Schedule</h2>
          </div>

          <div className="space-y-6">
            {/* Ceremony */}
            <div className="flex gap-4 border-l-4 border-rose-500 pl-4">
              <div className="flex-shrink-0 w-24">
                <p className="font-bold text-rose-600">3:00 PM</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Ceremony</h3>
                <p className="text-gray-600">
                  The wedding ceremony begins. Please arrive 15 minutes early to find your seat.
                </p>
              </div>
            </div>

            {/* Cocktail Hour */}
            <div className="flex gap-4 border-l-4 border-rose-400 pl-4">
              <div className="flex-shrink-0 w-24">
                <p className="font-bold text-rose-600">4:00 PM</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Cocktail Hour</h3>
                <p className="text-gray-600">
                  Enjoy drinks and appetizers while the wedding party takes photos.
                </p>
              </div>
            </div>

            {/* Reception */}
            <div className="flex gap-4 border-l-4 border-rose-400 pl-4">
              <div className="flex-shrink-0 w-24">
                <p className="font-bold text-rose-600">5:00 PM</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Reception</h3>
                <p className="text-gray-600">
                  Dinner, dancing, and celebration! Join us for an unforgettable evening.
                </p>
              </div>
            </div>

            {/* End */}
            <div className="flex gap-4 border-l-4 border-rose-300 pl-4">
              <div className="flex-shrink-0 w-24">
                <p className="font-bold text-rose-600">10:00 PM</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Last Dance</h3>
                <p className="text-gray-600">
                  Event concludes. Safe travels home!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dress Code Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">Dress Code</h2>
          </div>

          <p className="text-lg text-gray-700 mb-4">
            <strong>Semi-Formal / Cocktail Attire</strong>
          </p>
          <p className="text-gray-600 mb-2">
            We want you to feel comfortable! Here are some suggestions:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
            <li>For guests: Cocktail dresses, nice slacks with dress shirts, suits</li>
            <li>Please avoid: Jeans, sneakers, overly casual attire</li>
            <li>Colors to avoid: White, ivory, or anything that might look bridal</li>
          </ul>

          <div className="mt-4 p-4 bg-rose-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Wedding Colors:</strong> Rose, Pink, and Purple
              <br />
              <span className="text-sm text-gray-600">
                (Feel free to incorporate these colors, but it's not required!)
              </span>
            </p>
          </div>
        </section>

        {/* Accommodation Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">Accommodation</h2>
          </div>

          <p className="text-gray-600 mb-6">
            We've reserved room blocks at the following hotels. Please book early as rooms may fill up!
          </p>

          <div className="space-y-6">
            {/* Hotel 1 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                [Hotel Name 1]
              </h3>
              <p className="text-gray-600 mb-3">
                [Hotel Address]<br />
                [Distance from venue]
              </p>
              <div className="mb-3">
                <p className="text-sm text-gray-700">
                  <strong>Room Rate:</strong> $XXX per night
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Booking Code:</strong> [WEDDING_CODE]
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Book By:</strong> [Date]
                </p>
              </div>
              <a
                href="tel:+1234567890"
                className="text-rose-600 hover:underline text-sm"
              >
                Call to Book: (123) 456-7890
              </a>
            </div>

            {/* Hotel 2 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                [Hotel Name 2]
              </h3>
              <p className="text-gray-600 mb-3">
                [Hotel Address]<br />
                [Distance from venue]
              </p>
              <div className="mb-3">
                <p className="text-sm text-gray-700">
                  <strong>Room Rate:</strong> $XXX per night
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Booking Code:</strong> [WEDDING_CODE]
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Book By:</strong> [Date]
                </p>
              </div>
              <a
                href="tel:+1234567890"
                className="text-rose-600 hover:underline text-sm"
              >
                Call to Book: (123) 456-7890
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Need help with accommodation?</strong> Please let us know in your RSVP,
              and we'll be happy to assist you with booking or recommendations!
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I bring a plus-one?
              </h3>
              <p className="text-gray-600">
                Due to venue capacity, we can only accommodate guests formally invited. If you received
                a plus-one, it will be indicated on your invitation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are children welcome?
              </h3>
              <p className="text-gray-600">
                [Update this based on your preference - e.g., "We love your little ones, but this is
                an adults-only celebration" or "Children are welcome!"]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I have dietary restrictions?
              </h3>
              <p className="text-gray-600">
                Please let us know about any dietary restrictions or allergies in your RSVP, and we'll
                make sure to accommodate you!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Will there be transportation?
              </h3>
              <p className="text-gray-600">
                [Add details about shuttle service if you're providing one, or ride-share recommendations]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's the weather like?
              </h3>
              <p className="text-gray-600">
                [Add seasonal weather information and recommendations - e.g., "June in [location] is
                typically warm and sunny, around 75-80°F. The ceremony will be outdoors, so bring
                sunscreen!"]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a gift registry?
              </h3>
              <p className="text-gray-600">
                Your presence is the greatest gift! However, if you'd like to give a gift, we have
                a registry at [Store Name] or you can contribute to our [honeymoon fund/house fund].
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-rose-50 rounded-xl p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Have More Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Feel free to reach out to us directly!
          </p>
          <a
            href="mailto:your.email@example.com"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  )
}
