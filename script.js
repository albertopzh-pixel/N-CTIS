/* ═══════════════════════════════════════════════════════════
   NØCTIS — script.js
   Cinematic animations & interactions
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. LOADER ───────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1900);
  });
})();

/* ── 2. SCROLL PROGRESS ──────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
})();

/* ── 3. CUSTOM CURSOR ────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let fx = mx, fy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = `${mx}px`;
    cursor.style.top = `${my}px`;
  });

  // Smooth follower
  function animateFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = `${fx}px`;
    follower.style.top = `${fy}px`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverTargets = 'a, button, .magnetic, .brand-card, .collection-card, .merch-card, .gallery__item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor--hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor--hover');
    }
  });
})();

/* ── 4. STICKY NAV ───────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  // Mobile burger
  const burger = nav.querySelector('.nav__burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
      });
    });
  }

  // Smooth scroll for all anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── 5. REVEAL ON SCROLL ─────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-scale');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within groups
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal-up, .reveal-scale')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();
/* ── 6. COUNTER ANIMATION ────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat__num[data-target]');
  if (!counters.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ── 7. HERO PARTICLES ───────────────────────────────────── */
(function initHeroParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 80;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.6 ? 260 : 280, // violet spectrum
    });
  }

  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.vx += (dx / dist) * force * 0.04;
        p.vy += (dy / dist) * force * 0.04;
      }

      // Velocity damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.opacity})`;
      ctx.fill();

      // Glow
      ctx.shadowColor = `hsl(${p.hue}, 70%, 65%)`;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ── 8. CTA PARTICLES ────────────────────────────────────── */
(function initCtaParticles() {
  const canvas = document.getElementById('cta-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.4 + 0.05,
      angle: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.angle += 0.005;
      p.y -= p.speed;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) draw();
  });
  observer.observe(canvas);
})();

/* ── 9. MAGNETIC BUTTONS ─────────────────────────────────── */
(function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const strength = 0.25;
      btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

/* ── 10. PARALLAX ────────────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero__orb, .philosophy__ring');
  if (!orbs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = (i % 2 === 0) ? 0.08 : 0.12;
          orb.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 11. TESTIMONIALS INFINITE SCROLL PAUSE ──────────────── */
(function initTestimonialsInteraction() {
  const track = document.querySelector('.testimonials__track');
  if (!track) return;

  // Pause on hover is handled in CSS
  // Add touch swipe support
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const dx = startX - e.touches[0].pageX;
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ── 12. SHOWCASE PHONE TILT ─────────────────────────────── */
(function initShowcaseTilt() {
  const phoneSection = document.querySelector('.showcase');
  const phone = document.querySelector('.showcase__phone');
  if (!phoneSection || !phone) return;

  phoneSection.addEventListener('mousemove', (e) => {
    const rect = phone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    phone.style.transform = `
      rotateY(${dx * 10}deg)
      rotateX(${-dy * 6}deg)
      translateY(-4px)
    `;
  });

  phoneSection.addEventListener('mouseleave', () => {
    phone.style.transform = '';
  });
})();
/* ── 13. MOUSE FOLLOW GLOW ───────────────────────────────── */
(function initMouseGlow() {
  const sections = document.querySelectorAll('.brands, .collections, .merch');

  sections.forEach(section => {
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      section.style.setProperty('--mouse-x', `${x}px`);
      section.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();

/* ── 14. GALLERY HOVER EFFECTS ───────────────────────────── */
(function initGalleryHover() {
  const items = document.querySelectorAll('.gallery__item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(other => {
        if (other !== item) {
          other.style.opacity = '0.5';
          other.style.filter = 'saturate(0.5)';
        }
      });
    });

    item.addEventListener('mouseleave', () => {
      items.forEach(other => {
        other.style.opacity = '';
        other.style.filter = '';
      });
    });
  });
})();

/* ── 15. PAGE ENTRANCE ───────────────────────────────────── */
(function initPageEntrance() {
  // Hero elements stagger in after loader
  const heroElements = document.querySelectorAll('.hero .reveal-up, .hero .reveal-scale');

  setTimeout(() => {
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('in-view');
      }, 1950 + i * 120);
    });
  }, 100);
})();

/* ── 16. SMOOTH SECTION TRANSITIONS ─────────────────────── */
(function initSectionTransitions() {
  // Add blur gradient entrance to each section
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => observer.observe(s));
})();

/* ── 17. SCROLL-BASED NAV ACTIVE STATE ───────────────────── */
(function initNavActive() {
  const navLinks = document.querySelectorAll('.nav__links a');
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? '#fff' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── 18. BRAND CARD GLOW TRAIL ───────────────────────────── */
(function initCardGlowTrail() {
  const cards = document.querySelectorAll('.brand-card, .collection-card, .merch-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--glow-x', `${x}%`);
      card.style.setProperty('--glow-y', `${y}%`);
    });
  });
})();

/* ── 19. KEYBOARD ACCESSIBILITY ──────────────────────────── */
(function initKeyboardFocus() {
  // Remove custom cursor when using keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
})();

/* ── 20. PHONE ART ANIMATION ─────────────────────────────── */
(function initPhoneArt() {
  // Add floating particles to phone arts dynamically
  const artEls = document.querySelectorAll('.hero__phone-art, .showcase__art');

  artEls.forEach(art => {
    for (let i = 0; i < 6; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: rgba(168, 85, 247, ${Math.random() * 0.6 + 0.2});
        border-radius: 50%;
        top: ${Math.random() * 80 + 10}%;
        left: ${Math.random() * 80 + 10}%;
        animation: particle-drift ${Math.random() * 3 + 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
        box-shadow: 0 0 8px rgba(139, 92, 246, 0.7);
        pointer-events: none;
      `;
      art.appendChild(dot);
    }
  });
})();

/* ── 21. PERFORMANCE: RAF SCROLL ─────────────────────────── */
(function optimizeScrollListeners() {
  // Batch all scroll handlers
  let scrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    scrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        // Dispatch custom event for scroll-dependent modules
        window.dispatchEvent(new CustomEvent('noctis:scroll', { detail: { y: scrollY } }));
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── 22. DYNAMIC YEAR IN FOOTER ──────────────────────────── */
(function updateFooterYear() {
  const yearEls = document.querySelectorAll('.footer__bottom span');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = el.textContent.replace('2024', currentYear);
  });
})();

/* ── INIT MESSAGE ────────────────────────────────────────── */
console.log(
  '%cNØCTIS\n%cLa oscuridad también tiene estilo.',
  'color: #8B5CF6; font-family: sans-serif; font-size: 24px; font-weight: 800;',
  'color: #A855F7; font-family: sans-serif; font-size: 14px;'
);
/* ═══════════════════════════════════════════════════════════
   NØCTIS — script.js  (continuación)
   Tabs · FAQ · Newsletter · Cart Toast · Announce Bar
   Card Glow · GSAP ScrollTrigger integration
   ═══════════════════════════════════════════════════════════ */

/* ── A. ANNOUNCEMENT BAR ─────────────────────────────────── */
(function initAnnounceBar() {
  const bar   = document.getElementById('announce-bar');
  const close = document.getElementById('announce-close');
  if (!bar || !close) return;

  if (sessionStorage.getItem('noctis_announce_hidden')) {
    bar.style.display = 'none';
    return;
  }

  close.addEventListener('click', () => {
    bar.style.maxHeight = bar.offsetHeight + 'px';
    bar.style.overflow  = 'hidden';
    bar.style.transition = 'max-height 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s';
    requestAnimationFrame(() => {
      bar.style.maxHeight = '0';
      bar.style.opacity   = '0';
    });
    bar.addEventListener('transitionend', () => {
      bar.style.display = 'none';
    }, { once: true });
    sessionStorage.setItem('noctis_announce_hidden', '1');
  });
})();

/* ── B. PRODUCT TABS ─────────────────────────────────────── */
(function initProductTabs() {
  const btns   = document.querySelectorAll('.tabs__btn');
  const panels = document.querySelectorAll('.tabs__panel');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(`tab-${target}`);
      if (panel) {
        panel.classList.add('active');

        const cards = panel.querySelectorAll('.reveal-up');
        cards.forEach((card, i) => {
          card.classList.remove('in-view');
          setTimeout(() => card.classList.add('in-view'), i * 80 + 60);
        });
      }
    });
  });
})();

/* ── C. FAQ ACCORDION ────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();

/* ── D. NEWSLETTER FORM ──────────────────────────────────── */
(function initNewsletter() {
  const form    = document.getElementById('newsletter-form');
  const success = document.getElementById('newsletter-success');
  const emailEl = document.getElementById('newsletter-email');
  if (!form || !success || !emailEl) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();

    if (!isValidEmail(email)) {
      emailEl.style.borderColor = 'rgba(239,68,68,0.6)';
      emailEl.focus();
      setTimeout(() => { emailEl.style.borderColor = ''; }, 2000);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = '...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 900);
  });
})();

/* ── E. CART TOAST ───────────────────────────────────────── */
(function initCartToast() {
  const toast   = document.getElementById('cart-toast');
  const undoBtn = document.getElementById('cart-toast-undo');
  const addBtns = document.querySelectorAll('.product-card__add');
  if (!toast || !addBtns.length) return;

  let hideTimer = null;
  let lastCard  = null;

  function showToast(cardName) {
    const msgEl = toast.querySelector('.cart-toast__msg');
    if (msgEl) msgEl.textContent = `"${cardName}" agregado al carrito`;

    toast.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;
      lastCard = card;

      const name = card.querySelector('.product-card__name')?.textContent || 'Producto';

      btn.style.transform = 'scale(0.85)';
      setTimeout(() => { btn.style.transform = ''; }, 300);

      showToast(name);
    });
  });

  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      clearTimeout(hideTimer);
    });
  }
})();

/* ── F. CARD GLOW TRAIL (all cards) ─────────────────────── */
(function initAllCardGlow() {
  const cards = document.querySelectorAll(
    '.brand-card, .collection-card, .merch-card, .testimonial-card, .product-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--glow-x', `${x}%`);
      card.style.setProperty('--glow-y', `${y}%`);
    });
  });
})();
/* ── G. GSAP SCROLL ANIMATIONS (when available) ──────────── */
(function initGSAP() {
  function tryGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(tryGSAP, 200);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      const accent = heroTitle.querySelector('.hero__title-accent');
      if (accent) {
        gsap.fromTo(accent,
          { textShadow: '0 0 0px transparent' },
          {
            textShadow: '0 0 60px rgba(139,92,246,0.6)',
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            }
          }
        );
      }
    }

    const philoBg = document.querySelector('.philosophy__bg');
    if (philoBg) {
      gsap.to('.philosophy__ring--1', {
        y: -80,
        scrollTrigger: {
          trigger: '.philosophy',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      gsap.to('.philosophy__ring--2', {
        y: -40,
        scrollTrigger: {
          trigger: '.philosophy',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });
    }

    const steps = document.querySelectorAll('.process__step');
    if (steps.length) {
      gsap.fromTo(steps,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process__timeline',
            start: 'top 80%',
          }
        }
      );
    }

    const ctaLogo = document.querySelector('.cta-final__logo');
    if (ctaLogo) {
      gsap.fromTo(ctaLogo,
        { opacity: 0, scale: 1.3, filter: 'blur(12px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.cta-final',
            start: 'top 70%',
          }
        }
      );
    }

    const ctaTitle = document.querySelector('.cta-final__title');
    if (ctaTitle) {
      gsap.fromTo(ctaTitle,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: '.cta-final',
            start: 'top 70%',
          }
        }
      );
    }

    const galleryItems = document.querySelectorAll('.gallery__item');
    galleryItems.forEach((item, i) => {
      const dir = i % 2 === 0 ? 30 : -30;
      gsap.fromTo(item,
        { opacity: 0, y: dir },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
          }
        }
      );
    });

    const merchCards = document.querySelectorAll('.merch-card');
    if (merchCards.length) {
      gsap.fromTo(merchCards,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.merch__grid',
            start: 'top 82%',
          }
        }
      );
    }

    const brandCards = document.querySelectorAll('.brand-card');
    if (brandCards.length) {
      gsap.fromTo(brandCards,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.brands__grid',
            start: 'top 82%',
          }
        }
      );
    }

    const showcasePhone = document.querySelector('.showcase__phone');
    if (showcasePhone) {
      gsap.fromTo(showcasePhone,
        { opacity: 0, y: 60, rotateX: 12, scale: 0.88 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.showcase',
            start: 'top 72%',
          }
        }
      );
    }

    gsap.to('body', {
      '--bg-shift': '1',
      scrollTrigger: {
        trigger: '.cta-final',
        start: 'top 60%',
        end: 'top 20%',
        scrub: true,
      }
    });
  }

  tryGSAP();
})();

/* ── H. HERO PHONE MOUSE FOLLOW ──────────────────────────── */
(function initHeroPhoneFollow() {
  const hero  = document.getElementById('hero');
  const phone = document.querySelector('.hero__phone');
  if (!hero || !phone) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;
    targetX = dx * 6;
    targetY = dy * 4;
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function animatePhone() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    phone.style.transform = `
      translateY(${Math.sin(Date.now() / 2000) * 8}px)
      rotate(${-2 + currentX * 0.3}deg)
      rotateY(${currentX}deg)
      rotateX(${-currentY}deg)
    `;
    requestAnimationFrame(animatePhone);
  }
  animatePhone();
})();

/* ── I. LENIS SMOOTH SCROLL (native fallback) ────────────── */
(function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - 70;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });
})();

/* ── J. SCROLL REVEAL RE-TRIGGER ─────────────────────────── */
(function reinitRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  function observeNew() {
    document.querySelectorAll('.reveal-up:not(.in-view)').forEach(el => {
      observer.observe(el);
    });
  }

  setInterval(observeNew, 800);
})();

/* ── K. PRODUCT CARD QUICK-VIEW HINT ─────────────────────── */
(function initProductCardHint() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const phone = card.querySelector('.product-card__phone');
      if (phone) {
        phone.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s';
      }
    });
  });
})();

/* ── L. TRUST BADGES SEQUENTIAL ENTRANCE ─────────────────── */
(function initTrustBadges() {
  const badges = document.querySelectorAll('.trust-badge');
  if (!badges.length) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      badges.forEach((badge, i) => {
        setTimeout(() => {
          badge.style.transition = 'opacity 0.6s, transform 0.6s cubic-bezier(0.22,1,0.36,1)';
          badge.style.opacity = '0.55';
          badge.style.transform = 'translateY(0)';
        }, i * 100);
      });
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  badges.forEach(b => {
    b.style.opacity = '0';
    b.style.transform = 'translateY(20px)';
  });

  const section = document.querySelector('.trust-badges');
  if (section) observer.observe(section);
})();

/* ── M. MARQUEE REVERSE ON DIRECTION CHANGE ──────────────── */
(function initMarqueeEnhance() {
  const strip = document.querySelector('.marquee-strip__inner');
  if (!strip) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const dir = window.scrollY > lastScrollY ? 1 : -1;
    strip.style.animationDuration = dir === 1 ? '20s' : '28s';
    lastScrollY = window.scrollY;
  }, { passive: true });
})();

/* ── N. FOOTER LINKS STAGGER ─────────────────────────────── */
(function initFooterLinks() {
  const footerCols = document.querySelectorAll('.footer__col');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const links = entry.target.querySelectorAll('a');
        links.forEach((link, i) => {
          link.style.opacity = '0';
          link.style.transform = 'translateY(10px)';
          link.style.transition = `opacity 0.5s ${i * 0.06}s, transform 0.5s ${i * 0.06}s`;
          requestAnimationFrame(() => {
            link.style.opacity = '';
            link.style.transform = '';
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  footerCols.forEach(col => observer.observe(col));
})();

/* ── O. SECTION BACKGROUND GRADIENT SHIFT ────────────────── */
(function initBgGradientShift() {
  const sections = [
    '.hero', '.brands', '.collections', '.product-tabs',
    '.showcase', '.process', '.gallery', '.merch',
    '.philosophy', '.testimonials', '.newsletter', '.cta-final'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const glowEl = document.querySelector('.hero__orb--1');
        if (glowEl) {
          if (el.classList.contains('collections') || el.classList.contains('product-tabs')) {
            glowEl.style.background = 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)';
          } else if (el.classList.contains('cta-final')) {
            glowEl.style.background = 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)';
          } else {
            glowEl.style.background = 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)';
          }
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) observer.observe(el);
  });
})();

/* ── P. HERO STATS DECIMAL FORMATTING ────────────────────── */
(function formatStatDecimals() {
  const ratingStat = document.querySelector('.stat__num[data-target="49"]');
  if (!ratingStat) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      let val = 0;
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        val = 4.9 * eased;
        ratingStat.textContent = val.toFixed(1);
        if (t < 1) requestAnimationFrame(update);
        else ratingStat.textContent = '4.9';
      }
      requestAnimationFrame(update);
      ratingStat.removeAttribute('data-target');
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(ratingStat);
})();

/* ── DONE ────────────────────────────────────────────────── */
console.log('%cNØCTIS Scripts loaded ✓', 'color:#A855F7;font-weight:700;font-size:12px;');


/* ═══════════════════════════════════════════════════════════
   NØCTIS — script.js  PARTE FINAL
   Announce bar nav sync · smart anchor scroll · loader hide bar
   ripple on buttons · viewport resize handler · perf tweaks
   ═══════════════════════════════════════════════════════════ */

/* ── Q. ANNOUNCE BAR ↔ NAV SYNC ─────────────────────────── */
(function syncAnnounceBarWithNav() {
  const bar   = document.getElementById('announce-bar');
  const close = document.getElementById('announce-close');
  const nav   = document.getElementById('nav');
  if (!bar || !close || !nav) return;

  function collapseBar() {
    bar.style.maxHeight = '0';
    bar.style.opacity   = '0';
    bar.style.padding   = '0';
    document.body.classList.add('announce-hidden');
    setTimeout(() => {
      bar.style.display = 'none';
    }, 500);
    sessionStorage.setItem('noctis_announce_hidden', '1');
  }

  if (sessionStorage.getItem('noctis_announce_hidden')) {
    bar.style.display = 'none';
    document.body.classList.add('announce-hidden');
  }

  const newClose = close.cloneNode(true);
  close.parentNode.replaceChild(newClose, close);
  newClose.addEventListener('click', collapseBar);
})();

/* ── R. SMART ANCHOR SCROLL (offset aware) ───────────────── */
(function initSmartAnchorScroll() {
  function getNavOffset() {
    const nav  = document.getElementById('nav');
    const bar  = document.getElementById('announce-bar');
    const navH = nav  ? nav.offsetHeight  : 70;
    const barH = (bar && bar.style.display !== 'none') ? bar.offsetHeight : 0;
    return navH + barH + 16;
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const fresh = link.cloneNode(true);
    link.parentNode.replaceChild(fresh, link);

    fresh.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

      const burger = document.querySelector('.nav__burger');
      const mobileMenu = document.getElementById('mobile-menu');
      if (burger && mobileMenu && !mobileMenu.hidden) {
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
      }
    });
  });
})();

/* ── S. BUTTON RIPPLE EFFECT ─────────────────────────────── */
(function initRipple() {
  const btns = document.querySelectorAll('.btn--primary, .btn--outline, .btn--ghost');

  btns.forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width:  ${size}px;
        height: ${size}px;
        left:   ${x}px;
        top:    ${y}px;
        background: rgba(255,255,255,0.12);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple-expand 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
      `;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `
      @keyframes ripple-expand {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
})();

/* ── T. VIEWPORT RESIZE HANDLER ──────────────────────────── */
(function initResizeHandler() {
  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ['particles-canvas', 'cta-particles'].forEach(id => {
        const c = document.getElementById(id);
        if (c) {
          c.width  = c.offsetWidth;
          c.height = c.offsetHeight;
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  }, { passive: true });
})();

/* ── U. HERO STATS — COMMA FORMAT ───────────────────────── */
(function formatStatNumbers() {
  const stats = document.querySelectorAll('.stat__num[data-target]');
  stats.forEach(stat => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          if (stat.textContent === String(stat.dataset.target)) {
            stat.textContent = stat.dataset.target >= 10 ? stat.dataset.target : stat.dataset.target;
          }
        }, 2000);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(stat);
  });
})();

/* ── V. LAZY PARTICLE INIT ───────────────────────────────── */
(function lazyCtaParticles() {
  const canvas = document.getElementById('cta-particles');
  if (!canvas) return;

  let started = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      canvas.dispatchEvent(new Event('noctis:start-particles'));
    }
  }, { threshold: 0.1 });

  observer.observe(canvas);
})();

/* ── W. SCROLL-LINKED HERO FADE OUT ─────────────────────── */
(function initHeroFadeOnScroll() {
  const heroContent = document.querySelector('.hero__content');
  const heroStats   = document.querySelector('.hero__stats');
  if (!heroContent) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const heroH = document.querySelector('.hero')?.offsetHeight || 800;
      const progress = Math.min(y / (heroH * 0.4), 1);

      heroContent.style.opacity    = String(1 - progress * 0.6);
      heroContent.style.transform  = `translateY(${progress * -30}px)`;
      if (heroStats) {
        heroStats.style.opacity   = String(1 - progress * 0.8);
      }
      ticking = false;
    });
  }, { passive: true });
})();

/* ── X. PRODUCT CARD MOUSEMOVE 3D MICRO-TILT ────────────── */
(function initProductCard3D() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `
        perspective(600px)
        rotateX(${-dy * 4}deg)
        rotateY(${dx * 4}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.4s, box-shadow 0.4s';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s, border-color 0.4s, box-shadow 0.4s';
    });
  });
})();

/* ── Y. TESTIMONIALS AUTOPLAY DOTS (visual indicator) ────── */
(function initTestimonialProgress() {
  const track = document.querySelector('.testimonials__track-wrap');
  if (!track) return;

  const progress = document.createElement('div');
  progress.style.cssText = `
    width: 0%;
    height: 1px;
    background: linear-gradient(90deg, #8B5CF6, #A855F7);
    margin: 1.5rem auto 0;
    max-width: 120px;
    border-radius: 1px;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(139,92,246,0.4);
  `;
  track.parentNode.insertBefore(progress, track.nextSibling);

  const duration = 30000;
  let start = performance.now();
  let paused = false;

  track.addEventListener('mouseenter', () => { paused = true; });
  track.addEventListener('mouseleave', () => {
    paused = false;
    start = performance.now() - (parseFloat(progress.style.width) / 100 * duration);
  });

  function tick(now) {
    if (!paused) {
      const elapsed = (now - start) % duration;
      progress.style.width = `${(elapsed / duration) * 100}%`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ── Z. FINAL PERFORMANCE: PASSIVE WHEEL ─────────────────── */
(function improveScrollPerf() {
  window.addEventListener('wheel',      () => {}, { passive: true });
  window.addEventListener('touchstart', () => {}, { passive: true });
  window.addEventListener('touchmove',  () => {}, { passive: true });
})();

/* ── GLOBAL ERROR BOUNDARY ───────────────────────────────── */
window.addEventListener('error', (e) => {
  console.warn('[NØCTIS]', e.message, e.filename, e.lineno);
});

/* ── DONE — full log ─────────────────────────────────────── */
console.log(
  '%c\n' +
  '  ███╗   ██╗ ██████╗  ██████╗████████╗██╗███████╗\n' +
  '  ████╗  ██║██╔═══██╗██╔════╝╚══██╔══╝██║██╔════╝\n' +
  '  ██╔██╗ ██║██║   ██║██║        ██║   ██║███████╗\n' +
  '  ██║╚██╗██║██║   ██║██║        ██║   ██║╚════██║\n' +
  '  ██║ ╚████║╚██████╔╝╚██████╗   ██║   ██║███████║\n' +
  '  ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝   ╚═╝   ╚═╝╚══════╝\n\n' +
  '  La oscuridad también tiene estilo.\n',
  'color: #8B5CF6; font-family: monospace; font-size: 10px; line-height: 1.4;'
);