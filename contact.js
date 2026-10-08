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

const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailValid) {
      contactMessage.textContent = 'Please fill in your name and a valid email address.';
      return;
    }
    contactMessage.textContent = `Thanks, ${name} — your message has been sent. We'll be in touch soon.`;
    contactForm.reset();
  });
}
