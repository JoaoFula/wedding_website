import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"
import { LanguageProvider } from "@/components/LanguageProvider"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Our Wedding - Join Us for Our Special Day",
  description: "You're invited to celebrate our wedding. RSVP, view details, and share in our joy.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
              <p>Made with ❤️ for our special day</p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  )
}
