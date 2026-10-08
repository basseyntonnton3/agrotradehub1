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

// Highlight the active category link while scrolling
const sections = document.querySelectorAll('.service-group[id]');
const jumpLinks = document.querySelectorAll('.services-jump a');
if (sections.length && jumpLinks.length) {
  const map = new Map();
  jumpLinks.forEach((a) => map.set(a.getAttribute('href').slice(1), a));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = map.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        jumpLinks.forEach((a) => a.style.color = '#cfe0d5');
        link.style.color = '#74c69d';
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach((s) => observer.observe(s));
}
