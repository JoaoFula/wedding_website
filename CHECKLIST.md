# Wedding Website Setup Checklist

Use this checklist to track your progress setting up the website!

## ☐ Initial Setup (20 minutes)

- [ ] **Read SETUP.md** - Complete step-by-step guide
- [ ] **Create Supabase account** at https://supabase.com
- [ ] **Create new Supabase project**
- [ ] **Run database schema** (copy/paste supabase-schema.sql)
- [ ] **Copy Supabase credentials** to .env.local
- [ ] **Create admin user** in Supabase Auth
- [ ] **Test locally** - Run `npm run dev`
- [ ] **Test RSVP form** - Submit a test RSVP
- [ ] **Test admin login** - Log in to /admin

## ☐ Content Customization (1 hour)

### Home Page
- [ ] Update couple names (line 33 in app/page.tsx)
- [ ] Update wedding date (line 44)
- [ ] Update venue location (line 49)
- [ ] Optional: Add hero background photo

### Our Story Page
- [ ] Customize timeline items with your story
- [ ] Update years and titles
- [ ] Write descriptions for each milestone
- [ ] Optional: Add photos for each milestone

### Event Details Page
- [ ] Update venue name and address
- [ ] Update Google Maps link with venue address
- [ ] Update ceremony time
- [ ] Update reception schedule
- [ ] Update dress code information
- [ ] Add accommodation options (hotel names, addresses, booking codes)
- [ ] Update FAQs
- [ ] Update contact email

### RSVP Page
- [ ] Update contact email (line 333)
- [ ] Test form submission again after customization

### Photos Page
- [ ] Create Google Drive folder for photos
- [ ] Set folder permissions to "Anyone with link can edit"
- [ ] Copy folder link
- [ ] Update link in app/photos/page.tsx (line 21)
- [ ] Optional: Create Google Photos album and add link

## ☐ Visual Customization (Optional - 30 minutes)

- [ ] Create `/public/photos/` folder
- [ ] Add your engagement photos
- [ ] Add photos to story timeline
- [ ] Add hero image to home page
- [ ] Update favicon (replace app/favicon.ico)

## ☐ Testing (15 minutes)

- [ ] Test on desktop browser
- [ ] Test on mobile phone
- [ ] Test on tablet
- [ ] Test all navigation links work
- [ ] Test RSVP form validation
- [ ] Test RSVP form submission
- [ ] Test admin login
- [ ] Verify RSVP appears in admin panel
- [ ] Test Google Drive photo upload link

## ☐ Deployment (15 minutes)

- [ ] Create GitHub repository
- [ ] Push code to GitHub
  ```bash
  git init
  git add .
  git commit -m "Initial wedding website"
  git remote add origin YOUR_GITHUB_URL
  git push -u origin main
  ```
- [ ] Create Vercel account
- [ ] Import GitHub repository to Vercel
- [ ] Add environment variables in Vercel:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Deploy!
- [ ] Test live website
- [ ] Test RSVP on live site
- [ ] Test admin login on live site

## ☐ Optional Enhancements

- [ ] Purchase custom domain
- [ ] Configure custom domain in Vercel
- [ ] Update metadata (title, description) for better SEO
- [ ] Add wedding registry links to details page
- [ ] Add travel/transportation information
- [ ] Create printable QR code for RSVP link
- [ ] Set up Google Photos shared album

## ☐ Launch Preparation

- [ ] Double-check all information is correct
- [ ] Test RSVP from guest's perspective
- [ ] Make sure admin password is secure
- [ ] Save admin login credentials safely
- [ ] Create short URL for RSVP link (optional)
- [ ] Prepare announcement message with link

## ☐ Launch! 🎉

- [ ] Share RSVP link with guests via:
  - [ ] Email
  - [ ] Text message
  - [ ] Wedding invitation (printed QR code)
  - [ ] Social media
- [ ] Monitor admin dashboard for responses
- [ ] Respond to accommodation requests
- [ ] Start building the Spotify playlist with suggestions!

## ☐ Ongoing Maintenance

- [ ] Check admin panel weekly for new RSVPs
- [ ] Respond to guests' questions via email
- [ ] Update details if anything changes
- [ ] Monitor Google Drive for photo uploads
- [ ] Back up RSVP data periodically
- [ ] Send reminders to guests who haven't RSVP'd

---

## Quick Reference

**Local Development:**
```bash
npm run dev
```

**View Your Site Locally:**
http://localhost:3000

**Admin Panel:**
http://localhost:3000/admin (or https://your-site.com/admin when live)

**RSVP Link to Share:**
http://localhost:3000/rsvp (or https://your-site.com/rsvp when live)

**Need Help?**
- Check README.md for detailed documentation
- Check SETUP.md for step-by-step instructions
- Check PROJECT_SUMMARY.md for technical overview

---

**Estimated Total Time:** 2-3 hours to fully customize and deploy

**You've got this!** 💒✨
