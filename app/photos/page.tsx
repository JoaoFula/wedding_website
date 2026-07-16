'use client'

import { Camera, Upload, Heart } from 'lucide-react'
import { useTranslation } from '@/components/LanguageProvider'

const GOOGLE_DRIVE_LINK = 'https://drive.google.com/drive/folders/13uinM1Cb8-Q9RZOI5jrPWf_YJuNdEuEw?usp=drive_link'
const GOOGLE_PHOTOS_LINK = 'https://photos.app.goo.gl/C4LK4Fb75xfg644X6'

export default function PhotosPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <div className="text-center py-16 px-4">
        <Camera className="w-16 h-16 mx-auto mb-6 text-rose-500" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          {t('photos.heading')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('photos.subtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        <section className="bg-white rounded-xl shadow-lg p-8 content-card">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">{t('photos.upload.heading')}</h2>
          </div>

          <p className="text-gray-600 mb-6">{t('photos.upload.intro')}</p>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('photos.upload.step1.heading')}</h3>
                <p className="text-gray-600 text-sm">{t('photos.upload.step1.body')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('photos.upload.step2.heading')}</h3>
                <p className="text-gray-600 text-sm">{t('photos.upload.step2.body')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('photos.upload.step3.heading')}</h3>
                <p className="text-gray-600 text-sm">{t('photos.upload.step3.body')}</p>
              </div>
            </div>
          </div>

          <a
            href={GOOGLE_DRIVE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            <Camera className="w-5 h-5" />
            {t('photos.upload.button')}
          </a>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">{t('photos.upload.note')}</p>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-lg p-8 content-card">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">{t('photos.alt.heading')}</h2>
          <p className="text-gray-600 mb-4">{t('photos.alt.body')}</p>
          <a
            href={GOOGLE_PHOTOS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-rose-600 px-6 py-3 rounded-lg font-semibold border-2 border-rose-600 transition-colors"
          >
            <Camera className="w-5 h-5" />
            {t('photos.alt.button')}
          </a>
        </section>

        <section className="bg-white rounded-xl shadow-lg p-8 content-card">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">{t('photos.guidelines.heading')}</h2>
          <div className="space-y-3 text-gray-600">
            {(['1', '2', '3', '4'] as const).map(n => (
              <div key={n} className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <p>{t(`photos.guidelines.${n}`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl p-8 text-center content-card--rose">
          <Heart className="w-12 h-12 mx-auto mb-4 text-rose-500 fill-current" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">{t('photos.thanks.heading')}</h2>
          <p className="text-gray-600">{t('photos.thanks.body')}</p>
        </section>
      </div>
    </div>
  )
}
