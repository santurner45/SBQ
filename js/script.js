document.addEventListener('DOMContentLoaded', () => {
  const ageGate = document.getElementById('ageGate');
  const ageGateEnter = document.getElementById('ageGateEnter');

  ageGateEnter.addEventListener('click', () => {
    try {
      localStorage.setItem('sbq_age_verified', 'true');
    } catch (e) {}
    ageGate.hidden = true;
    document.body.classList.remove('age-gate-locked');
  });

  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const carousel = document.getElementById('galleryCarousel');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  if (carousel && dotsWrap) {
    const items = Array.from(carousel.children);
    let currentIndex = 0;

    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => { if (!isAnimating) goToIndex(i); });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    const setActiveDot = (index) => {
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    };

    const closestItemIndex = () => {
      const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const dist = Math.abs(itemCenter - carouselCenter);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    };

    let isAnimating = false;
    let settleTimer;
    let fallbackTimer;

    function handleSettled() {
      isAnimating = false;
      clearTimeout(fallbackTimer);
      currentIndex = closestItemIndex();
      setActiveDot(currentIndex);
    }

    // Prefer real scroll/scrollend signals to know when settled, but some
    // browsers don't reliably fire them for scrollIntoView() — so a hard
    // timeout fallback guarantees we never get stuck mid-animation.
    carousel.addEventListener('scrollend', handleSettled);
    carousel.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(handleSettled, 150);
    });

    function goToIndex(index) {
      currentIndex = (index + items.length) % items.length;
      isAnimating = true;
      items[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveDot(currentIndex);
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(handleSettled, 1200);
    }

    prevBtn.addEventListener('click', () => { if (!isAnimating) goToIndex(currentIndex - 1); });
    nextBtn.addEventListener('click', () => { if (!isAnimating) goToIndex(currentIndex + 1); });

    setActiveDot(0);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && items.length > 1) {
      let autoRotate = setInterval(() => goToIndex(currentIndex + 1), 10000);
      const pause = () => clearInterval(autoRotate);
      const resume = () => {
        clearInterval(autoRotate);
        autoRotate = setInterval(() => goToIndex(currentIndex + 1), 10000);
      };
      // Pause on the whole gallery block (not just the scroll area), so
      // moving the mouse onto the arrow buttons or dots doesn't resume
      // auto-rotate mid-interaction.
      const galleryBlock = carousel.closest('.gallery') || carousel;
      ['mouseenter', 'touchstart', 'focusin'].forEach((evt) => galleryBlock.addEventListener(evt, pause));
      ['mouseleave', 'touchend'].forEach((evt) => galleryBlock.addEventListener(evt, resume));
    }
  }

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Hook this up to a form service (e.g. Formspree, Getform) or your own
    // backend by setting the form's action/method and removing this handler.
    note.textContent = "Thanks! I'll get back to you soon 💌";
    form.reset();
  });
});
