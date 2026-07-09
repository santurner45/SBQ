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
