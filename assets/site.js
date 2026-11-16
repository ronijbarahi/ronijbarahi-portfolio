(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const P = window.PROJECTS || [];
  const C = window.CLIENTS || [];
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = () => innerWidth <= 1100;
  // HTML for the work lists and case studies lives in assets/templates.js, shared with the build.
  const T = window.RB.make(window.MEDIA || {});
  const esc = T.esc;
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

  /* ---------- Intro loader ----------
     Counts up while the first screen loads (at least 1.1s so it never flashes,
     at most 3.2s so nobody waits), then lifts away. */
  const loader = $('.loader');
  if (loader && document.documentElement.classList.contains('is-loading')) {
    const root = document.documentElement;
    const count = $('[data-loader-count]', loader), bar = $('.loader__bar span', loader);
    const MIN = 1100, MAX = 3200, t0 = performance.now();
    let ready = document.readyState === 'complete', shown = 0, finished = false;
    if (!ready) addEventListener('load', () => { ready = true; }, { once: true });
    if (lenis) lenis.stop();
    const paint = n => { count.textContent = String(Math.round(n)).padStart(2, '0'); bar.style.transform = `scaleX(${n / 100})`; };
    const finish = () => {
      if (finished) return; finished = true;
      paint(100);
      try { sessionStorage.setItem('rb-intro', '1'); } catch (e) {}
      setTimeout(() => {
        loader.classList.add('is-done');
        root.classList.remove('is-loading');
        if (lenis) lenis.start();
        setTimeout(() => loader.remove(), 1300);
      }, 180);
    };
    const step = now => {
      if (finished) return;
      const t = now - t0;
      const goal = ready && t >= MIN ? 100 : Math.min(92, (t / MIN) * 92);
      shown += (goal - shown) * 0.14;
      if (goal === 100 && shown > 99.4) shown = 100;
      paint(shown);
      if (shown >= 100 || t > MAX) return finish();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  } else if (loader) {
    loader.remove();
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
  // Swap any image or video that fails to load (or has no path yet) for its placeholder.
  const wireFallbacks = root => {
    $$('[data-ph]', root).forEach(media => {
      const fail = () => {
        const wrap = media.closest('.cover-frame, .csa-frame') || media.parentElement;
        wrap.insertAdjacentHTML('beforeend', media.dataset.ph);
        wrap.classList.add('csa-frame--ph');
        (media.closest('picture') || media).remove();
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
  /* While an image loads its frame shows the image's average colour (and, for covers,
     a tiny blurred preview), then the image fades in. */
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
  // The build writes these rows into the page; they are redrawn here only if projects.js has changed since.
  const rows = $('[data-featured-rows]');
  if (rows) {
    if (rows.children.length !== FEATURED.length) rows.innerHTML = T.featuredRows(P);
    wireFallbacks(rows); wireHover(rows);
    const head = $('.featured__deck > .sec-head');
    const pin = () => document.documentElement.style.setProperty('--row-pin', (head.getBoundingClientRect().height + parseFloat(getComputedStyle(head).top) + 56) + 'px');
    pin(); addEventListener('resize', pin);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pin);
  }

  /* ---------- Work lists ----------
     The Work page lists every project. A page can list a chosen few instead by naming
     their slugs: <div class="work-deck" data-work-rows="bakehouse-ny nu-cosmetics">. */
  $$('[data-work-rows]').forEach(list => {
    const pick = (list.dataset.workRows || '').split(/\s+/).filter(Boolean);
    const items = pick.length ? pick.map(s => P.find(p => p.slug === s)).filter(Boolean) : P;
    if (list.children.length !== items.length) list.innerHTML = T.workRows(items);
    wireFallbacks(list); wireIcons(list); wireHover(list);
  });

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

  /* ---------- Case study ----------
     Each project has its own page at /work/<slug>, written by the build with the case study
     already in the HTML. Here the chapters just get their behaviour. If a page arrives
     empty (a project added without running the build), it is drawn from projects.js. */
  const caseRoot = $('[data-case]');
  if (caseRoot) {
    let io = null, lock = 0;
    const slug = caseRoot.dataset.slug || location.pathname.replace(/\/$/, '').split('/').pop();
    const render = () => {
      const i = P.findIndex(p => p.slug === slug);
      const p = P[i];
      if (!p) { caseRoot.outerHTML = `<p class="csa-missing">This project could not be found. <a href="/work">See all work</a></p>`; return; }
      if (!caseRoot.children.length) {
        const c = T.caseStudy(P, i);
        caseRoot.innerHTML = c.main;
        const mob = $('[data-case-next-mobile]');
        if (mob) mob.innerHTML = c.nextMobile;
      }
      wireFallbacks(document); wireIcons(document);

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
