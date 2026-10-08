const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');
const historyOpen = document.getElementById('historyOpen');
const historyDialog = document.getElementById('historyDialog');
const historyClose = document.getElementById('historyClose');

if (historyOpen && historyDialog) {
  historyOpen.addEventListener('click', () => historyDialog.showModal());
  historyDialog.addEventListener('click', (event) => {
    if (event.target === historyDialog) historyDialog.close();
  });
}

if (historyClose && historyDialog) {
  historyClose.addEventListener('click', () => historyDialog.close());
}

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

const leaderCards = document.querySelectorAll('.leader-card');
const bioPanel = document.getElementById('leaderBio');
const bioText = document.getElementById('leaderBioText');
const bioClose = document.getElementById('leaderBioClose');

leaderCards.forEach((card) => {
  card.addEventListener('click', () => {
    bioText.textContent = card.dataset.bio;
    bioPanel.hidden = false;
    bioPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

if (bioClose) {
  bioClose.addEventListener('click', () => {
    bioPanel.hidden = true;
  });
}
