# ronijbarahi.com

A static site. Vercel serves the files as they are in this repo. A small build script
(`scripts/build.js`, plain Node, nothing to install) writes the case study pages and the
search tags, and its output is committed with your changes.

## Pages
- `index.html`: home (photo, intro, details, Featured work, FAQs)
- `work.html`: every project
- `work/<slug>.html`: one case study page per project, served at `/work/<slug>` (made by the build)
- `contact.html`: a 3-step enquiry form
- `case.html`: forwards old `case.html#<slug>` links to `/work/<slug>` (made by the build)
- `templates/case.html`: the layout every case study page is made from

## Your photo
Your portrait is **`assets/ronij.jpg`**. It appears in the hero and on the contact page. Replace the file (same name) to change it.
The image shown when the site is shared on LinkedIn, WhatsApp and so on is **`assets/og.jpg`** (1200×630).

## Your details
The hero details (based in, studio, clients, email) are written directly in `index.html`, inside `<dl class="details">`.

## Adding or editing work
1. Edit **`assets/projects.js`**. Each project needs a `slug`, `client`, `title`, `year`, `category`, `summary`, and `chapters`.
2. Put the images in `work/<slug>/` (see below).
3. Run **`node scripts/build.js`**. It writes the project's page, updates the Home and Work lists, the sitemap,
   and stops with a clear message if an image is missing or a slug is wrong.
4. Commit everything it changed and push.

```
work/bakehouse-ny/01.jpg      ← cover (set with cover: "01.jpg"), 16:9, used on Home and Work
work/bakehouse-ny/02.jpg      ← case study gallery, listed under chapters[].rows
work/bakehouse-ny/03.mp4      ← videos work too (muted, looping)
```

Optional fields for a project:
- `seoTitle`: the page title in Google. Default: `<client> Brand Identity | Ronij Barahi`
- `seoDescription`: the line under the title in Google. Default: the project's `summary`
- `alt: { "06.jpg": "BH monogram seal on a cake box" }`: describe an image for Google Images and screen readers.
  Images without one get `<client> brand identity, <chapter>`.

Skip step 3 and a new project will show in the lists but its page won't exist yet, so always run the build.

## Search engines
- Titles and descriptions for Home, Work and Contact are in `PAGES` at the top of `scripts/build.js`.
- The build also writes structured data (who you are, each project), `sitemap.xml` and `robots.txt`.
- All links start with `/`, so to preview locally use a small server (e.g. `npx serve`) rather than opening the files directly.

## Contact form
Enquiries go to a Google Apps Script web app inside the **"ronijbarahi.com enquiries"** Google Sheet in
barahironij@gmail.com's Drive. Each one becomes a row in the sheet's **Enquiries** tab and is emailed to that
Gmail address, with Reply going straight to the person who wrote.

- The web app's address is the `data-endpoint` on the `<form>` in `contact.html`.
- Its code is kept here in `scripts/contact-form.gs`. To change it, paste it into the sheet's
  Extensions > Apps Script, then Deploy > Manage deployments > edit > Version: New version > Deploy.
  The address stays the same.
- If the web app can't be reached, the form falls back to opening the visitor's email app.

## Client strip
Edit `window.CLIENTS` at the top of `assets/projects.js`. Add `logo: "work/logos/name.svg"` to show a logo instead of the name.

## Deploying
Push to the GitHub repo connected to Vercel. `vercel.json` turns on clean URLs, so `/work` serves `work.html`
and `/work/bakehouse-ny` serves `work/bakehouse-ny.html`.
