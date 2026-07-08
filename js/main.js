/**
 * ============================================================
 * EKDANT PAINTING CONTRACTOR - Main JavaScript
 * Dattu Painting And Waterproofing Services, Nashik
 * ============================================================
 */

'use strict';

/* ============================================================
   LOADING SCREEN
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => { loadingScreen.remove(); }, 700);
    }
    // Trigger hero image animation
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) heroBg.classList.add('loaded');
  }, 2200);
});

/* ============================================================
   NAVBAR: SCROLL BEHAVIOUR + ACTIVE LINK
   ============================================================ */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id], div[id="waterproofing"]');

const onScroll = () => {
  // Sticky nav
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Back to top
  const btt = document.getElementById('back-to-top');
  if (btt) {
    if (window.scrollY > 400) btt.classList.add('visible');
    else btt.classList.remove('visible');
  }
};

window.addEventListener('scroll', onScroll, { passive: true });

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* Back to top */
const bttBtn = document.getElementById('back-to-top');
if (bttBtn) {
  bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   SCROLL REVEAL ANIMATION (IntersectionObserver)
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: show all
  revealElements.forEach(el => el.classList.add('active'));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
const counters = document.querySelectorAll('[id^="counter-"]');

const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString('en-IN');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }
  }, step);
};

if ('IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        animateCounter(counter);
        statsObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => statsObserver.observe(c));
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });

  // Keyboard support
  question.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      question.click();
    }
  });
});

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
const track     = document.getElementById('testimonials-track');
const prevBtn   = document.getElementById('slider-prev');
const nextBtn   = document.getElementById('slider-next');
const dotsWrap  = document.getElementById('slider-dots');

if (track) {
  const cards        = track.querySelectorAll('.testimonial-card');
  let current        = 0;
  let autoplayTimer  = null;
  let cardWidth;

  const getPerPage = () => {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const getMaxIndex = () => Math.ceil(cards.length / getPerPage()) - 1;

  const updateDots = () => {
    const dots = dotsWrap ? dotsWrap.querySelectorAll('.slider-dot') : [];
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current);
    });
  };

  const goTo = (index) => {
    const perPage  = getPerPage();
    const maxIndex = getMaxIndex();
    current = Math.max(0, Math.min(index, maxIndex));
    const offset = current * (100 / perPage) * perPage;
    // Use pixel-based translation
    const slideWidth = track.parentElement.offsetWidth;
    const gapOffset  = current * 24; // 1.5rem gap in pixels
    track.style.transform = `translateX(calc(-${current * (100 / perPage)}% - ${gapOffset}px))`;
    updateDots();
  };

  const next = () => goTo(current >= getMaxIndex() ? 0 : current + 1);
  const prev = () => goTo(current <= 0 ? getMaxIndex() : current - 1);

  const startAutoplay = () => { autoplayTimer = setInterval(next, 5000); };
  const stopAutoplay  = () => { clearInterval(autoplayTimer); };

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); stopAutoplay(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); stopAutoplay(); startAutoplay(); });

  // Dot clicks
  if (dotsWrap) {
    dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); stopAutoplay(); startAutoplay(); });
    });
  }

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
    }
  }, { passive: true });

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Keyboard
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  window.addEventListener('resize', () => goTo(current));
  startAutoplay();
}

/* ============================================================
   GALLERY: FILTER TABS
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    serviceCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
        card.style.opacity  = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity  = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ============================================================
   GALLERY TABS + LIGHTBOX
   ============================================================ */
const galleryTabs   = document.querySelectorAll('.gallery-tab');
const galleryItems  = document.querySelectorAll('.gallery-item[data-gallery]');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

galleryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    galleryTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const filter = tab.dataset.gallery;
    galleryItems.forEach(item => {
      item.style.display = (filter === 'all' || item.dataset.gallery === filter) ? 'block' : 'none';
    });
  });
});

// Lightbox open
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img && lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }
  });

  item.addEventListener('keydown', e => {
    if (e.key === 'Enter') item.click();
  });
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   BEFORE / AFTER SLIDER
   ============================================================ */
const baSlider = document.getElementById('ba-slider');
const baAfter  = document.getElementById('ba-after');
const baHandle = document.getElementById('ba-handle');

if (baSlider && baAfter && baHandle) {
  let isDragging = false;

  const setPosition = (x) => {
    const rect = baSlider.getBoundingClientRect();
    let pct = (x - rect.left) / rect.width;
    pct = Math.max(0.05, Math.min(0.95, pct));
    const insetPct = (1 - pct) * 100;
    baAfter.style.clipPath = `inset(0 0 0 ${pct * 100}%)`;
    baHandle.style.left = `${pct * 100}%`;
  };

  // Mouse events
  baSlider.addEventListener('mousedown', (e) => { isDragging = true; setPosition(e.clientX); });
  window.addEventListener('mousemove',  (e) => { if (isDragging) setPosition(e.clientX); });
  window.addEventListener('mouseup',    ()  => { isDragging = false; });

  // Touch events
  baSlider.addEventListener('touchstart', (e) => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',   (e) => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',    ()  => { isDragging = false; });
}

/* ============================================================
   QUOTE FORM SUBMISSION
   ============================================================ */
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('quote-submit-btn');
    const name    = document.getElementById('q-name').value.trim();
    const phone   = document.getElementById('q-phone').value.trim();
    const service = document.getElementById('q-service').value;

    if (!name) { alert('Please enter your full name.'); return; }
    if (!phone || !/^[\d\s\+\-]{8,15}$/.test(phone)) { alert('Please enter a valid phone number.'); return; }
    if (!service) { alert('Please select a service.'); return; }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;" aria-hidden="true"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-dasharray="57" stroke-dashoffset="57"><animate attributeName="stroke-dashoffset" from="57" to="0" dur="0.8s" fill="freeze"/></path></svg>
      Submitting...
    `;

    // Simulate API (replace with actual backend endpoint)
    await new Promise(r => setTimeout(r, 1500));

    // WhatsApp redirect with prefilled message
    const email   = document.getElementById('q-email').value.trim();
    const address = document.getElementById('q-address').value.trim();
    const message = document.getElementById('q-message').value.trim();

    const wa = `Hello Dattu Painting! My name is ${name}. I need a quote for: ${service}.${address ? ` Location: ${address}.` : ''}${message ? ` Details: ${message}` : ''} Please contact me on ${phone}.`;

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Quote Sent! Redirecting...`;
    submitBtn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';

    setTimeout(() => {
      window.open(`https://wa.me/919823125583?text=${encodeURIComponent(wa)}`, '_blank');
      quoteForm.reset();
      submitBtn.innerHTML = `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Submit Quote Request`;
      submitBtn.style.background = '';
    }, 1500);
  });
}

/* ============================================================
   PARALLAX HERO
   ============================================================ */
const heroBg = document.getElementById('hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

/* ============================================================
   PAINT BRUSH HOVER ON SERVICE CARDS
   ============================================================ */
document.querySelectorAll('.service-card, .why-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease';
  });
});

/* ============================================================
   QUICK QUOTE POPUP (auto-show after 15s if not dismissed)
   ============================================================ */
let popupShown = sessionStorage.getItem('popup_shown');

if (!popupShown) {
  setTimeout(() => {
    const popup = document.getElementById('quote-popup');
    if (popup) {
      popup.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }, 15000);
}

const popupClose = document.querySelectorAll('.popup-close, #popup-overlay');
popupClose.forEach(btn => {
  btn && btn.addEventListener('click', () => {
    const popup = document.getElementById('quote-popup');
    if (popup) {
      popup.classList.remove('open');
      document.body.style.overflow = '';
      sessionStorage.setItem('popup_shown', '1');
    }
  });
});

/* ============================================================
   LAZY IMAGE LOADING (native + custom fallback)
   ============================================================ */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported - already added via loading="lazy"
} else {
  // Polyfill for older browsers
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => lazyObserver.observe(img));
}

/* ============================================================
   PAINT RIPPLE EFFECT ON BUTTON CLICK
   ============================================================ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const ripple = document.createElement('span');

    ripple.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      transform: scale(0);
      left: ${x - 5}px;
      top: ${y - 5}px;
      animation: ripple-expand 0.6s ease forwards;
      pointer-events: none;
    `;

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Add ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-expand {
    from { transform: scale(0); opacity: 1; }
    to   { transform: scale(30); opacity: 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

/* ============================================================
   NAVBAR: HIGHLIGHT ON NAV CLICK (instant feedback)
   ============================================================ */
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

/* ============================================================
   ACCESSIBILITY: FOCUS MANAGEMENT
   ============================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add focus styles only for keyboard users
const focusStyle = document.createElement('style');
focusStyle.textContent = `
  body:not(.keyboard-nav) *:focus { outline: none; }
  body.keyboard-nav *:focus {
    outline: 3px solid var(--clr-secondary);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;
document.head.appendChild(focusStyle);

/* ============================================================
   PERFORMANCE: Defer non-critical 3rd party scripts
   ============================================================ */
window.addEventListener('load', () => {
  // Google Analytics placeholder (replace UA/GA4 with actual ID)
  // const gaScript = document.createElement('script');
  // gaScript.async = true;
  // gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  // document.head.appendChild(gaScript);

  console.log(
    '%c\uD83C\uDFA8 Ekdant Painting Contractor%c\nNashik\'s Trusted Painting Experts Since 1999\n\uD83D\uDCDE +91 98231 25583',
    'color:#0D5C63; font-size:18px; font-weight:700;',
    'color:#1A8A94; font-size:12px;'
  );
});

/* ============================================================
   SERVICE CARD: Scroll into view on filter
   ============================================================ */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const grid = document.getElementById('services-grid');
    if (grid) {
      setTimeout(() => {
        grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
});

/* ============================================================
   STICKY NAV: Add padding to body when nav is scrolled
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  onScroll(); // Init scroll state
});

/* ============================================================
   MULTILINGUAL LANGUAGE SWITCHER LOGIC
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Intercept language switcher clicks to save preferences
  document.querySelectorAll('.lang-dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      var selectedLang = this.getAttribute('data-lang');
      if (selectedLang) {
        localStorage.setItem('preferred_language', selectedLang);
      }
    });
  });

  // 2. Mobile & Touch Toggle for Dropdown menu
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var switcher = this.closest('.lang-switcher');
      var expanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close other switchers
      document.querySelectorAll('.lang-switcher').forEach(s => {
        if (s !== switcher) {
          s.classList.remove('open');
          s.querySelector('.lang-btn').setAttribute('aria-expanded', 'false');
        }
      });
      
      switcher.classList.toggle('open');
      this.setAttribute('aria-expanded', !expanded);
    });
  });

  // 3. Close switchers when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-switcher').forEach(s => {
      s.classList.remove('open');
      s.querySelector('.lang-btn').setAttribute('aria-expanded', 'false');
    });
  });
});

