#!/usr/bin/env node
/* ==========================================================================
   Build: run   node scripts/build.js   after changing assets/projects.js.

   It writes, from assets/projects.js:
     • work/<slug>.html         one real page per project, served at /work/<slug>
                                (the same way work.html is served at /work)
     • the Featured rows on the home page and the list on the Work page
     • the search and share tags (title, description, image) in every page's <head>
     • case.html                forwards old links (case.html#slug) to the new pages
     • sitemap.xml and robots.txt
   Nothing needs installing: it uses only Node.

   Page titles and descriptions for Home, Work and Contact are in PAGES below.
   A project can set its own with  seoTitle  and  seoDescription  in projects.js.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
// The live site answers on www (ronijbarahi.com redirects there), so every URL we
// give search engines uses www too.
const SITE = 'https://www.ronijbarahi.com';
const NAME = 'Ronij Barahi';
const OG_IMAGE = { url: `${SITE}/assets/og.jpg`, width: 1200, height: 630, alt: 'Ronij Barahi, brand designer and creative director in Kathmandu, Nepal' };

const PAGES = {
  'index.html': {
    url: '/',
    title: 'Ronij Barahi | Graphic and Logo Designer in Nepal',
    description: 'Graphic and logo designer in Kathmandu, Nepal. Ronij Barahi designs logos, brand identities, packaging and websites for clients in Nepal and worldwide.'
  },
  'logo-designer-nepal.html': {
    url: '/logo-designer-nepal',
    title: 'Logo Designer in Nepal | Ronij Barahi',
    description: 'Logo design in Kathmandu, Nepal by Ronij Barahi. Logos for restaurants, cafés, retailers and founders, with the files and guidelines to use them well.'
  },
  'work.html': {
    url: '/work',
    title: 'Branding and Packaging Work | Ronij Barahi',
    description: 'Brand identity case studies by Ronij Barahi for bakeries, restaurants, beauty, travel and home brands, from Kathmandu to New York.'
  },
  'contact.html': {
    url: '/contact',
    title: 'Start a Branding Project | Ronij Barahi',
    description: 'Tell Ronij Barahi about your business. Every brand identity, packaging or website project gets a fixed quote in NPR or AUD after a short brief.'
  }
};

// Who the site is about, for search engines (structured data on every page).
const PERSON = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: NAME,
  url: `${SITE}/`,
  image: `${SITE}/assets/ronij.jpg`,
  jobTitle: 'Graphic designer, logo designer and brand designer',
  email: 'mailto:hello@ronijbarahi.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  knowsAbout: ['Graphic design', 'Logo design', 'Brand identity', 'Brand strategy', 'Packaging design', 'Brand guidelines', 'Website design'],
  areaServed: ['Nepal', 'Australia', 'New Zealand', 'United States', 'Canada'],
  sameAs: ['https://www.behance.net/ronijbarahii', 'https://www.instagram.com/ronijbarahi']
};

/* ---------- Load the site's own data and templates ---------- */
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), s); };
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read('assets/projects.js'), sandbox, { filename: 'assets/projects.js' });
vm.runInContext(read('assets/media.js'), sandbox, { filename: 'assets/media.js' });
const P = sandbox.window.PROJECTS || [];
const MEDIA = sandbox.window.MEDIA || {};
const RB = require(path.join(ROOT, 'assets/templates.js'));
const T = RB.make(MEDIA);
const esc = T.esc;

/* ---------- Checks ---------- */
const problems = [];
const seen = new Set();
P.forEach((p, i) => {
  if (!p.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) problems.push(`Project ${i + 1} (${p.client}): slug "${p.slug}" must be lowercase letters, numbers and hyphens.`);
  if (seen.has(p.slug)) problems.push(`Two projects use the slug "${p.slug}".`);
  seen.add(p.slug);
  ['client', 'title', 'summary'].forEach(k => { if (!p[k]) problems.push(`${p.slug}: missing ${k}.`); });
  const files = [p.cover, ...(p.chapters || []).flatMap(c => (c.rows || []).flat())].filter(Boolean);
  files.forEach(f => { if (!/\//.test(f) && !fs.existsSync(path.join(ROOT, 'work', p.slug, f))) problems.push(`${p.slug}: image work/${p.slug}/${f} is missing.`); });
});
if (problems.length) { console.error('Build stopped:\n  ' + problems.join('\n  ')); process.exit(1); }

/* ---------- Head tags ---------- */
const jsonld = data => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c')}</script>`;
const seoBlock = ({ url, title, description, type = 'website', image = OG_IMAGE, data }) => {
  const full = SITE + (url === '/' ? '/' : url);
  return [
    '<!-- seo:start (written by scripts/build.js, edit the PAGES list there) -->',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${full}">`,
    `<meta property="og:site_name" content="${NAME}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:url" content="${full}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:image" content="${esc(image.url)}">`,
    image.width ? `<meta property="og:image:width" content="${image.width}">\n<meta property="og:image:height" content="${image.height}">` : '',
    `<meta property="og:image:alt" content="${esc(image.alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    data ? jsonld(data) : '',
    '<!-- seo:end -->'
  ].filter(Boolean).join('\n');
};
const putSeo = (html, block) => {
  const re = /<!-- seo:start[^>]*-->[\s\S]*?<!-- seo:end -->/;
  if (!re.test(html)) throw new Error('seo markers not found');
  return html.replace(re, () => block);
};
// Fill the inside of an element marked with a data attribute, e.g. <div … data-work-rows>…</div>.
const fillMarked = (html, attr, inner) => {
  const re = new RegExp(`(<div[^>]*\\s${attr}(?:="[^"]*")?(?:\\s[^>]*)?>)[\\s\\S]*?(</div>\\s*<!-- /${attr} -->)`);
  if (re.test(html)) return html.replace(re, (m, a, b) => a + inner + '\n' + b);
  const open = new RegExp(`(<div[^>]*\\s${attr}(?:="[^"]*")?(?:\\s[^>]*)?>)</div>`);
  if (!open.test(html)) throw new Error(`${attr} container not found`);
  return html.replace(open, (m, a) => `${a}${inner}\n</div><!-- /${attr} -->`);
};
const count = n => '(' + String(n).padStart(2, '0') + ')';

// Share image for a project: its cover at 1280px wide when that copy exists.
const coverImage = p => {
  const src = T.fileUrl(p, p.cover);
  const m = T.info(src);
  if (!src || !m) return OG_IMAGE;
  const big = m[0] > 1280 && /\.jpe?g$/i.test(src);
  const url = big ? src.replace(/\.jpe?g$/i, '-1280.jpg') : src;
  const w = big ? 1280 : m[0], h = big ? Math.round(m[1] * 1280 / m[0]) : m[1];
  return { url: SITE + url, width: w, height: h, alt: T.altFor(p, p.cover) };
};
const crumbs = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })) });

/* ---------- Questions and answers ----------
   Every FAQ on a page (the .qa blocks) is also given to search engines and AI assistants as
   structured questions and answers, read straight from the page so the two always match. */
const unesc = s => s.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
const faqsIn = html => [...html.matchAll(/<button[^>]*class="qa__q"[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<p class="qa__a">([\s\S]*?)<\/p>/g)]
  .map(m => ({ q: unesc(m[1]), a: unesc(m[2]) }));
const faqPage = (html, url) => {
  const list = faqsIn(html);
  return list.length ? { '@type': 'FAQPage', '@id': `${SITE}${url === '/' ? '/' : url}#faq`, mainEntity: list.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null;
};

/* ---------- Home, Work, Contact, Logo design ---------- */
const FEATURED = P.filter(p => p.featured);
{
  let html = read('index.html');
  html = putSeo(html, seoBlock({ ...PAGES['index.html'], data: { '@graph': [PERSON, { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: NAME, publisher: { '@id': `${SITE}/#person` } }, faqPage(html, '/')].filter(Boolean) } }));
  html = fillMarked(html, 'data-featured-rows', T.featuredRows(P));
  html = html.replace(/(<span class="count" data-count="featured">)[^<]*(<\/span>)/, `$1${count(FEATURED.length)}$2`);
  write('index.html', html);
}
{
  let html = read('work.html');
  html = putSeo(html, seoBlock({ ...PAGES['work.html'], data: { '@graph': [
    { '@type': 'CollectionPage', '@id': `${SITE}/work#page`, url: `${SITE}/work`, name: PAGES['work.html'].title, about: { '@id': `${SITE}/#person` },
      mainEntity: { '@type': 'ItemList', itemListElement: P.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/work/${p.slug}`, name: `${p.client}, ${p.title}` })) } },
    crumbs([['Home', '/'], ['Work', '/work']])
  ] } }));
  html = fillMarked(html, 'data-work-rows', T.workRows(P));
  html = html.replace(/(<span class="count" data-count>)[^<]*(<\/span>)/, `$1${count(P.length)}$2`);
  write('work.html', html);
}
{
  let html = read('contact.html');
  html = putSeo(html, seoBlock({ ...PAGES['contact.html'], data: { '@type': 'ContactPage', url: `${SITE}/contact`, name: PAGES['contact.html'].title, about: { '@id': `${SITE}/#person` } } }));
  write('contact.html', html);
}
{
  const file = 'logo-designer-nepal.html', page = PAGES[file];
  let html = read(file);
  html = putSeo(html, seoBlock({ ...page, data: { '@graph': [
    { '@type': 'Service', '@id': `${SITE}${page.url}#service`, name: 'Logo design in Nepal', serviceType: 'Logo design', url: SITE + page.url, description: page.description,
      provider: { '@id': `${SITE}/#person` }, areaServed: PERSON.areaServed },
    faqPage(html, page.url),
    crumbs([['Home', '/'], ['Logo design', page.url]]),
    PERSON
  ].filter(Boolean) } }));
  const pick = ((html.match(/data-work-rows="([^"]*)"/) || [])[1] || '').split(/\s+/).filter(Boolean);
  const items = pick.map(s => P.find(p => p.slug === s)).filter(Boolean);
  if (pick.length !== items.length) { console.error(`Build stopped: ${file} names a project that is not in projects.js.`); process.exit(1); }
  html = fillMarked(html, 'data-work-rows', T.workRows(items));
  write(file, html);
}

/* ---------- One page per project ---------- */
const GENERATED = '<!-- Generated by scripts/build.js from assets/projects.js. Edit those, not this file. -->';
const template = read('templates/case.html').replace(/<!-- Template for every case study page[\s\S]*?-->\n/, GENERATED + '\n');
P.forEach((p, i) => {
  const url = `/work/${p.slug}`;
  const title = p.seoTitle || `${p.client} Brand Identity | ${NAME}`;
  const description = p.seoDescription || p.summary;
  const image = coverImage(p);
  const c = T.caseStudy(P, i);
  const data = { '@graph': [
    { '@type': 'CreativeWork', '@id': `${SITE}${url}#work`, url: SITE + url, name: `${p.client} brand identity`, headline: `${p.client}: ${p.title}`, description,
      image: image.url, dateCreated: String(p.year || ''), genre: p.category, inLanguage: 'en',
      creator: { '@id': `${SITE}/#person` }, author: { '@id': `${SITE}/#person` }, about: { '@type': 'Organization', name: p.client } },
    crumbs([['Home', '/'], ['Work', '/work'], [p.client, url]]),
    PERSON
  ] };
  const html = template
    .replace('{{SEO}}', () => seoBlock({ url, title, description, type: 'article', image, data }))
    .replace('{{SLUG}}', esc(p.slug))
    .replace('{{CASE}}', () => c.main)
    .replace('{{NEXT_MOBILE}}', () => c.nextMobile);
  write(`work/${p.slug}.html`, html);
});
// Remove pages for projects that were deleted from projects.js.
fs.readdirSync(path.join(ROOT, 'work')).filter(n => n.endsWith('.html') && !seen.has(n.slice(0, -5))).forEach(n => {
  const f = path.join(ROOT, 'work', n);
  if (fs.readFileSync(f, 'utf8').includes(GENERATED)) { fs.unlinkSync(f); console.log(`Removed old page work/${n}`); }
});

/* ---------- Old links: case.html#slug ---------- */
write('case.html', `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
${GENERATED}
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${SITE}/work">
<title>Work | ${NAME}</title>
<script>
/* Case studies used to live at case.html#slug. Send those links to the project's own page. */
(function () {
  var slugs = ${JSON.stringify(P.map(p => p.slug))};
  var s = decodeURIComponent(location.hash.slice(1));
  location.replace(slugs.indexOf(s) > -1 ? '/work/' + s : '/work');
})();
</script>
</head>
<body style="background:#050505;color:#eee;font-family:sans-serif">
<p><a href="/work" style="color:inherit">See the work</a></p>
</body>
</html>
`);

/* ---------- llms.txt ----------
   A plain summary of the site for AI assistants (ChatGPT, Claude, Perplexity and others). */
write('llms.txt', `# ${NAME}

> ${NAME} is a graphic designer, logo designer, brand designer and creative director based in Kathmandu, Nepal. He designs logos, brand identities, packaging and websites for restaurants, retailers and founders in ${PERSON.areaServed.slice(0, -1).join(', ')} and ${PERSON.areaServed.slice(-1)}.

- Based in: Kathmandu, Nepal (UTC+5:45)
- Services: logo design, brand identity, brand guidelines, packaging design, website design
- Quotes: fixed quote after a short brief, in NPR for clients in Nepal and AUD for clients in Australia
- Contact: hello@ronijbarahi.com or ${SITE}/contact
- Instagram: https://www.instagram.com/ronijbarahi
- Behance: https://www.behance.net/ronijbarahii

## Pages
- [Home](${SITE}/): who Ronij is, featured work and FAQs
- [Logo designer in Nepal](${SITE}/logo-designer-nepal): how logo projects work, recent logos, FAQs
- [Work](${SITE}/work): every case study
- [Contact](${SITE}/contact): start a project

## Case studies
${P.map(p => `- [${p.client}: ${p.title}](${SITE}/work/${p.slug}): ${p.summary}`).join('\n')}
`);

/* ---------- Sitemap and robots ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = ['/', '/logo-designer-nepal', '/work', ...P.map(p => `/work/${p.slug}`), '/contact'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /
Disallow: /templates/
Disallow: /scripts/

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`Built ${P.length} case study pages, ${FEATURED.length} featured on Home, sitemap with ${urls.length} pages.`);
