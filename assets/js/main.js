
(() => {
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  document.documentElement.classList.add('js');

  const header = $('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 14);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const hero = $('.hero') || $('.pagehero');
  const onParallax = () => {
    if (!hero) return;
    const y = Math.min(140, window.scrollY * 0.25);
    hero.style.backgroundPosition = `center calc(50% + ${y}px)`;
  };
  window.addEventListener('scroll', onParallax, {passive:true});
  onParallax();

  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('#site-nav a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const els = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }
  }, {threshold: 0.12});
  els.forEach(el => io.observe(el));

  const cards = $$('.card');
  const isFinePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  if (isFinePointer) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const rx = (-y * 5).toFixed(2);
        const ry = (x * 6).toFixed(2);
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  const form = $('#lead-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`New enquiry: ${data.get('service') || 'General'}`);
      const lines = [
        `Name: ${data.get('name') || ''}`,
        `Phone: ${data.get('phone') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Service: ${data.get('service') || ''}`,
        `Address/Suburb: ${data.get('address') || ''}`,
        `Timeline: ${data.get('timeline') || ''}`,
        ``,
        `Message:`,
        `${data.get('message') || ''}`,
      ];
      const body = encodeURIComponent(lines.join('\n'));
      const to = form.getAttribute('data-to') || 'contact@permitsolutions.com';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      const ok = $('#form-success');
      if (ok) ok.style.display = 'block';
    });
  }
})();
