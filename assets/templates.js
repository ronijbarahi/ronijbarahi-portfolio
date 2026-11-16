/* ==========================================================================
   Shared HTML for the work lists and case study pages.

   The same code runs in two places:
     • in the browser, through site.js
     • at build time, through scripts/build.js, which writes the finished HTML into
       the pages so Google (and link previews) can read the work without JavaScript.
   Keeping one copy means the page people see and the page search engines read
   can never drift apart.
   ========================================================================== */
(function (root) {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.6M10.5 3.5V9.4" stroke="currentColor" stroke-width="1.2"/></svg>';
  const isVideo = src => /\.(mp4|webm|mov)$/i.test(src || '');

  // Every page links with root paths (/work/…) so pages at /work/<slug> find their files too.
  const caseUrl = p => '/work/' + p.slug;
  const abs = u => !u ? '' : /^(https?:|data:|\/)/.test(u) ? u : '/' + u;
  const key = u => String(u || '').replace(/^\//, '');
  const fileUrl = (p, f) => !f ? '' : abs(/\//.test(f) ? f : `work/${p.slug}/${f}`);

  // Alt text: a project can name any file in `alt: { "06.jpg": "…" }`; otherwise it is
  // written from the client and the chapter, e.g. "Bakehouse NY brand identity, voice".
  const altFor = (p, file, chapter, part) => {
    const own = p.alt && p.alt[file];
    if (own) return own;
    const base = `${p.client} brand identity`;
    return (chapter ? `${base}, ${String(chapter).toLowerCase()}` : base) + (part ? ` (${part})` : '');
  };

  function make(MEDIA) {
    MEDIA = MEDIA || {};
    const info = src => MEDIA[key(src)];

    const phStyle = (p, neutral) => neutral ? '' : `style="--ph-bg:${esc(p.swatch?.bg || '#141414')};--ph-fg:${esc(p.swatch?.fg || '#8a8a8a')}"`;
    const phHTML = (p, file, { word = true, neutral = false } = {}) =>
      `<div class="ph" ${phStyle(p, neutral)}>${word ? `<span class="ph__word">${esc(p.client)}</span>` : ''}<span class="ph__file">${esc(file)}</span></div>`;

    /* Work images (see assets/media.js): browsers pick the smallest copy that is sharp on the
       screen, as WebP at 640/960/1280/1600px or full size, with JPEG kept for old browsers. */
    const stem = src => src.replace(/\.jpe?g$/i, '');
    const webpSet = (src, w) => [640, 960, 1280, 1600].filter(x => w > x).map(x => `${stem(src)}-${x}.webp ${x}w`).concat(`${stem(src)}.webp ${w}w`).join(', ');
    const jpgSet = (src, w) => [640, 1280].filter(x => w > x).map(x => `${stem(src)}-${x}.jpg ${x}w`).concat(`${src} ${w}w`).join(', ');
    const frameStyle = src => {
      const m = info(src); if (!m) return '';
      return ` style="--tint: ${m[2]};${m[3] ? ` --lqip: url('${m[3]}');` : ''}"`;
    };
    const mediaTag = (src, ph, cls = '', { sizes = '100vw', eager = false, alt = '' } = {}) => {
      if (isVideo(src)) return `<video class="${cls}" src="${esc(src)}" muted loop playsinline autoplay preload="metadata" aria-label="${esc(alt)}" data-ph="${esc(ph)}"></video>`;
      const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
      const m = info(src);
      if (!m || !/\.jpe?g$/i.test(src)) return `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" ${load} decoding="async" data-ph="${esc(ph)}">`;
      return `<picture><source type="image/webp" srcset="${esc(webpSet(src, m[0]))}" sizes="${sizes}">` +
        `<img class="${cls}" src="${esc(src)}" srcset="${esc(jpgSet(src, m[0]))}" sizes="${sizes}" width="${m[0]}" height="${m[1]}" alt="${esc(alt)}" ${load} decoding="async" data-ph="${esc(ph)}"></picture>`;
    };

    const coverHTML = (p, eager = false) => {
      const src = fileUrl(p, p.cover);
      const ph = phHTML(p, src || `/work/${p.slug}/cover.jpg`);
      const hover = p.hoverVideo ? `<div class="tile-reveal"><video muted loop playsinline preload="none" data-src="${esc(fileUrl(p, p.hoverVideo))}"></video></div>` : '';
      return `<div class="cover-frame"${frameStyle(src)}>${mediaTag(src, ph, 'fade', { sizes: '(max-width: 1100px) 100vw, 50vw', eager, alt: altFor(p, p.cover) })}${hover}</div>`;
    };
    const iconHTML = p => `<span class="icon icon--ph" aria-hidden="true" style="--ph-bg:${esc(p.swatch?.bg || '#222')};--ph-fg:${esc(p.swatch?.fg || '#aaa')}">${esc((p.client || '?').trim()[0])}</span>`;

    const featuredRows = P => P.filter(p => p.featured).map((p, i) => `
<article class="featured-row">
  <a class="featured-row__media" href="${caseUrl(p)}" aria-label="${esc(p.client)}, view case study">${coverHTML(p, i < 2)}</a>
  <div class="featured-row__text">
    <div class="featured-row__top">
      <span class="featured-row__num mono">${String(i + 1).padStart(2, '0')}</span>
      <div>
        <h3 class="featured-row__title">${esc(p.title)}</h3>
        <p class="featured-row__meta mono">${esc(p.client)} / ${esc(p.year)} / ${esc(p.category)}</p>
      </div>
      <a class="arrow-btn" href="${caseUrl(p)}" aria-label="${esc(p.client)}, view case study">${ARROW}</a>
    </div>
    <p class="featured-row__desc">${esc(p.summary)}</p>
  </div>
</article>`).join('');

    const workRows = P => P.map((p, i) => `
<article class="work-row">
  <a class="featured-row__media" href="${caseUrl(p)}" aria-label="${esc(p.client)}, view case study">${coverHTML(p, i < 2)}</a>
  <div>
    <a class="work-row__head" href="${caseUrl(p)}">
      <span class="work-row__lead">${iconHTML(p)} <span>${esc(p.client)}</span></span>
      <span class="work-row__title">${esc(p.title)}</span>
      <span class="work-row__year mono">${esc(p.year)}</span>
    </a>
    <p class="work-row__body">${esc(p.summary)}</p>
    <a class="btn work-row__cta" href="${caseUrl(p)}">View case study ${ARROW}</a>
  </div>
</article>`).join('');

    const nextHTML = (next, cls) => `<div class="${cls}"><a class="csa-next__card" href="${caseUrl(next)}"><p class="csa-next__label mono"><span>Next project</span>${ARROW}</p><span class="csa-next__row"><span class="csa-head__lead">${iconHTML(next)} <span>${esc(next.client)}</span></span> <span class="csa-head__title">${esc(next.title)}</span> <span class="csa-head__year mono">${esc(next.year)}</span></span></a></div>`;

    // One case study: the gallery, the heading and chapters beside it, and the next project.
    const caseStudy = (P, i) => {
      const p = P[i], next = P[(i + 1) % P.length];
      let n = 0;
      const gallery = (p.chapters || []).map((ch, ci) => (ch.rows || []).map((row, ri) => {
        const two = Math.min(row.length, 2) === 2;
        const frames = row.slice(0, 2).map((file, fi) => {
          n++;
          const src = fileUrl(p, file);
          const lead = n === 1 || (ri === 0 && row.length === 1);
          const ph = phHTML(p, src, { word: lead, neutral: !lead });
          return `<div class="csa-frame"${frameStyle(src)}>${mediaTag(src, ph, 'csa-media', { sizes: two ? '(max-width: 1100px) 50vw, 33vw' : '(max-width: 1100px) 100vw, 66vw', eager: n <= 2, alt: altFor(p, file, ch.label, two ? `${fi + 1} of 2` : '') })}</div>`;
        }).join('');
        return `<div class="csa-row" style="--n: ${Math.min(row.length, 2)}" data-ch="${ci}"${ri === 0 ? ` id="ch-${ci}" data-ch-start` : ''}>${frames}</div>`;
      }).join('')).join('');

      const head = `<h1 class="csa-head"><span class="csa-head__lead">${iconHTML(p)} <span>${esc(p.client)}</span></span> <span class="csa-head__title">${esc(p.title)}</span> <span class="csa-head__year mono">${esc(p.year)}</span></h1>`;
      const acc = (p.chapters || []).map((ch, ci) => `
<div class="csa-acc__item${ci === 0 ? ' is-open' : ''}" data-acc="${ci}">
  <h2 style="margin:0;font-size:inherit"><button type="button" class="csa-acc__head mono" aria-expanded="${ci === 0}" aria-controls="acc-${ci}"><span>${String(ci + 1).padStart(2, '0')}</span><span>${esc(ch.label)}</span><span class="qa__icon" aria-hidden="true"></span></button></h2>
  <div class="csa-acc__panel" id="acc-${ci}"><div class="csa-acc__panel-inner"><p class="csa-acc__body">${esc(ch.body)}</p></div></div>
</div>`).join('');

      return {
        main: `<div class="csa-gallery">${gallery}</div><aside class="csa-aside">${head}<div class="csa-acc">${acc}</div>${nextHTML(next, 'csa-next')}</aside>`,
        nextMobile: nextHTML(next, 'csa-next csa-next--mobile')
      };
    };

    return { esc, ARROW, caseUrl, fileUrl, altFor, phHTML, mediaTag, coverHTML, iconHTML, featuredRows, workRows, caseStudy, info };
  }

  const api = { make, esc, caseUrl, fileUrl, altFor, abs };
  root.RB = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
