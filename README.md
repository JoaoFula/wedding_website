# 💒 Wedding Website

A beautiful, modern wedding website built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- **Beautiful Landing Page** - Elegant hero section with wedding details
- **RSVP System** - Guests can RSVP with dietary restrictions, song suggestions, and accommodation needs
- **Admin Dashboard** - Secure login to view and manage all RSVPs
- **Our Story Page** - Timeline showcasing your journey together
- **Event Details** - Venue info, schedule, dress code, and accommodation recommendations
- **Photo Sharing** - Integration with Google Drive for photo uploads
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Type-Safe** - Built with TypeScript for reliability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- A Google account for photo sharing

### 1. Clone and Install

```bash
cd wedding_website
npm install
```

### 2. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize (takes ~2 minutes)
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the contents of `supabase-schema.sql` from this project
5. Paste and run it in the SQL Editor
6. Go to **Settings → API** to get your credentials

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Create Admin User

1. In your Supabase dashboard, go to **Authentication → Users**
2. Click **Add User**
3. Create a user with your email and password
4. Use these credentials to log in to `/admin` on your website

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website!

## 📝 Customization Guide

### Update Your Information

The website is fully commented to guide you. Here's what to customize:

#### 1. Home Page (`app/page.tsx`)
- Line 33: Replace with your names
- Line 44: Update wedding date
- Line 49: Update venue location
- Line 22: Add your hero photo (optional)

#### 2. Our Story (`app/story/page.tsx`)
- Lines 20-63: Customize timeline items with your story
- Add photos to `/public/photos/` folder and uncomment image lines

#### 3. Event Details (`app/details/page.tsx`)
- Lines 36-42: Update venue information
- Lines 51: Update Google Maps link with your venue address
- Lines 93-135: Update schedule/timeline
- Lines 145-155: Update dress code
- Lines 176-224: Add accommodation options
- Lines 237-289: Update FAQs

#### 4. Photos Page (`app/photos/page.tsx`)
- Line 21: Update with your Google Drive folder link
- Line 92: Update with your Google Photos album link (optional)

#### 5. Add Your Photos

1. Create a `/public/photos/` folder
2. Add your photos there
3. Reference them in the pages (e.g., `/photos/hero.jpg`)

### Customize Colors and Fonts

The website uses:
- **Colors**: Rose/Pink theme (Tailwind `rose-*` classes)
- **Fonts**:
  - Playfair Display (elegant serif for headings)
  - Inter (clean sans-serif for body text)

To change colors, search for `rose-` in the files and replace with another Tailwind color.

## 🌐 Deployment

### Deploy to Vercel (Recommended - FREE)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial wedding website"
   git push origin main
   ```

2. Go to [https://vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your website will be live at `https://your-project.vercel.app`!

### Custom Domain

1. In Vercel, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `ourwedding.com`)
4. Follow DNS setup instructions

## 📸 Setting Up Photo Sharing

### Google Drive Option

1. Create a new Google Drive folder
2. Right-click → Share
3. Change to "Anyone with the link"
4. Set permissions to "Editor" (allows uploads)
5. Copy the folder link
6. Update line 21 in `app/photos/page.tsx`

### Google Photos Option (Alternative)

1. Go to [Google Photos](https://photos.google.com)
2. Create a new shared album
3. Get the sharing link
4. Update line 92 in `app/photos/page.tsx`

## 🔧 Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Building
npm run build        # Build for production
npm run start        # Run production build locally

# Code Quality
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
wedding_website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── rsvp/              # RSVP form page
│   ├── admin/             # Admin dashboard (protected)
│   ├── story/             # Our Story timeline
│   ├── details/           # Event details
│   ├── photos/            # Photo sharing page
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── Navigation.tsx     # Main navigation bar
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client (browser)
│   └── supabase-server.ts # Supabase client (server)
├── types/                 # TypeScript types
│   └── database.ts        # Database type definitions
├── public/                # Static assets
├── .env.local            # Environment variables (don't commit!)
└── supabase-schema.sql   # Database schema
```

## 🔒 Security Notes

- The `.env.local` file is in `.gitignore` - never commit it
- Supabase Row Level Security (RLS) is enabled:
  - Anyone can submit RSVPs (insert)
  - Only authenticated users can read all RSVPs
- The anon key is safe to expose (it's for client-side use)

## 🆘 Troubleshooting

### Build fails with "Invalid supabaseUrl"
- Make sure `.env.local` has valid Supabase credentials
- Check that the values don't have quotes or extra spaces

### RSVP form doesn't submit
- Check browser console for errors
- Verify Supabase database is set up correctly
- Check that RLS policies were created

### Can't log in to admin panel
- Make sure you created a user in Supabase Auth
- Check that the email/password are correct
- Clear browser cache and try again

### Photos don't show up
- Make sure photos are in `/public` folder
- Reference them without `/public` (e.g., `/photos/image.jpg`)
- Check that file extensions match (case-sensitive)

## 💡 Tips

- Test the RSVP form yourself before sharing
- Send test RSVPs to make sure email/data looks good
- Check the website on mobile devices
- Share the `/rsvp` link directly with guests
- Keep the admin password secure
- Back up your Supabase data periodically

## 🎨 Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Database and authentication
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Vercel](https://vercel.com/) - Hosting (free)

## 📄 License

This is your wedding website - customize it however you like!

## 🤝 Support

If you run into issues:
1. Check the troubleshooting section above
2. Review the inline code comments
3. Check Supabase and Vercel documentation

---

**Congratulations on your wedding!** 🎉💒✨
