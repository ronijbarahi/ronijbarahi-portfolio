# ronijbarahi.com

A plain static site with no build step. Vercel serves it as is.

## Pages
- `index.html`: home (hero, client strip, Featured work, FAQs)
- `work.html`: every project
- `case.html#<slug>`: one case study page per project
- `contact.html`: a 3-step enquiry form that opens the visitor's email app with the message filled in

## Your photo
Save a portrait photo as **`assets/ronij.jpg`** (upright, at least 1200 px tall). It appears in the hero, the contact page and as the small round logo in the menu bar. Until it exists, a placeholder silhouette shows.

## Your details
The hero details (based in, studio, clients, email) are written directly in `index.html`, inside `<dl class="details">`.

## Adding or editing work
Edit **`assets/projects.js`**. Each project needs a `slug`, `client`, `title`, `year`, `category`, `summary`, and `chapters`.

Put the images in `work/<slug>/`:

```
work/bakehouse-ny/cover.jpg   ← 16:9, used on Home and Work
work/bakehouse-ny/icon.png    ← optional 40×40 logo
work/bakehouse-ny/01.jpg      ← case study gallery, listed under chapters[].rows
work/bakehouse-ny/02.mp4      ← videos work too (muted, looping)
```

Until a file exists, a coloured placeholder shows in its place.

## Client strip
Edit `window.CLIENTS` at the top of `assets/projects.js`. Add `logo: "work/logos/name.svg"` to show a logo instead of the name.

## Deploying
Push to the GitHub repo connected to Vercel. `vercel.json` turns on clean URLs, so `/work` serves `work.html`.
