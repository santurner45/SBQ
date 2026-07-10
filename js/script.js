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
      // Scroll the carousel's own scrollLeft directly (never scrollIntoView),
      // since scrollIntoView can also drag the whole page vertically to
      // bring the target into view if the carousel isn't fully on-screen.
      const target = items[currentIndex];
      const targetRect = target.getBoundingClientRect();
      const carouselRect = carousel.getBoundingClientRect();
      const delta = (targetRect.left + targetRect.width / 2) - (carouselRect.left + carouselRect.width / 2);
      carousel.scrollTo({ left: carousel.scrollLeft + delta, behavior: 'smooth' });
      setActiveDot(currentIndex);
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(handleSettled, 1200);
    }

    prevBtn.addEventListener('click', () => { if (!isAnimating) goToIndex(currentIndex - 1); });
    nextBtn.addEventListener('click', () => { if (!isAnimating) goToIndex(currentIndex + 1); });

    setActiveDot(0);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && items.length > 1) {
      let autoRotate = null;
      let isTouching = false;
      let isVisible = false;

      const updateAutoRotate = () => {
        const shouldRun = isVisible && !isTouching;
        if (shouldRun && !autoRotate) {
          autoRotate = setInterval(() => goToIndex(currentIndex + 1), 5000);
        } else if (!shouldRun && autoRotate) {
          clearInterval(autoRotate);
          autoRotate = null;
        }
      };

      // Pause only while actively swiping/dragging the carousel — not on
      // simple mouse hover, since the cursor can rest over the gallery
      // incidentally (e.g. while scrolling) and mouseleave won't fire
      // again until it's moved fully away, permanently stalling rotation.
      carousel.addEventListener('touchstart', () => { isTouching = true; updateAutoRotate(); });
      carousel.addEventListener('touchend', () => { isTouching = false; updateAutoRotate(); });

      // Only rotate while the gallery is actually on-screen — no point
      // animating photos nobody's looking at.
      const galleryBlock = carousel.closest('.gallery') || carousel;
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            isVisible = entries[0].isIntersecting;
            updateAutoRotate();
          },
          { threshold: 0.5 }
        );
        observer.observe(galleryBlock);
      } else {
        isVisible = true;
        updateAutoRotate();
      }
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
