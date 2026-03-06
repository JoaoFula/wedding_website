# 🚀 Wedding Website Setup Guide

Follow these steps to get your wedding website up and running!

## Step 1: Set Up Supabase Database (10 minutes)

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub (or create an account)
4. Create a new organization if prompted
5. Click "New Project" and fill in:
   - **Name**: `wedding-website` (or any name you like)
   - **Database Password**: Choose a strong password (save it somewhere!)
   - **Region**: Choose the closest to your location
6. Click "Create new project"
7. Wait ~2 minutes for the database to initialize ☕

### Run the Database Schema

1. In your Supabase dashboard, find **SQL Editor** in the left sidebar
2. Click "New Query"
3. Open the file `supabase-schema.sql` from your project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click "Run" (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

### Get Your API Credentials

1. In Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Find these two values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string of characters)
3. Keep this tab open - you'll need these in the next step!

## Step 2: Configure Your Local Environment (2 minutes)

1. In your project folder, find the file `.env.local`
2. Open it in a text editor
3. Replace the placeholders:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-very-long-anon-key-here
   ```
4. Save the file

**Important:** Make sure there are no quotes around the values and no extra spaces!

## Step 3: Create Your Admin Account (2 minutes)

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click the "Add User" button
3. Choose "Create new user"
4. Fill in:
   - **Email**: Your email address
   - **Password**: Choose a secure password
   - **Auto Confirm User**: ✅ Check this box
5. Click "Create User"
6. Save these credentials - you'll use them to log in to `/admin`

## Step 4: Test Locally (2 minutes)

1. Open terminal in your project folder
2. Run:
   ```bash
   npm run dev
   ```
3. Open your browser to [http://localhost:3000](http://localhost:3000)
4. You should see your wedding website! 🎉

### Test the RSVP Form

1. Go to [http://localhost:3000/rsvp](http://localhost:3000/rsvp)
2. Fill out the form with test data
3. Submit it
4. You should see a success message

### Test the Admin Panel

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Log in with the email/password you created in Step 3
3. You should see your test RSVP!

## Step 5: Customize Your Website (30-60 minutes)

Now make it yours! See the [README.md](./README.md) for detailed customization instructions.

### Quick Customization Checklist

- [ ] Update your names in `app/page.tsx` (line 33)
- [ ] Update wedding date in `app/page.tsx` (line 44)
- [ ] Update venue location in `app/page.tsx` (line 49)
- [ ] Customize your story in `app/story/page.tsx`
- [ ] Update event details in `app/details/page.tsx`
- [ ] Set up Google Drive link in `app/photos/page.tsx` (line 21)
- [ ] Add your photos to `/public/photos/` folder

## Step 6: Deploy to Vercel (10 minutes)

### Push to GitHub

1. If you haven't already, initialize git:
   ```bash
   git init
   git add .
   git commit -m "Initial wedding website setup"
   ```

2. Create a new repository on [GitHub](https://github.com/new)
   - Name it `wedding-website` or similar
   - Don't initialize with README (you already have one!)

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git branch -M main
   git push -u origin main
   ```

### Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up" and sign in with GitHub
3. Click "Add New..." → "Project"
4. Find your `wedding-website` repository and click "Import"
5. Configure your project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as is)
6. Click "Environment Variables" and add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
     Value: (paste your Supabase URL)
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     Value: (paste your Supabase anon key)
7. Click "Deploy"
8. Wait 2-3 minutes for deployment ☕
9. Click "Visit" to see your live website! 🎉

Your website is now live at `https://your-project.vercel.app`!

## Step 7: Set Up Photo Sharing (5 minutes)

### Option A: Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Click "New" → "New Folder"
3. Name it "Wedding Photos"
4. Right-click the folder → "Share"
5. Click "Change" next to "Restricted"
6. Select "Anyone with the link"
7. Change role from "Viewer" to "Editor"
8. Click "Copy link"
9. Update `app/photos/page.tsx` line 21 with this link
10. Commit and push your changes (Vercel auto-deploys!)

### Option B: Google Photos (Alternative)

1. Go to [Google Photos](https://photos.google.com)
2. Click "Sharing" → "Create shared album"
3. Name it "Wedding Photos"
4. Click "Share" → Get link
5. Update `app/photos/page.tsx` line 92 with this link

## Step 8: Add Custom Domain (Optional, 10 minutes)

1. Buy a domain from [Namecheap](https://namecheap.com), [Google Domains](https://domains.google), etc.
   - Examples: `ourwedding.com`, `smithwedding2026.com`
2. In Vercel, go to your project → Settings → Domains
3. Click "Add"
4. Enter your domain name
5. Follow the DNS configuration instructions
6. Wait 24-48 hours for DNS to propagate

## 🎉 You're Done!

Your wedding website is now live! Here's what you can do next:

### Share With Guests

Share the RSVP link directly:
```
https://your-website.com/rsvp
```

### Monitor RSVPs

Check your admin panel regularly:
```
https://your-website.com/admin
```

### Keep It Updated

- Push changes to GitHub (they auto-deploy to Vercel)
- Update details as they change
- Add more photos as you take them

## 🆘 Need Help?

1. Check the [README.md](./README.md) troubleshooting section
2. Review the inline code comments
3. Check [Supabase docs](https://supabase.com/docs)
4. Check [Vercel docs](https://vercel.com/docs)

---

**Congratulations!** Your wedding website is live! 💒✨
