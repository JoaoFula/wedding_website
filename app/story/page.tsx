'use client'

import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/components/LanguageProvider'

export default function StoryPage() {
  const { t } = useTranslation()

  const timelineItems = [
    { year: '2021', titleKey: 'story.timeline.0.title', descKey: 'story.timeline.0.description', image: '/photos/first-met.jpg' },
    { year: '2021', titleKey: 'story.timeline.1.title', descKey: 'story.timeline.1.description', image: '/photos/first-date.jpg' },
    { year: '2021', titleKey: 'story.timeline.2.title', descKey: 'story.timeline.2.description', image: '/photos/moved-in.jpg' },
    { year: '2023', titleKey: 'story.timeline.3.title', descKey: 'story.timeline.3.description' },
    { year: '2024', titleKey: 'story.timeline.4.title', descKey: 'story.timeline.4.description' },
    { year: '2024', titleKey: 'story.timeline.5.title', descKey: 'story.timeline.5.description' },
    { year: '2025', titleKey: 'story.timeline.6.title', descKey: 'story.timeline.6.description' },
    { year: '2027', titleKey: 'story.timeline.7.title', descKey: 'story.timeline.7.description' },
  ]

  return (
    <div className="min-h-screen">
      <div className="text-center py-16 px-4">
        <Heart className="w-16 h-16 mx-auto mb-6 text-rose-500 fill-current" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          {t('story.heading')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('story.subtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-rose-300 hidden md:block" />
          {timelineItems.map((item, index) => (
            <div key={index} className="mb-12 relative">
              <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 mb-4 md:mb-0 md:-translate-y-2">
                <div className="inline-block bg-rose-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                  {item.year}
                </div>
              </div>
              <div className={`md:w-[calc(50%-3rem)] ${index % 2 === 0 ? 'md:ml-0' : 'md:ml-auto'} mt-12 md:mt-0`}>
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow content-card">
                  {item.image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <Image src={item.image} alt={t(item.titleKey)} width={400} height={300} className="w-full h-64 object-cover" />
                    </div>
                  )}
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">{t(item.titleKey)}</h3>
                  <p className="text-gray-600 leading-relaxed">{t(item.descKey)}</p>
                </div>
              </div>
              <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 translate-y-12">
                <div className="w-4 h-4 bg-rose-600 rounded-full border-4 border-white shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-xl shadow-lg p-8 content-card">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">{t('story.closing.heading')}</h2>
          <p className="text-xl text-gray-600 mb-8">{t('story.closing.body')}</p>
          <Heart className="w-12 h-12 mx-auto text-rose-500 fill-current" />
        </div>
      </div>
    </div>
  )
}
