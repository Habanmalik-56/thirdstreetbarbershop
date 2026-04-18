/* ============================================================
   THIRD STREET BARBER SHOP — SCRIPT.JS
   Animations, Parallax, Carousel, Mobile Nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Lucide Icons Init ──
  if (window.lucide) lucide.createIcons();

  // ── Header Scroll Effect ──
  const header = document.querySelector('.header');
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
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Products Carousel (Responsive) ──
  const carouselTrack = document.querySelector('.carousel-track');
  const viewport = document.querySelector('.carousel-viewport');

  if (carouselTrack && viewport) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    const onDragStart = (e) => {
      isDragging = true;
      startX = (e.pageX || e.touches[0].pageX) - carouselTrack.offsetLeft;
      scrollLeft = carouselTrack.scrollLeft;
    };

    const onDragEnd = () => {
      isDragging = false;
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = (e.pageX || e.touches[0].pageX) - carouselTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      carouselTrack.scrollLeft = scrollLeft - walk;
    };

    viewport.addEventListener('mousedown', onDragStart);
    viewport.addEventListener('touchstart', onDragStart, { passive: true });

    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);

    viewport.addEventListener('mousemove', onDragMove);
    viewport.addEventListener('touchmove', onDragMove, { passive: false });
  }

  // ── Booking Form Handling ──
  const bookingForm = document.getElementById('bookingForm');
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success state
    const btn = bookingForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ BOOKING CONFIRMED!';
    btn.style.background = '#22c55e';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      bookingForm.reset();
    }, 3000);
  });

  // ── Dynamic Year in Footer ──
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
