/**
 * Westcoast Rippers — script.js
 * Handles: sticky nav, mobile menu, gallery lightbox, scroll-spy
 */

(function () {
  'use strict';

  /* ── NAV: BACKGROUND ON SCROLL ──────────────────────── */
  const siteHeader = document.querySelector('.site-header');

  function updateNavBg() {
    if (window.scrollY > 60) {
      siteHeader.style.background = 'rgba(2, 8, 16, 0.97)';
    } else {
      siteHeader.style.background = 'rgba(2, 8, 16, 0.88)';
    }
  }

  window.addEventListener('scroll', updateNavBg, { passive: true });
  updateNavBg();


  /* ── MOBILE MENU ─────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isOpen);
      navLinks.classList.toggle('is-open', !isOpen);
      // Trap first nav link focus when opening
      if (!isOpen) {
        const firstLink = navLinks.querySelector('a, button');
        if (firstLink) firstLink.focus();
      }
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    // Close if clicking outside nav
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('is-open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ── GALLERY LIGHTBOX ────────────────────────────────── */
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lightboxClose   = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxBdrop   = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;

  // Track element that opened lightbox (for returning focus)
  let lightboxTrigger = null;

  function openLightbox(btn) {
    if (!lightbox || !lightboxImg) return;

    const imgSrc = btn.getAttribute('data-img');
    const caption = btn.getAttribute('data-caption') || '';
    const altText = btn.querySelector('img') ? btn.querySelector('img').getAttribute('alt') : '';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = altText;
    lightboxCaption.textContent = caption;

    lightbox.hidden = false;
    lightboxTrigger = btn;

    // Focus close button for keyboard users
    if (lightboxClose) lightboxClose.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';

    // Return focus to trigger
    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
  }

  // Open via gallery buttons
  document.querySelectorAll('.gallery-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(this);
    });
  });

  // Close via close button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Close via backdrop click
  if (lightboxBdrop) {
    lightboxBdrop.addEventListener('click', closeLightbox);
  }

  // Close via Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  // Trap focus inside lightbox when open
  if (lightbox) {
    lightbox.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }


  /* ── SMOOTH SCROLL OFFSET FOR FIXED NAV ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const navH = siteHeader ? siteHeader.offsetHeight : 68;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ── ACTIVE NAV LINK (SCROLL SPY) ───────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-link');

  function setActiveNavLink() {
    const navH = siteHeader ? siteHeader.offsetHeight : 68;
    let current = '';

    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - navH - 40) {
        current = section.id;
      }
    });

    navItems.forEach(function (link) {
      link.classList.remove('nav-link--active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('nav-link--active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  setActiveNavLink();

})();
