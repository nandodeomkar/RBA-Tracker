# Deploying — RBA Board Vote Tracker

This is a **static site** (no backend, no build step), so "deploying" is just putting
the files on a CDN. This guide uses **GitHub + Vercel** (both free) and the free
`*.vercel.app` address. **Total cost: $0. Time: ~15–20 min.**

## 0. Free accounts you'll need
- GitHub — <https://github.com/signup>
- Vercel — <https://vercel.com/signup> (choose **Continue with GitHub**)

## 1. Put the project on GitHub
A `.gitignore` is included, so only the site files get committed.

**Option A — command line (if you have git):**
```bash
cd "path/to/Investment Dashboard"
git init
git add .
git commit -m "RBA Board Vote Tracker — initial site"
git branch -M main
# Create an empty repo named  rba-vote-tracker  on github.com first, then:
git remote add origin https://github.com/<you>/rba-vote-tracker.git
git push -u origin main
```

**Option B — no command line:** install **GitHub Desktop** (<https://desktop.github.com>)
→ *File ▸ Add local repository* → pick this folder → **Publish repository** (name it
`rba-vote-tracker`, keep it public).

## 2. Deploy on Vercel
1. Go to <https://vercel.com/new> and **Import** your `rba-vote-tracker` repo.
2. **Project Name:** `rba-vote-tracker` — this makes your URL
   `https://rba-vote-tracker.vercel.app`, which already matches the social tags in
   `index.html`. (Different name? See step 4.)
3. **Framework Preset:** *Other*. Leave **Build Command**, **Output Directory**, and
   **Install Command** empty — Vercel just serves the repo root.
4. Click **Deploy**. ~30 seconds later you're live and global, with HTTPS.

## 3. Turn on Web Analytics (free, cookieless)
The tracking snippet is already in `index.html`; you just enable the product:
- Vercel dashboard → your project → **Analytics** tab → **Enable**.
- Numbers show up after the next visit. No cookie banner needed — it's anonymous and
  privacy-friendly.

## 4. Only if you named the project something other than `rba-vote-tracker`
The Open Graph / Twitter / canonical URLs in `index.html` point at
`https://rba-vote-tracker.vercel.app`. If your URL differs, find-and-replace
`rba-vote-tracker.vercel.app` with your real subdomain in `index.html`, then commit and
push — Vercel redeploys automatically.

## 5. Verify the launch
- Open your `*.vercel.app` URL — page, chart, table, filters, and the light/dark toggle
  should all work.
- Test the link preview: paste the URL into Slack / iMessage / X, or use
  <https://www.opengraph.xyz> — you should see the title, description, and the
  `og-image.png` card.

## Updating after each RBA meeting (the ongoing workflow — no tools needed)
1. On github.com, open **`data.js`** → click the ✏️ **Edit** button.
2. Add one record to the end of the `decisions` array (and a `rateHistory` point **only
   if the cash rate changed**). The exact template + the honesty rules are in
   `README.md`.
3. Update `meta.lastUpdated` (and `meta.nextMeetingDate`).
4. Click **Commit changes**. Vercel rebuilds and publishes worldwide in ~30 seconds.

> Tip: set a calendar reminder for RBA decision days (≈8/year, 2:30 pm AEST) so the
> page is never stale.

## Optional, later
- **Custom domain:** Vercel → project → **Settings ▸ Domains** → add your domain and
  follow the DNS steps (Vercel issues the SSL automatically). Then redo step 4 with the
  new domain. Note: `.au` / `.com.au` domains require ABN eligibility and a paid
  registrar.
- **Different host:** this same folder deploys as-is to **Cloudflare Pages** or
  **Netlify** (also free) if you ever want to switch.

## Troubleshooting
- **Blank page / no chart:** confirm `vendor/echarts.min.js`, `core.js`, `app.js`, and
  `data.js` were all pushed (Vercel → Deployments → Source). Paths are relative, so the
  whole folder must sit at the repo root.
- **No link-preview image:** make sure `og-image.png` is at the site root and the
  `og:image` URL matches your real domain (step 4).
- **Analytics empty:** confirm you clicked **Enable** (step 3) and you're viewing the
  deployed site, not `localhost`.
