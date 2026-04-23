/* ============================================================
   CYPRESS GULF COAST ROOFING & GUTTERS
   Main JavaScript
   ============================================================ */

'use strict';

// ============================================================
// NAVIGATION — sticky + mobile menu
// ============================================================
(function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Highlight active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ============================================================
// SCROLL REVEAL — Intersection Observer
// ============================================================
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ============================================================
// COUNTER ANIMATIONS — count up when in view
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOut(progress);
      const display = Number.isInteger(target) ? Math.round(value) : value.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ============================================================

// ============================================================
// SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const root = getComputedStyle(document.documentElement);
    const emergencyH = parseInt(root.getPropertyValue('--emergency-height')) || 36;
    const navH = parseInt(root.getPropertyValue('--nav-height')) || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - emergencyH - navH - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ============================================================
// FORM SUBMISSION (contact form → Formspree → sales@roofsbycypress.com)
// ============================================================
(function initContactForm() {
  const form = document.querySelector('.js-contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      const msg = document.createElement('div');
      msg.style.cssText = 'padding:1rem 1.5rem;border-radius:8px;margin-top:1rem;font-weight:600;text-align:center;';
      if (res.ok) {
        msg.style.cssText += 'background:#e8f5e9;border:1px solid #4caf50;color:#2e7d32;';
        msg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We\'ll be in touch within 24 hours.';
        form.reset();
      } else {
        msg.style.cssText += 'background:#ffebee;border:1px solid #ef5350;color:#c62828;';
        msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please call us at (504) 301-5046.';
      }
      form.appendChild(msg);
      btn.innerHTML = originalText;
      btn.disabled = false;
      setTimeout(() => msg.remove(), 8000);
    })
    .catch(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      alert('Network error. Please call us at (504) 301-5046.');
    });
  });
})();

// ============================================================
// YEAR in footer
// ============================================================
document.querySelectorAll('.js-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
