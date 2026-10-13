document.querySelectorAll(".page-hero[data-hero-interval]").forEach((hero) => {
  const slides = Array.from(hero.querySelectorAll(".hero-slides img"));
  const interval = Number(hero.dataset.heroInterval);

  if (slides.length < 2 || !Number.isFinite(interval) || interval < 1) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 0;

  window.setInterval(() => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add("is-active");
  }, interval);
});