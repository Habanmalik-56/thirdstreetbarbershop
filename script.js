/* ============================================================
   THIRD STREET BARBER SHOP — SCRIPT.JS
   Animations, Parallax, Carousel, Mobile Nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Lucide Icons Init ──
  if (window.lucide) lucide.createIcons();

  // ── Header Scroll Effect ──
  const header = document.querySelector('.site-header');
  const handleHeaderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ── Mobile Navigation ──
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth Scroll for Nav Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll Reveal (IntersectionObserver) ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Floating 3D Parallax ──
  const floatingTools = document.querySelectorAll('.float-tool');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        floatingTools.forEach((tool, i) => {
          const speed = 0.03 + (i * 0.015);
          const yOffset = scrollY * speed;
          const xOffset = Math.sin(scrollY * 0.002 + i) * 8;
          tool.style.transform = `translate(${xOffset}px, ${-yOffset}px) rotate(${scrollY * 0.02 + i * 15}deg)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ── Products Carousel ──
  const carouselTrack = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (carouselTrack && prevBtn && nextBtn) {
    let currentIndex = 0;
    const maxIndex = 2; // Since we have 5 items and show 3, we can scroll twice.

    const updateCarousel = () => {
      // 250px width + 2rem (32px) gap = 282px per slide exactly
      carouselTrack.style.transform = `translateX(-${currentIndex * 282}px)`;
    };

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchDiff = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener('touchmove', (e) => {
      touchDiff = touchStartX - e.touches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', () => {
      if (Math.abs(touchDiff) > 50) {
        if (touchDiff > 0) {
          carouselPos = Math.min(carouselPos + cardWidth, getMaxScroll());
        } else {
          carouselPos = Math.max(carouselPos - cardWidth, 0);
        }
        updateCarousel();
      }
      touchDiff = 0;
    });
  }

  // ── Booking Form Handling ──
  const bookingForm = document.getElementById('bookingForm');
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    
    // Show success state
    const btn = bookingForm.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = '✓ BOOKING CONFIRMED!';
    btn.style.background = '#22c55e';
    btn.style.boxShadow = '0 0 30px rgba(34,197,94,0.35)';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.boxShadow = '';
      bookingForm.reset();
    }, 3000);
  });

  // ── Staggered Service Cards Animation ──
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.12}s`;
  });

  // ── Stylist Cards Tilt on Hover ──
  const stylistCards = document.querySelectorAll('.stylist-card');
  stylistCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Counter Animation for Stats ──
  const animateCounter = (el, target, suffix = '') => {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  };

  // ── Dynamic Year in Footer ──
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Review Cards Auto-Glow ──
  const reviewCards = document.querySelectorAll('.review-card');
  let activeReview = 0;

  const cycleReviewGlow = () => {
    reviewCards.forEach(c => c.style.borderColor = '');
    if (reviewCards[activeReview]) {
      reviewCards[activeReview].style.borderColor = 'rgba(255,140,0,0.35)';
      reviewCards[activeReview].style.boxShadow = '0 0 30px rgba(255,140,0,0.08)';
    }
    activeReview = (activeReview + 1) % reviewCards.length;
  };

  if (reviewCards.length) {
    cycleReviewGlow();
    setInterval(cycleReviewGlow, 3000);
  }

  // ── Preloader Fade ──
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        setTimeout(() => preloader.remove(), 600);
      }, 800);
    });
  }

});
