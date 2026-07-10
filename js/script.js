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

    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => {
        items[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    const setActiveDot = (index) => {
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    };

    const closestItemIndex = () => {
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const itemCenter = item.offsetLeft + item.clientWidth / 2;
        const dist = Math.abs(itemCenter - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    };

    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setActiveDot(closestItemIndex()), 100);
    });

    const scrollToIndex = (index) => {
      const clamped = (index + items.length) % items.length;
      items[clamped].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    prevBtn.addEventListener('click', () => scrollToIndex(closestItemIndex() - 1));
    nextBtn.addEventListener('click', () => scrollToIndex(closestItemIndex() + 1));

    setActiveDot(0);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && items.length > 1) {
      let autoRotate = setInterval(() => scrollToIndex(closestItemIndex() + 1), 4000);
      const pause = () => clearInterval(autoRotate);
      const resume = () => {
        clearInterval(autoRotate);
        autoRotate = setInterval(() => scrollToIndex(closestItemIndex() + 1), 4000);
      };
      ['mouseenter', 'touchstart', 'focusin'].forEach((evt) => carousel.addEventListener(evt, pause));
      ['mouseleave', 'touchend'].forEach((evt) => carousel.addEventListener(evt, resume));
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
