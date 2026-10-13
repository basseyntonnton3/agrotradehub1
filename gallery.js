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

if (localStorage.getItem('ath-theme') === 'dark') {
  applyTheme('dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
  });
}

/* ---------- Category jump links ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const sections = document.querySelectorAll('.gallery-section');

const setActive = (id) => {
  filterBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.target === id));
};

filterBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    setActive(btn.dataset.target);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Highlight the category currently on screen */
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
  observer.observe(document.getElementById('top-of-gallery'));
}

/* Show "No images yet" for any section with no pictures */
sections.forEach((section) => {
  section.classList.toggle('is-empty', !section.querySelector('.gallery-item'));
});

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxInfo = document.getElementById('lightboxInfo');
const lightboxClose = document.getElementById('lightboxClose');

const openLightbox = (item) => {
  const image = item.querySelector('.gallery-img img');
  const title = item.querySelector('.gallery-title');
  const details = [...item.querySelectorAll('.gallery-details > div')].map((row) => {
    const label = row.querySelector('dt').textContent.trim();
    const value = row.querySelector('dd').textContent.trim();
    return `${label}: ${value}`;
  });

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = title ? title.textContent.trim() : '';
  lightboxInfo.textContent = details.join(' | ');
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
};

document.getElementById('galleryBody').addEventListener('click', (event) => {
  const item = event.target.closest('.gallery-item');
  if (item) openLightbox(item);
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});