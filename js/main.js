/* ============================================================
   MindfulHaven — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ─── Helpers ──────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ─── Scroll-aware navbar ──────────────────────────────── */
  const navbar = $('#navbar');
  function handleNavScroll() {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ─── Hamburger / Mobile menu ──────────────────────────── */
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      if (open) mobileMenu.querySelector('a')?.focus();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on link click
    $$('a', mobileMenu).forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─── Search Overlay ───────────────────────────────────── */
  const searchBtn = $('#searchBtn');
  const searchOverlay = $('#searchOverlay');
  const searchClose = $('#searchClose');
  const searchInput = $('#searchInput');

  // Determine path prefix based on location
  const isSubPage = window.location.pathname.includes('/pages/');
  const root = isSubPage ? '../' : '';

  const searchData = [
    { title: 'What is Anxiety?', url: root + 'pages/mental-health-problems.html#anxiety', tag: 'Anxiety' },
    { title: 'Understanding Depression', url: root + 'pages/mental-health-problems.html#depression', tag: 'Depression' },
    { title: 'Managing Stress', url: root + 'pages/mental-health-problems.html#stress', tag: 'Stress' },
    { title: 'Sleep & Mental Health', url: root + 'pages/mental-health-problems.html#sleep', tag: 'Sleep' },
    { title: 'OCD — Obsessive Compulsive Disorder', url: root + 'pages/mental-health-problems.html#ocd', tag: 'OCD' },
    { title: 'PTSD — Post-Traumatic Stress Disorder', url: root + 'pages/mental-health-problems.html#ptsd', tag: 'PTSD' },
    { title: 'What is Mental Health?', url: root + 'pages/what-is-mental-health.html', tag: 'Information' },
    { title: 'Get Help Now', url: root + 'pages/get-help.html', tag: 'Support' },
    { title: 'Crisis Resources & Helplines', url: root + 'pages/get-help.html#crisis', tag: 'Crisis' },
    { title: 'Self-Help Guides', url: root + 'pages/get-help.html#self-help', tag: 'Self-Help' },
    { title: 'Mindfulness Techniques', url: root + 'pages/resources.html', tag: 'Mindfulness' },
    { title: 'Self-Harm — Information & Support', url: root + 'pages/self-harm.html', tag: 'Self-Harm' },
    { title: 'If You Self-Harm — Coping Alternatives', url: root + 'pages/self-harm.html#tab-me', tag: 'Self-Harm' },
    { title: 'Supporting Someone Who Self-Harms', url: root + 'pages/self-harm.html#tab-other', tag: 'Self-Harm' },
    { title: 'Understanding Self-Harm', url: root + 'pages/self-harm.html#tab-info', tag: 'Self-Harm' },
    { title: 'Self-Harm Treatment & Recovery (DBT, CBT)', url: root + 'pages/self-harm.html#treatment-heading', tag: 'Self-Harm' },
    { title: 'Eating Disorders', url: root + 'pages/mental-health-problems.html#eating', tag: 'Eating Disorders' },
    { title: 'Bipolar Disorder', url: root + 'pages/mental-health-problems.html#bipolar', tag: 'Bipolar' },
    { title: 'About MindfulHaven', url: root + 'pages/about.html', tag: 'About' },
    { title: 'Contact Us', url: root + 'pages/contact.html', tag: 'Contact' },
  ];

  function openSearch() {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 100);
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    const resultsEl = $('#searchResults');
    if (resultsEl) resultsEl.innerHTML = '';
  }

  searchBtn?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay?.classList.contains('open')) closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const resultsEl = $('#searchResults');
    if (!resultsEl) return;
    if (!q) { resultsEl.innerHTML = ''; return; }

    const hits = searchData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    );

    if (hits.length === 0) {
      resultsEl.innerHTML = '<p style="color:var(--color-text-muted);font-size:0.875rem;">No results found. Try a different term.</p>';
      return;
    }

    resultsEl.innerHTML = hits.map(h => `
      <a href="${h.url}" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;border-radius:0.5rem;border:1px solid var(--color-border);margin-bottom:0.5rem;text-decoration:none;color:var(--color-text);transition:background 0.2s;background:var(--color-bg);"
         onmouseover="this.style.background='var(--color-accent)'"
         onmouseout="this.style.background='var(--color-bg)'">
        <span style="font-size:0.75rem;font-weight:600;background:var(--color-accent);color:var(--color-primary-dark);padding:2px 8px;border-radius:99px;">${h.tag}</span>
        <span style="font-size:0.9rem;font-weight:500;">${h.title}</span>
      </a>
    `).join('');
  });

  /* ─── Fade-in on scroll (IntersectionObserver) ─────────── */
  const fadeEls = $$('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── Scroll to top ────────────────────────────────────── */
  const scrollTopBtn = $('#scrollTop');
  window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
  }, { passive: true });
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Donation amount selector ─────────────────────────── */
  const donateAmountBtns = $$('.donate-amount-btn');
  const donateCta = $('#donate-cta');
  let selectedAmount = '10';

  donateAmountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      donateAmountBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const amount = btn.dataset.amount;
      if (amount === 'custom') {
        selectedAmount = prompt('Enter your donation amount (£):') || '10';
        if (donateCta) donateCta.textContent = `💚 Donate £${selectedAmount} Today`;
      } else {
        selectedAmount = amount;
        if (donateCta) donateCta.textContent = `💚 Donate £${amount} Today`;
        if (donateCta) donateCta.setAttribute('aria-label', `Donate £${amount} to MindfulHaven`);
      }
    });
  });

  /* ─── Newsletter form ──────────────────────────────────── */
  const newsletterForm = $('#newsletterForm');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsletterEmail')?.value;
    if (!email) return;
    const btn = newsletterForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      btn.style.background = 'var(--color-primary-dark)';
    }
    setTimeout(() => {
      if (btn) {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
        btn.style.background = '';
      }
      newsletterForm.reset();
    }, 3000);
  });

  /* ─── Accordion ────────────────────────────────────────── */
  $$('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const isOpen = header.classList.contains('open');
      // Close all in same group
      const group = header.closest('[data-accordion-group]') || document;
      $$('.accordion-header', group).forEach(h => {
        h.classList.remove('open');
        h.setAttribute('aria-expanded', 'false');
        const body = h.nextElementSibling;
        if (body?.classList.contains('accordion-body')) {
          body.classList.remove('open');
        }
      });
      // Toggle clicked
      if (!isOpen) {
        header.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        const body = header.nextElementSibling;
        if (body?.classList.contains('accordion-body')) {
          body.classList.add('open');
        }
      }
    });
  });

  /* ─── Smooth scroll for anchor links ───────────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Resource filter (resources page) ─────────────────── */
  const resourceSearch = $('#resourceSearch');
  const resourceCards = $$('.resource-filterable');
  resourceSearch?.addEventListener('input', () => {
    const q = resourceSearch.value.trim().toLowerCase();
    resourceCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });

  /* ─── Contact form ─────────────────────────────────────── */
  const contactForm = $('#contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = '✓ Message Sent!';
      btn.disabled = true;
      btn.style.background = 'var(--color-primary-dark)';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    }
  });

  /* ─── Active nav link highlight ────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(currentPath)) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    }
  });

  /* ─── Condition card anchor scroll (problems page) ─────── */
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el) {
        const offset = 90;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  }

  /* ─── Subtle parallax on hero ──────────────────────────── */
  const heroSection = $('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroSection.style.backgroundPositionY = `${scrolled * 0.3}px`;
      }
    }, { passive: true });
  }

})();
