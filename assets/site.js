(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const P = window.PROJECTS || [];
  const C = window.CLIENTS || [];
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = () => innerWidth <= 1100;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.6M10.5 3.5V9.4" stroke="currentColor" stroke-width="1.2"/></svg>';
  const isVideo = src => /\.(mp4|webm|mov)$/i.test(src || '');
  const caseUrl = p => 'case.html#' + p.slug;
  const fileUrl = (p, f) => !f ? '' : (/\//.test(f) ? f : `work/${p.slug}/${f}`);
  const FEATURED = P.filter(p => p.featured);
  let lenis = null;

  /* ---------- Nav ---------- */
  const navKey = page === 'case' ? 'work' : page;
  $$('[data-nav]').forEach(a => {
    const on = a.dataset.nav === navKey;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page');
  });
  const toggle = $('[data-nav-toggle]');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    if (toggle) { toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; }
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  toggle && toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('#navmenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Smooth scroll (Lenis) ---------- */
  if (!reduce && fine && window.Lenis) {
    try {
      lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
      const loop = t => { lenis.raf(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -60 }); }
      }));
    } catch (e) { lenis = null; }
  }

  /* ---------- Photo fallbacks ---------- */
  $$('.portrait').forEach(p => {
    const img = $('.portrait__base img', p);
    const empty = () => p.classList.add('is-empty');
    if (!img || !img.getAttribute('src')) return empty();
    img.addEventListener('error', empty, { once: true });
    if (img.complete && !img.naturalWidth) empty();
  });

  /* ---------- Relight ----------
     The portrait and the footer line carry a soft light. On desktop it follows the
     cursor and eases back to rest when the cursor leaves; elsewhere it stays put. */
  const lights = $$('[data-relight]').map(el => {
    const cs = getComputedStyle(el);
    const rx = parseFloat(cs.getPropertyValue('--lx')) || 50, ry = parseFloat(cs.getPropertyValue('--ly')) || 40;
    return { el, host: el.closest('[data-relight-host]') || el, rx, ry, x: rx, y: ry, tx: rx, ty: ry };
  });
  if (fine && !reduce && lights.length) {
    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
    const step = () => {
      raf = 0; let moving = false;
      lights.forEach(l => {
        const dx = l.tx - l.x, dy = l.ty - l.y;
        if (Math.abs(dx) + Math.abs(dy) > 0.05) {
          l.x += dx * 0.1; l.y += dy * 0.1; moving = true;
          l.el.style.setProperty('--lx', l.x.toFixed(2) + '%');
          l.el.style.setProperty('--ly', l.y.toFixed(2) + '%');
        }
      });
      if (moving) kick();
    };
    lights.forEach(l => {
      l.host.addEventListener('pointermove', e => {
        const r = l.el.getBoundingClientRect();
        l.tx = ((e.clientX - r.left) / r.width) * 100;
        l.ty = ((e.clientY - r.top) / r.height) * 100;
        kick();
      });
      l.host.addEventListener('pointerleave', () => { l.tx = l.rx; l.ty = l.ry; kick(); });
    });
  }

  /* ---------- Counts ---------- */
  $$('[data-count]').forEach(el => { const n = el.dataset.count === 'featured' ? FEATURED.length : P.length; el.textContent = '(' + String(n).padStart(2, '0') + ')'; });

  /* ---------- Media helpers ---------- */
  const phStyle = (p, neutral) => neutral ? '' : `style="--ph-bg:${esc(p.swatch?.bg || '#141414')};--ph-fg:${esc(p.swatch?.fg || '#8a8a8a')}"`;
  const phHTML = (p, file, { word = true, neutral = false } = {}) =>
    `<div class="ph" ${phStyle(p, neutral)}>${word ? `<span class="ph__word">${esc(p.client)}</span>` : ''}<span class="ph__file">${esc(file)}</span></div>`;

  // Swap any image or video that fails to load (or has no path yet) for its placeholder.
  const wireFallbacks = root => {
    $$('[data-ph]', root).forEach(media => {
      const fail = () => {
        const wrap = media.parentElement;
        wrap.insertAdjacentHTML('beforeend', media.dataset.ph);
        wrap.classList.add('csa-frame--ph');
        media.remove();
      };
      if (!media.getAttribute('src')) return fail();
      media.addEventListener('error', fail, { once: true });
      const done = () => media.classList.add('is-loaded');
      if (media.tagName === 'IMG') { if (media.complete && media.naturalWidth) done(); else media.addEventListener('load', done, { once: true }); }
      else media.addEventListener('loadeddata', done, { once: true });
      // Some phone browsers skip the load event for lazy images: never leave one hidden.
      setTimeout(done, 2500);
    });
  };
  // Each work image has -640 and -1280 copies (see assets/media.js) so phones and tablets
  // download and decode far less than the 2000px original.
  const MW = window.MEDIA_W || {};
  const srcsetFor = src => {
    const w = MW[src]; if (!w || !/\.jpe?g$/i.test(src)) return '';
    const base = src.replace(/\.jpe?g$/i, '');
    return [640, 1280].filter(x => w > x).map(x => `${base}-${x}.jpg ${x}w`).concat(`${src} ${w}w`).join(', ');
  };
  const mediaTag = (src, ph, cls = '', { sizes = '100vw', eager = false } = {}) => {
    if (isVideo(src)) return `<video class="${cls}" src="${esc(src)}" muted loop playsinline autoplay preload="metadata" data-ph="${esc(ph)}"></video>`;
    const ss = srcsetFor(src);
    return `<img class="${cls}" src="${esc(src)}"${ss ? ` srcset="${esc(ss)}" sizes="${sizes}"` : ''} alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" data-ph="${esc(ph)}">`;
  };

  const coverHTML = (p, eager = false) => {
    const src = fileUrl(p, p.cover);
    const ph = phHTML(p, src || `work/${p.slug}/cover.jpg`);
    const hover = p.hoverVideo ? `<div class="tile-reveal"><video muted loop playsinline preload="none" data-src="${esc(fileUrl(p, p.hoverVideo))}"></video></div>` : '';
    return `<div class="cover-frame">${mediaTag(src, ph, '', { sizes: '(max-width: 1100px) 100vw, 50vw', eager })}${hover}</div>`;
  };
  const iconHTML = p => `<span class="icon icon--ph" style="--ph-bg:${esc(p.swatch?.bg || '#222')};--ph-fg:${esc(p.swatch?.fg || '#aaa')}">${esc((p.client || '?').trim()[0])}</span>`;
  const wireIcons = root => $$('[data-icon-ph]', root).forEach(img => {
    img.addEventListener('error', () => img.outerHTML = img.dataset.iconPh, { once: true });
  });
  const wireHover = root => {
    if (!fine || reduce) return;
    $$('.cover-frame', root).forEach(f => {
      const v = $('.tile-reveal video', f);
      if (!v) return;
      const host = f.closest('a') || f;
      host.addEventListener('mouseenter', () => {
        if (!v.src) v.src = v.dataset.src;
        v.play().then(() => f.classList.add('is-revealed')).catch(() => {});
      });
      host.addEventListener('mouseleave', () => { f.classList.remove('is-revealed'); v.pause(); });
    });
  };

  /* ---------- Client marquee ---------- */
  const track = $('[data-marquee]');
  if (track && C.length) {
    const item = (c, hidden) => `<span class="marquee__logo"${hidden ? ' aria-hidden="true"' : ''}>${c.logo
      ? `<img src="${esc(c.logo)}" alt="${hidden ? '' : esc(c.name)}">`
      : `<span class="cl cl--${esc(c.style || 'plain')}">${esc(c.name)}</span>`}</span>`;
    track.innerHTML = C.map(c => item(c, false)).join('') + C.map(c => item(c, true)).join('');
  }

  /* ---------- Home: featured deck ---------- */
  const rows = $('[data-featured-rows]');
  if (rows) {
    rows.innerHTML = FEATURED.map((p, i) => `
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
    wireFallbacks(rows); wireHover(rows);
    const head = $('.featured__deck > .sec-head');
    const pin = () => document.documentElement.style.setProperty('--row-pin', (head.getBoundingClientRect().height + parseFloat(getComputedStyle(head).top) + 56) + 'px');
    pin(); addEventListener('resize', pin);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pin);
  }

  /* ---------- Work page ---------- */
  const workRows = $('[data-work-rows]');
  if (workRows) {
    workRows.innerHTML = P.map((p, i) => `
<article class="work-row">
  <a class="featured-row__media" href="${caseUrl(p)}" aria-label="${esc(p.client)}, view case study">${coverHTML(p, i < 2)}</a>
  <div>
    <a class="work-row__head" href="${caseUrl(p)}">
      <span class="work-row__lead">${iconHTML(p)}<span>${esc(p.client)}</span></span>
      <span class="work-row__title">${esc(p.title)}</span>
      <span class="work-row__year mono">${esc(p.year)}</span>
    </a>
    <p class="work-row__body">${esc(p.summary)}</p>
    <a class="btn work-row__cta" href="${caseUrl(p)}">View case study ${ARROW}</a>
  </div>
</article>`).join('');
    wireFallbacks(workRows); wireIcons(workRows); wireHover(workRows);
  }

  /* ---------- FAQ ---------- */
  $$('.qa').forEach(qa => {
    const btn = $('.qa__q', qa);
    btn.addEventListener('click', () => {
      const open = !qa.classList.contains('is-open');
      $$('.qa').forEach(o => { o.classList.remove('is-open'); $('.qa__q', o).setAttribute('aria-expanded', 'false'); });
      qa.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Kathmandu clock ---------- */
  const clocks = $$('[data-clock]');
  if (clocks.length) {
    try {
      const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit' });
      const tick = () => clocks.forEach(c => c.textContent = fmt.format(new Date()) + ' NPT');
      tick(); setInterval(tick, 15000);
    } catch (e) {}
  }

  /* ---------- Case study ---------- */
  const caseRoot = $('[data-case]');
  if (caseRoot) {
    let io = null, lock = 0;
    const render = () => {
      const slug = decodeURIComponent(location.hash.slice(1));
      const i = Math.max(0, P.findIndex(p => p.slug === slug));
      const p = P[i];
      if (!p) { caseRoot.outerHTML = `<p class="csa-missing">No projects yet. <a href="index.html">Back home</a></p>`; return; }
      const next = P[(i + 1) % P.length];
      document.title = `${p.client}, ${p.title} | Ronij Barahi`;

      let n = 0;
      const gallery = (p.chapters || []).map((ch, ci) => (ch.rows || []).map((row, ri) => {
        const frames = row.slice(0, 2).map(file => {
          n++;
          const src = fileUrl(p, file);
          const ph = phHTML(p, src, { word: n === 1 || (ri === 0 && row.length === 1), neutral: !(n === 1 || (ri === 0 && row.length === 1)) });
          const two = Math.min(row.length, 2) === 2;
          return `<div class="csa-frame">${mediaTag(src, ph, 'csa-media', { sizes: two ? '(max-width: 1100px) 50vw, 33vw' : '(max-width: 1100px) 100vw, 66vw', eager: n <= 2 })}</div>`;
        }).join('');
        return `<div class="csa-row" style="--n: ${Math.min(row.length, 2)}" data-ch="${ci}"${ri === 0 ? ` id="ch-${ci}" data-ch-start` : ''}>${frames}</div>`;
      }).join('')).join('');

      const head = `<h1 class="csa-head"><span class="csa-head__lead">${iconHTML(p)}<span>${esc(p.client)}</span></span><span class="csa-head__title">${esc(p.title)}</span><span class="csa-head__year mono">${esc(p.year)}</span></h1>`;
      const acc = (p.chapters || []).map((ch, ci) => `
<div class="csa-acc__item${ci === 0 ? ' is-open' : ''}" data-acc="${ci}">
  <h2 style="margin:0;font-size:inherit"><button type="button" class="csa-acc__head mono" aria-expanded="${ci === 0}" aria-controls="acc-${ci}"><span>${String(ci + 1).padStart(2, '0')}</span><span>${esc(ch.label)}</span><span class="qa__icon" aria-hidden="true"></span></button></h2>
  <div class="csa-acc__panel" id="acc-${ci}"><div class="csa-acc__panel-inner"><p class="csa-acc__body">${esc(ch.body)}</p></div></div>
</div>`).join('');
      const nextHTML = cls => `<div class="${cls}"><a class="csa-next__card" href="${caseUrl(next)}"><p class="csa-next__label mono"><span>Next project</span>${ARROW}</p><span class="csa-next__row"><span class="csa-head__lead">${iconHTML(next)}<span>${esc(next.client)}</span></span><span class="csa-head__title">${esc(next.title)}</span><span class="csa-head__year mono">${esc(next.year)}</span></span></a></div>`;

      caseRoot.innerHTML = `<div class="csa-gallery">${gallery}</div><aside class="csa-aside">${head}<div class="csa-acc">${acc}</div>${nextHTML('csa-next')}</aside>`;
      const mob = $('[data-case-next-mobile]');
      if (mob) mob.innerHTML = nextHTML('csa-next csa-next--mobile');
      wireFallbacks(document); wireIcons(document);
      lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0);

      const openCh = ci => $$('.csa-acc__item', caseRoot).forEach(it => {
        const on = String(it.dataset.acc) === String(ci);
        it.classList.toggle('is-open', on);
        $('.csa-acc__head', it).setAttribute('aria-expanded', String(on));
      });
      $$('.csa-acc__item', caseRoot).forEach(it => $('.csa-acc__head', it).addEventListener('click', () => {
        const ci = it.dataset.acc;
        if (mobile()) { const on = !it.classList.contains('is-open'); it.classList.toggle('is-open', on); $('.csa-acc__head', it).setAttribute('aria-expanded', String(on)); return; }
        openCh(ci); lock = Date.now() + 900;
        const target = $('#ch-' + ci, caseRoot);
        if (target) lenis ? lenis.scrollTo(target, { offset: -(target.getBoundingClientRect ? 70 : 0) }) : target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }));

      // Open the chapter whose images are in the middle of the screen.
      io && io.disconnect();
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(entries => {
          if (mobile() || Date.now() < lock) return;
          entries.forEach(e => { if (e.isIntersecting) openCh(e.target.dataset.ch); });
        }, { rootMargin: '-45% 0px -50% 0px' });
        $$('.csa-row', caseRoot).forEach(r => io.observe(r));
      }
    };
    render();
    addEventListener('hashchange', render);
  }

  /* ---------- Contact form ----------
     Each enquiry is sent to a Google Apps Script web app (data-endpoint), which adds
     a row to Ronij's Google Sheet and emails him the details. If that request can't
     be sent, the form falls back to opening the visitor's mail app with the message. */
  const form = $('[data-contact-form]');
  if (form) {
    const steps = $$('.offer-step', form);
    const dots = $$('.offer-dots span', form);
    const back = $('[data-back]', form), nextBtn = $('[data-next]', form), err = $('.offer-error', form);
    let cur = 0;
    const show = i => {
      cur = i;
      steps.forEach((s, k) => { s.hidden = k !== i; s.classList.remove('is-rising'); });
      if (i > 0) { void steps[i].offsetWidth; steps[i].classList.add('is-rising'); }
      dots.forEach((d, k) => d.classList.toggle('is-on', k <= i));
      back.hidden = i === 0;
      nextBtn.textContent = i === steps.length - 1 ? 'Send' : 'Next';
      err.textContent = '';
      const first = $('input:not([type=hidden]):not(.offer-pill-input), textarea', steps[i]);
      first && i > 0 && first.focus();
    };
    const valid = i => {
      const s = steps[i]; let ok = true;
      $$('.offer-field[required]', s).forEach(f => { const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)); f.setAttribute('aria-invalid', String(bad)); if (bad) ok = false; });
      $$('fieldset[data-required]', s).forEach(fs => { if (!$('input:checked', fs)) ok = false; });
      if (!ok) err.textContent = i === 0 ? 'Add your name and a valid email to continue.' : i === 1 ? 'Pick one option in each group to continue.' : 'Write a few lines about the project.';
      return ok;
    };
    back.addEventListener('click', () => show(Math.max(0, cur - 1)));
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!valid(cur)) return;
      if (cur < steps.length - 1) return show(cur + 1);
      const v = n => (form.elements[n] && form.elements[n].value || '').trim();
      const body = [
        `Name: ${v('name')}`, `Email: ${v('email')}`, v('website') ? `Website: ${v('website')}` : '',
        `Looking for: ${v('need')}`, `Start: ${v('timeline')}`, '', v('message')
      ].filter((l, k) => l !== '' || k === 5).join('\n');
      const to = form.dataset.to;
      const endpoint = form.dataset.endpoint || '';
      const esc2 = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      const viaMail = () => {
        const href = `mailto:${to}?subject=${encodeURIComponent('Project enquiry from ' + v('name'))}&body=${encodeURIComponent(body)}`;
        form.innerHTML = `<div class="offer-done"><p>Your email app should now open with the message written. Press send there to reach me.</p><p>Nothing opened? Email <a href="mailto:${to}">${to}</a> directly, or <button type="button" class="btn" data-copy>Copy your message</button></p></div>`;
        $('[data-copy]', form).addEventListener('click', ev => {
          const b = ev.currentTarget;
          (navigator.clipboard ? navigator.clipboard.writeText(body) : Promise.reject()).then(() => b.textContent = 'Copied', () => b.textContent = 'Copy failed: select the text in your email app');
        });
        try { location.href = href; } catch (e2) {}
      };
      if (!/^https:\/\/script\.google\.com\//.test(endpoint)) return viaMail();
      const data = new URLSearchParams();
      ['name', 'email', 'website', 'need', 'timeline', 'message', 'company'].forEach(k => data.append(k, v(k)));
      data.append('page', location.href);
      nextBtn.disabled = true; back.disabled = true; nextBtn.textContent = 'Sending…';
      fetch(endpoint, { method: 'POST', mode: 'no-cors', body: data })
        .then(() => {
          const first = v('name').split(/\s+/)[0];
          form.innerHTML = `<div class="offer-done"><p>Thank you${first ? ', ' + esc2(first) : ''}. Your message has reached me, and I'll reply to ${esc2(v('email'))} soon.</p></div>`;
        })
        .catch(() => { nextBtn.disabled = false; back.disabled = false; viaMail(); });
    });
    show(0);
  }
})();
