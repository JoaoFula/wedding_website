/**
 * Our Story Page
 *
 * Timeline showing the couple's journey together
 * Features:
 * - Beautiful timeline layout
 * - Placeholder for photos at each milestone
 * - Customizable text for each milestone
 *
 * Instructions:
 * - Replace the timeline items with your actual story
 * - Add photos to /public folder and update image paths
 */

import { Heart } from 'lucide-react'
import Image from 'next/image'

export default function StoryPage() {
  // Timeline items - customize these with your story
  const timelineItems = [
    {
      year: '2020',
      title: 'First Met',
      description:
        'We met at [location/event]. It was love at first sight (or maybe second sight!). Describe how you met and what made that moment special.',
      // Add your photo here: image: '/photos/first-met.jpg',
    },
    {
      year: '2021',
      title: 'First Date',
      description:
        'Our first official date was at [restaurant/location]. We talked for hours and knew this was something special. Share your favorite memory from the early days.',
      // image: '/photos/first-date.jpg',
    },
    {
      year: '2022',
      title: 'Made It Official',
      description:
        'After [time period] of dating, we officially became a couple. Describe what made you decide to commit to each other.',
      // image: '/photos/official.jpg',
    },
    {
      year: '2023',
      title: 'Moved In Together',
      description:
        'We found our first home together in [location]. Living together has been an amazing adventure filled with [shared activities/memories].',
      // image: '/photos/moved-in.jpg',
    },
    {
      year: '2024',
      title: 'The Proposal',
      description:
        '[Person] proposed at [location] on [date]. It was absolutely perfect! Share the proposal story and how it made you feel.',
      // image: '/photos/proposal.jpg',
    },
    {
      year: '2026',
      title: 'Our Wedding Day',
      description:
        "And now we're here! We're so excited to celebrate this special day with all of you. Thank you for being part of our journey.",
      // image: '/photos/engagement.jpg',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <Heart className="w-16 h-16 mx-auto mb-6 text-rose-500 fill-current" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          Our Story
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          From the moment we met to the day we say "I do" - here's our journey together
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-rose-300 hidden md:block" />

          {/* Timeline Items */}
          {timelineItems.map((item, index) => (
            <div key={index} className="mb-12 relative">
              {/* Year Badge - Center on desktop */}
              <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 mb-4 md:mb-0 md:-translate-y-2">
                <div className="inline-block bg-rose-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                  {item.year}
                </div>
              </div>

              {/* Content Card - Alternating sides on desktop */}
              <div
                className={`md:w-[calc(50%-3rem)] ${
                  index % 2 === 0 ? 'md:ml-0' : 'md:ml-auto'
                } mt-12 md:mt-0`}
              >
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  {/* Photo placeholder - uncomment when you add photos */}
                  {/* {item.image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )} */}

                  {/* Photo placeholder visual */}
                  <div className="mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-rose-200 to-pink-200 h-64 flex items-center justify-center">
                    <div className="text-center text-rose-700">
                      <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Add your photo here</p>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Dot on timeline - hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 translate-y-12">
                <div className="w-4 h-4 bg-rose-600 rounded-full border-4 border-white shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Message */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
            And the adventure continues...
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We can't wait to write the next chapter with all of you by our side.
          </p>
          <Heart className="w-12 h-12 mx-auto text-rose-500 fill-current" />
        </div>
      </div>
    </div>
  )
}
