const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");

/* =========================
   MOBILE NAVIGATION
========================= */

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");

    navToggle.setAttribute("aria-expanded", String(open));
  });
}


/* =========================
   THEME TOGGLE
========================= */

const applyTheme = (mode) => {
  document.body.classList.toggle("dark-mode", mode === "dark");

  if (themeToggle) {
    themeToggle.textContent =
      mode === "dark" ? "Light mode" : "Dark mode";
  }

  localStorage.setItem("ath-theme", mode);
};

const savedTheme = localStorage.getItem("ath-theme");

if (savedTheme === "dark") {
  applyTheme("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");

    applyTheme(isDark ? "light" : "dark");
  });
}


/* =========================
   REGISTRATION TABS
   UI ONLY
========================= */

const tabs = document.querySelectorAll(".reg-tab");
const forms = document.querySelectorAll(".reg-form");
const formSelectionHint = document.getElementById("formSelectionHint");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;

    /* Update tab states */
    tabs.forEach((item) => {
      const active = item === tab;

      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
      item.setAttribute("tabindex", active ? "0" : "-1");
    });

    /* Show selected form */
    forms.forEach((form) => {
      const active = form.id === target;

      form.hidden = !active;
      form.setAttribute("aria-hidden", String(!active));
    });

    if (formSelectionHint) {
      formSelectionHint.hidden = true;
    }

    /* Focus first field */
    const selectedForm = document.getElementById(target);

    selectedForm
      ?.querySelector("input, textarea, select")
      ?.focus();
  });
});


/* =========================
   INITIAL FORM STATE
========================= */

forms.forEach((form) => {
  form.hidden = true;
  form.setAttribute("aria-hidden", "true");
});


/* =========================
   OPTIONAL FORM UI FEEDBACK
   NO SUBMISSION / PAYMENT
========================= */

forms.forEach((form) => {
  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (!submitButton) return;

  /*
   * submitMemberShipForm.js handles the
   * actual form submission.
   *
   * membership.js intentionally does
   * nothing on submit.
   */
});


/* =========================
   PAYMENT RETURN MESSAGE
========================= */

const paymentParams = new URLSearchParams(window.location.search);
const paymentStatus = paymentParams.get("payment");
const registrationId = paymentParams.get("registration");

if (paymentStatus === "success") {
  const message = document.createElement("div");

  message.className = "payment-result payment-success";

  message.innerHTML = `
    <strong class="SuccessfulRegistrationPopUp">Registration successful!</strong>
    <p>
      Your payment has been confirmed and your membership application
      has been received successfully.
    </p>
    ${
      registrationId
        ? `<small>Registration reference: ${registrationId}</small>`
        : ""
    }
  `;

  const registerSection =
    document.getElementById("register");

  if (registerSection) {
    registerSection.prepend(message);
  }
}

if (paymentStatus === "failed") {
  const message = document.createElement("div");

  message.className = "payment-result payment-error";

  message.innerHTML = `
    <strong>Payment was not completed.</strong>
    <p>
      Your registration was not marked as successfully paid.
      Please try again or contact Agro Trade Hub Africa support.
    </p>
  `;

  const registerSection =
    document.getElementById("register");

  if (registerSection) {
    registerSection.prepend(message);
  }
}