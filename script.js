{
  const root = document.documentElement;

  // Light / dark theme toggle (top right)
  const themeBtn = document.querySelector('.theme-btn');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
  const label = () => {
    if (!themeBtn) return;
    const next = current() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    themeBtn.title = 'Switch to ' + next + ' mode';
  };
  if (themeBtn) {
    label();
    themeBtn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
    if (media.addEventListener) media.addEventListener('change', label);
  }

  // Show the name in the header only after the big name in the hero scrolls away
  const header = document.querySelector('.site-header');
  const heroName = document.getElementById('hero-name');
  if (header && heroName && 'IntersectionObserver' in window) {
    const nameWatch = new IntersectionObserver(([en]) => {
      header.classList.toggle('at-top', en.isIntersecting);
    }, { rootMargin: '-64px 0px 0px 0px' });
    nameWatch.observe(heroName);
  } else if (header) {
    header.classList.remove('at-top');
  }

  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (btn && nav) {
    const close = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; };
    btn.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); btn.focus(); } });
  }

  // Infinite carousels (updates and projects).
  // The cards are copied once before and once after the real set. When a scroll settles inside
  // a copy, the track jumps by exactly one set width, so moving forward or back never ends.
  document.querySelectorAll('.carousel[data-for]').forEach(wrap => {
    const track = document.getElementById(wrap.dataset.for);
    const prev = wrap.querySelector(':scope > .prev');
    const next = wrap.querySelector(':scope > .next');
    if (!track || !prev || !next) return;
    const originals = [...track.children];
    if (originals.length < 2) return;

    const makeClone = li => {
      const c = li.cloneNode(true);
      c.removeAttribute('id');
      c.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('inert', '');
      c.dataset.clone = '';
      return c;
    };
    const before = originals.map(makeClone);
    const after = originals.map(makeClone);
    track.prepend(...before);
    track.append(...after);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let setWidth = 0;
    const measure = () => { setWidth = after[0].offsetLeft - originals[0].offsetLeft; };
    const jump = left => {
      const snap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';
      track.scrollLeft = left;
      void track.offsetWidth;
      track.style.scrollSnapType = snap;
    };
    const normalize = () => {
      if (!setWidth) return;
      if (track.scrollLeft < setWidth * 0.5) jump(track.scrollLeft + setWidth);
      else if (track.scrollLeft >= setWidth * 1.5) jump(track.scrollLeft - setWidth);
    };
    const step = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return originals[0].getBoundingClientRect().width + gap;
    };
    const move = dir => {
      normalize();
      track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
    };

    measure();
    jump(setWidth);

    next.addEventListener('click', () => move(1));
    prev.addEventListener('click', () => move(-1));

    let settle;
    if ('onscrollend' in window) track.addEventListener('scrollend', normalize);
    track.addEventListener('scroll', () => { clearTimeout(settle); settle = setTimeout(normalize, 140); }, { passive: true });

    const carouselWatch = new ResizeObserver(() => {
      const offset = setWidth ? (track.scrollLeft % setWidth) / setWidth : 0;
      measure();
      jump(setWidth + offset * setWidth);
    });
    carouselWatch.observe(track);
  });

  // Project thumbnails: show a generated image when one exists in assets/projects/, otherwise keep the drawn picture
  document.querySelectorAll('.proj-pic .thumb').forEach(img => {
    const drop = () => img.remove();
    if (img.complete && img.naturalWidth === 0) drop();
    img.addEventListener('error', drop);
  });

  // Hide the portrait slot until a real photo is added at assets/photo.jpg
  const portrait = document.getElementById('portrait');
  if (portrait) {
    const img = portrait.querySelector('img');
    if (img.complete && img.naturalWidth === 0) portrait.remove();
    img.addEventListener('error', () => portrait.remove());
  }

  // Mark the nav link for the section in view
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => {
          if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  // Local time in the Philippines for the contact section
  const clock = document.getElementById('local-time');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila' });
    const tick = () => { const now = new Date(); clock.textContent = fmt.format(now); clock.dateTime = now.toISOString(); };
    tick();
    setInterval(tick, 30000);
  }

  // Copy email
  document.querySelectorAll('[data-copy]').forEach(b => {
    const status = b.parentElement.querySelector('.copy-status');
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        b.textContent = 'Copied';
        if (status) status.textContent = 'Email address copied';
      } catch (e) {
        if (status) status.textContent = 'Copy was blocked. Select the address instead.';
      }
      setTimeout(() => { b.textContent = 'Copy address'; if (status) status.textContent = ''; }, 2500);
    });
  });
}
