// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
}

const applyTheme = (mode) => {
  document.body.classList.toggle('dark-mode', mode === 'dark');
  const button = document.getElementById('themeToggle');
  if (button) {
    button.textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
  }
  localStorage.setItem('ath-theme', mode);
};

const savedTheme = localStorage.getItem('ath-theme');
if (savedTheme === 'dark') {
  applyTheme('dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    applyTheme(isDark ? 'light' : 'dark');
  });
}

// Rotate the hero photos from left to right every two seconds.
const heroSlideshowTrack = document.querySelector('.hero-slideshow-track');
const heroSlides = document.querySelectorAll('.hero-slideshow img');
if (heroSlideshowTrack && heroSlides.length > 1) {
  let currentSlide = 0;
  heroSlides[currentSlide].classList.add('active');
  window.setInterval(() => {
    const previousSlide = currentSlide;
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[previousSlide].classList.remove('active');
    heroSlides[previousSlide].classList.add('exit');
    heroSlides[currentSlide].classList.remove('exit');
    heroSlides[currentSlide].classList.add('active');
  }, 2000);
}

// Animated impact counters (once, on scroll into view)
const counters = document.querySelectorAll('.impact-num');
if (counters.length) {
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => observer.observe(c));
}

// Newsletter form (front-end only demo)
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      newsletterMessage.textContent = 'Please enter a valid email address.';
      return;
    }
    newsletterMessage.textContent = `Thanks — updates will be sent to ${email}.`;
    newsletterForm.reset();
  });
}
