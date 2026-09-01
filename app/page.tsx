'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Heart } from 'lucide-react'
import { useTranslation } from '@/components/LanguageProvider'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="relative">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-8 py-12 rounded-2xl content-card max-w-2xl mx-auto">
          <Image
            src="/flower.jpg"
            alt=""
            width={128}
            height={128}
            className="w-22 h-22 mx-auto mb-6 rounded-full object-cover animate-pulse"
          />
          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-gray-900 mb-4">
            João & Zuza
          </h1>
          <p className="text-2xl sm:text-3xl text-gray-700 mb-8">
            {t('home.title')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">July 3, 2027</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-400" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">Lesna 19, Lesna</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rsvp"
              className="bg-blue-300 hover:bg-blue-400 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-lg"
            >
              {t('home.cta.rsvp')}
            </Link>
            <Link
              href="/details"
              className="bg-white hover:bg-gray-60 text-blue-400 px-8 py-3 rounded-full text-lg font-semibold border-2 border-blue-300 transition-colors"
            >
              {t('home.cta.details')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
            {t('home.welcome.heading')}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {t('home.welcome.body')}
          </p>
          <p className="text-lg text-gray-600">
            {t('home.welcome.body2')}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/story" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group content-card">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                <Heart className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{t('home.card.story.heading')}</h3>
              <p className="text-gray-600">{t('home.card.story.body')}</p>
            </Link>
            <Link href="/details" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group content-card">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                <MapPin className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{t('home.card.details.heading')}</h3>
              <p className="text-gray-600">{t('home.card.details.body')}</p>
            </Link>
            <Link href="/photos" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group content-card">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{t('home.card.photos.heading')}</h3>
              <p className="text-gray-600">{t('home.card.photos.body')}</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
