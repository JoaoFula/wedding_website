'use client'

import { MapPin, Clock, Hotel, Info, Navigation, Music } from 'lucide-react'
import { useTranslation } from '@/components/LanguageProvider'

export default function DetailsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="text-center py-16 px-4">
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          {t('details.heading')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('details.subtitle')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        {/* Venue */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">{t('details.venue.heading')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('details.venue.name')}</h3>
              <p className="text-gray-600 mb-4">
                Lesná 19<br />671 02, Sumna<br />Czech Republic
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lesná+19,+671+02+Šumná,+Czech+Republic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Navigation className="w-4 h-4" />
                {t('details.venue.directions')}
              </a>
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t('details.venue.parking.heading')}</h4>
                <p className="text-gray-600">{t('details.venue.parking.body')}</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden h-64 md:h-auto min-h-64">
              <iframe
                title="Venue location"
                src="https://maps.google.com/maps?q=Lesná+19,+671+02+Šumná,+Czech+Republic&z=15&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">{t('details.schedule.heading')}</h2>
          </div>
          <div className="space-y-6">
            {[
              { timeKey: 'details.schedule.ceremony.time', titleKey: 'details.schedule.ceremony.title', bodyKey: 'details.schedule.ceremony.body', color: 'border-rose-500' },
              { timeKey: 'details.schedule.cocktail.time', titleKey: 'details.schedule.cocktail.title', bodyKey: 'details.schedule.cocktail.body', color: 'border-rose-400' },
              { timeKey: 'details.schedule.reception.time', titleKey: 'details.schedule.reception.title', bodyKey: 'details.schedule.reception.body', color: 'border-rose-400' },
              { timeKey: 'details.schedule.lastdance.time', titleKey: 'details.schedule.lastdance.title', bodyKey: 'details.schedule.lastdance.body', color: 'border-rose-300' },
            ].map(item => (
              <div key={item.timeKey} className={`flex gap-4 border-l-4 ${item.color} pl-4`}>
                <div className="flex-shrink-0 w-24">
                  <p className="font-bold text-rose-600">{t(item.timeKey)}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{t(item.titleKey)}</h3>
                  <p className="text-gray-600">{t(item.bodyKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dress Code */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">{t('details.dresscode.heading')}</h2>
          </div>
          <p className="text-lg text-gray-700 mb-4"><strong>{t('details.dresscode.type')}</strong></p>
          <p className="text-gray-600 mb-2">{t('details.dresscode.intro')}</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
            <li>{t('details.dresscode.item1')}</li>
            <li>{t('details.dresscode.item2')}</li>
            <li>{t('details.dresscode.item3')}</li>
          </ul>
          <div className="mt-4 p-4 bg-rose-50 rounded-lg">
            <p className="text-gray-700">
              <strong>{t('details.dresscode.colors.label')}</strong> {t('details.dresscode.colors.value')}
              <br />
              <span className="text-sm text-gray-600">{t('details.dresscode.colors.note')}</span>
            </p>
          </div>
        </section>

        {/* Accommodation */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">{t('details.accommodation.heading')}</h2>
          </div>
          <p className="text-gray-600 mb-6">{t('details.accommodation.intro')}</p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700"><strong>{t('details.accommodation.help')}</strong></p>
          </div>
        </section>

        {/* Playlist */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">{t('details.playlist.heading')}</h2>
          </div>
          <p className="text-gray-600 mb-6">{t('details.playlist.subtitle')}</p>
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="Wedding Playlist"
              src="https://open.spotify.com/embed/playlist/1q7gd1czHuYwJ3RSd8fklx"
              width="100%"
              height="450"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="border-0"
            />
          </div>
          <p className="text-gray-600 mt-8 mb-6">{t('details.playlist.dance')}</p>
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="Wedding Dance Playlist"
              src="https://www.youtube-nocookie.com/embed/videoseries?list=PLVyVMYnAezTg"
              width="100%"
              height="450"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              allowFullScreen
              className="border-0"
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">{t('details.faq.heading')}</h2>
          <div className="space-y-6">
            {[
              { qKey: 'details.faq.plusone.q', aKey: 'details.faq.plusone.a' },
              { qKey: 'details.faq.children.q', aKey: 'details.faq.children.a' },
              { qKey: 'details.faq.dietary.q', aKey: 'details.faq.dietary.a' },
              { qKey: 'details.faq.transport.q', aKey: 'details.faq.transport.a' },
              { qKey: 'details.faq.weather.q', aKey: 'details.faq.weather.a' },
              { qKey: 'details.faq.gifts.q', aKey: 'details.faq.gifts.a' },
            ].map(faq => (
              <div key={faq.qKey}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(faq.qKey)}</h3>
                <p className="text-gray-600">{t(faq.aKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-rose-50 rounded-xl p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">{t('details.contact.heading')}</h2>
          <p className="text-gray-600 mb-6">{t('details.contact.body')}</p>
          <a
            href="mailto:hsifula@gmail.com"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {t('details.contact.button')}
          </a>
        </section>
      </div>
    </div>
  )
}
