'use client'

import { Camera, Upload, Lock } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/components/LanguageProvider'

interface Photo {
  id: string
  filename: string
  uploadedBy: string
  uploadedAt: string
  caption?: string
}

export default function PhotosPage() {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('wedding_auth_token')
    if (token) {
      setIsLoggedIn(true)
      fetchPhotos(token)
    }
  }, [])

  const fetchPhotos = async (token: string) => {
    try {
      const response = await fetch('/api/photos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch {
      // photos remain empty
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const token = localStorage.getItem('wedding_auth_token')
    if (!token) return

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        setUploadSuccess(true)
        fetchPhotos(token)
      } else {
        const data = await response.json()
        setUploadError(data.error || t('photos.upload.error.generic'))
      }
    } catch {
      setUploadError(t('photos.upload.error.generic'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('photos.login.heading')}</h2>
          <p className="text-gray-600 mb-6">{t('photos.login.body')}</p>
          <a
            href="/login?redirect=/photos"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {t('photos.login.button')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="text-center py-16 px-4">
        <Camera className="w-16 h-16 mx-auto mb-6 text-rose-500" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          {t('photos.heading')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('photos.subtitle')}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-rose-500" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">{t('photos.upload.heading')}</h2>
          <p className="text-gray-600 mb-6">{t('photos.upload.body')}</p>

          {uploadSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {t('photos.upload.success')}
            </div>
          )}
          {uploadError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {uploadError}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold cursor-pointer transition-colors ${
              uploading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Upload className="w-5 h-5" />
            {uploading ? t('photos.upload.uploading') : t('photos.upload.button')}
          </label>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">{t('photos.empty.heading')}</h3>
            <p className="text-gray-400">{t('photos.empty.body')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square relative">
                  <Image
                    src={`/api/photos/${photo.id}`}
                    alt={photo.caption || t('photos.photo.alt')}
                    fill
                    className="object-cover"
                  />
                </div>
                {photo.caption && (
                  <div className="p-3">
                    <p className="text-sm text-gray-600">{photo.caption}</p>
                    <p className="text-xs text-gray-400 mt-1">{photo.uploadedBy}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
