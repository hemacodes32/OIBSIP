/* ------ Custom Cursor ------ */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  /* Smooth ring follow */
  function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* Scale cursor on interactive elements */
  document.querySelectorAll('a, button, .feature-card, .testi-card, .pricing-card, .service-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.background = 'rgba(0,230,200,.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--cyan)';
    });
  });

  /* ------ Navbar scroll ------ */
  const navbar  = document.getElementById('navbar');
  const backTop = document.getElementById('back-top');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    backTop.classList.toggle('visible', window.scrollY > 500);
  });

  /* ------ Mobile menu ------ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  function closeMobile() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ------ Scroll Reveal ------ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ------ Toast Notification ------ */
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  /* ------ Contact Form Submit ------ */
  function handleFormSubmit() {
    const inputs = document.querySelectorAll('#contact input, #contact textarea');
    let valid = true;
    inputs.forEach(inp => {
      if (!inp.value.trim()) { valid = false; inp.style.borderColor = 'var(--danger)'; }
      else inp.style.borderColor = '';
    });
    if (!valid) { showToast('⚠️ Please fill in all fields.'); return; }
    showToast('✓ Message sent! We\'ll reply within 24 hours.');
    inputs.forEach(inp => inp.value = '');
  }

  /* ------ Animated counter for hero stats ------ */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = el.dataset.display; clearInterval(timer); }
    }, 16);
  }