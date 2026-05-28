/* ══════════════════════════════════════════
   main.js — Portfolio script (fresh build)
   Bar animation: pure JS rAF counter
══════════════════════════════════════════ */

const LABELS = ['Introduction','About Me','Education','Skills','Projects','Certifications','Contact'];
const secs   = Array.from(document.querySelectorAll('.sec'));
const dots   = Array.from(document.querySelectorAll('.dot'));
const topBar = document.getElementById('topBar');
const lblEl  = document.getElementById('slideLabel');

/* ── Top scroll progress line ── */
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  topBar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
}, { passive: true });

/* ── Active section + dot tracker ── */
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const i = secs.indexOf(e.target);
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
    lblEl.textContent = LABELS[i] || '';
  });
}, { threshold: 0.4 });
secs.forEach(s => secObs.observe(s));

/* ── Dot click ── */
dots.forEach(d => {
  d.addEventListener('click', () => {
    secs[+d.dataset.sec]?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Global scroll-to helper ── */
window.scrollTo = window.scrollTo; // keep native
window.scrollTo_sec = i => secs[i]?.scrollIntoView({ behavior: 'smooth' });

// Patch onclick="scrollTo(6)" in HTML
window.scrollTo = function(a, b) {
  if (typeof a === 'number' && b === undefined && a < 20) {
    secs[a]?.scrollIntoView({ behavior: 'smooth' });
  } else {
    Window.prototype.scrollTo.apply(window, arguments);
  }
};

/* ══════════════════════════════════════════
   BAR ANIMATION — pure JS, no CSS transition
   Uses rAF loop counting from 0 → target %
══════════════════════════════════════════ */
const DURATION = 1100; // ms
const done = new WeakSet();

function runBar(el) {
  if (done.has(el)) return;
  done.add(el);

  const target = parseFloat(el.dataset.pct) || 0;
  const t0 = performance.now();

  function tick(now) {
    const elapsed  = now - t0;
    const raw      = Math.min(elapsed / DURATION, 1);
    // ease-out cubic
    const eased    = 1 - Math.pow(1 - raw, 3);
    const cur      = eased * target;
    el.style.width = cur + '%';
    if (raw < 1) requestAnimationFrame(tick);
  }

  // Set to 0 first (explicit), then kick off next frame
  el.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(tick));
}

/* Watch each bar — fire when it enters the viewport */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) runBar(e.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.bar-fill').forEach(bar => {
  bar.style.width = '0%';
  barObs.observe(bar);
});

/* ── Contact form ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.cssText += ';background:#22c55e;border-color:#22c55e';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 3000);
  });
}
