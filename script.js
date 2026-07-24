// ---------------------------------------------------------
// Header: Always visible, applies blur on scroll
// ---------------------------------------------------------
const header = document.getElementById('header');

const onScroll = () => {
  const currentY = window.scrollY;
  // Ajoute la classe .scrolled (qui contient le flou) quand on descend de plus de 12px
  header.classList.toggle('scrolled', currentY > 12);
};

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
// ---------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------------------------------------------------------
// Hero eye: the framed logo tilts gently toward the pointer,
// like a camera locking onto what it's watching.
// ---------------------------------------------------------
const eyeFrame = document.getElementById('eye-frame');
const heroVisual = document.getElementById('hero-visual');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (eyeFrame && !prefersReducedMotion) {
  const maxTilt = 10; // degrees

  const tiltFrame = (clientX, clientY) => {
    const rect = eyeFrame.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const relY = (clientY - rect.top) / rect.height - 0.5;

    const rotateY = relX * maxTilt * 2;
    const rotateX = -relY * maxTilt * 2;

    eyeFrame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  window.addEventListener('pointermove', (e) => tiltFrame(e.clientX, e.clientY), { passive: true });
  heroVisual.addEventListener('pointerleave', () => {
    eyeFrame.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// ---------------------------------------------------------
// GSAP Scroll Animations — Version Premium
// ---------------------------------------------------------
gsap.registerPlugin(ScrollTrigger);

// 1. Cartes & Étapes (Services, Méthode, Tarifs) — Effet cascade avec Flou + Zoom + Expo
const grids = document.querySelectorAll('.card-grid, .steps, .pricing-grid');

grids.forEach(grid => {
  const cards = Array.from(grid.children);

  gsap.fromTo(cards, 
    {
      opacity: 0,
      y: 70,                 // Part de 70px plus bas
      scale: 0.92,           // Légèrement réduit
      filter: "blur(10px)"   // Flou initial
    },
    {
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2,
      stagger: 0.1,          // Décalage fluide de 100ms entre chaque carte
      ease: "expo.out",      // Départ ultra rapide et freinage très doux
      clearProps: "filter,transform" // Nettoie le CSS après l'animation pour un rendu parfait
    }
  );
});

// 2. Titres et sous-titres — Apparition fluide
const titles = document.querySelectorAll('.section-title, .section-eyebrow, .cta-copy, .contact-form');

titles.forEach(el => {
  gsap.fromTo(el,
    {
      opacity: 0,
      y: 40,
      filter: "blur(6px)"
    },
    {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "power4.out",
      clearProps: "filter,transform"
    }
  );
});

// Recalcule les positions exactes quand la page est chargée à 100%
window.addEventListener('load', () => ScrollTrigger.refresh());
// ---------------------------------------------------------
// Stat counters
// ---------------------------------------------------------
const stats = document.querySelectorAll('.stat');

const animateStat = (el) => {
  const valueEl = el.querySelector('.stat-value');
  const target = Number(el.dataset.value || 0);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const noAnim = el.dataset.noanim === 'true';

  if (noAnim) {
    valueEl.textContent = `${prefix}${target}${suffix}`;
    return;
  }

  const duration = 1200;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    valueEl.textContent = `${prefix}${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStat(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

stats.forEach(el => statObserver.observe(el));

// ---------------------------------------------------------
// Contact form (front-end only — wire up a real endpoint later)
// ---------------------------------------------------------
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = 'Message envoyé — nous revenons vers vous sous 48h.';
  form.reset();
});
