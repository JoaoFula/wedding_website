/**
 * Photos Page
 *
 * Integration with Google Drive for photo uploads
 * Features:
 * - Instructions for guests to upload photos
 * - Link to Google Drive folder
 * - Embedded photo viewer (optional)
 *
 * Instructions:
 * 1. Create a Google Drive folder for your wedding photos
 * 2. Set sharing permissions to "Anyone with the link can upload"
 * 3. Copy the folder link and update the GOOGLE_DRIVE_LINK below
 */

import { Camera, Upload, Heart } from 'lucide-react'

export default function PhotosPage() {
  // TODO: Replace this with your actual Google Drive folder link
  const GOOGLE_DRIVE_LINK = 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID'

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <Camera className="w-16 h-16 mx-auto mb-6 text-rose-500" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
          Wedding Photos
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Share your favorite moments from our special day
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* Upload Instructions */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-rose-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">Upload Your Photos</h2>
          </div>

          <p className="text-gray-600 mb-6">
            We'd love to see the wedding through your eyes! Please upload any photos or videos
            you took during the celebration to our shared Google Drive folder.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Click the button below</h3>
                <p className="text-gray-600 text-sm">
                  This will open our shared Google Drive folder
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Upload your photos</h3>
                <p className="text-gray-600 text-sm">
                  Click "New" → "File upload" or simply drag and drop your photos
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">That's it!</h3>
                <p className="text-gray-600 text-sm">
                  We'll be able to see all the wonderful photos you share
                </p>
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
            Upload to Google Drive
          </a>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> You may need to sign in to your Google account to upload photos.
              Don't worry - we can't see your personal information, only the photos you upload to our folder!
            </p>
          </div>
        </section>

        {/* Alternative: Google Photos */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Alternative: Google Photos
          </h2>

          <p className="text-gray-600 mb-4">
            Prefer Google Photos? We also have a shared album there!
          </p>

          <a
            href="https://photos.app.goo.gl/YOUR_ALBUM_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-rose-600 px-6 py-3 rounded-lg font-semibold border-2 border-rose-600 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Open Google Photos Album
          </a>

          <p className="text-sm text-gray-500 mt-4">
            Update the link above with your actual Google Photos shared album link
          </p>
        </section>

        {/* Photo Guidelines */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Photo Guidelines
          </h2>

          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-2">
              <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <p>Upload as many photos as you'd like - we want to see them all!</p>
            </div>
            <div className="flex items-start gap-2">
              <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <p>Videos are welcome too! Share those candid moments and speeches.</p>
            </div>
            <div className="flex items-start gap-2">
              <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <p>Original quality is preferred - don't worry about file size!</p>
            </div>
            <div className="flex items-start gap-2">
              <Heart className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <p>Please upload within a week or two while the memories are fresh!</p>
            </div>
          </div>
        </section>

        {/* Thank You Message */}
        <section className="bg-rose-50 rounded-xl p-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-rose-500 fill-current" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">
            Thank You for Sharing!
          </h2>
          <p className="text-gray-600">
            We can't wait to relive all the special moments through your photos.
            Your memories will help make our wedding album complete!
          </p>
        </section>

        {/* Setup Instructions for Couple */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            📝 Setup Instructions (for you):
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              Go to{' '}
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 hover:underline"
              >
                Google Drive
              </a>
            </li>
            <li>Create a new folder for wedding photos</li>
            <li>Right-click the folder → Share → Change to "Anyone with the link"</li>
            <li>Set permissions to "Editor" so guests can upload</li>
            <li>Copy the folder link and replace GOOGLE_DRIVE_LINK in this file (line 21)</li>
            <li>
              Optional: Create a{' '}
              <a
                href="https://photos.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 hover:underline"
              >
                Google Photos
              </a>{' '}
              shared album as an alternative
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}
