const API_BASE_URL ="https://agtechbe.onrender.com"

const ADMIN_KEY_STORAGE =
  "ath_admin_api_key";

let registrations = [];
let adminKey = null;


/* ELEMENTS */

const loginScreen =
  document.getElementById("loginScreen");

const loginForm =
  document.getElementById("loginForm");

const adminKeyInput =
  document.getElementById("adminKey");

const loginError =
  document.getElementById("loginError");

const dashboard =
  document.getElementById("dashboard");

const refreshButton =
  document.getElementById("refreshButton");

const logoutButton =
  document.getElementById("logoutButton");

const searchInput =
  document.getElementById("searchInput");

const typeFilter =
  document.getElementById("typeFilter");

const statusFilter =
  document.getElementById("statusFilter");

const registrationsBody =
  document.getElementById("registrationsBody");

const resultCount =
  document.getElementById("resultCount");

const detailsModal =
  document.getElementById("detailsModal");

const closeModal =
  document.getElementById("closeModal");

const modalName =
  document.getElementById("modalName");

const modalContent =
  document.getElementById("modalContent");


/* HELPERS */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatDate(value) {
  if (!value) {
    return "—";
  }

  let date;

  if (
    typeof value === "object" &&
    value._seconds
  ) {
    date = new Date(
      value._seconds * 1000
    );
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}


function formatAmount(value) {
  const amount = Number(value || 0);

  return `₦${amount.toLocaleString("en-NG")}`;
}


function getApplicantName(registration) {
  return (
    registration.name ||
    registration["contact-name"] ||
    registration["contact-person-1-name"] ||
    registration.org ||
    "Unnamed Applicant"
  );
}


function getMembershipId(registration) {
  return (
    registration.membership?.membershipId ||
    registration.membershipId ||
    "—"
  );
}


function getCertificateNumber(registration) {
  return (
    registration.membership?.certificateNumber ||
    registration.certificateNumber ||
    "—"
  );
}


function getPaymentStatus(registration) {
  return (
    registration.paymentStatus ||
    registration.payment?.status ||
    "pending"
  );
}


function getRegistrationStatus(registration) {
  return (
    registration.status ||
    "pending"
  );
}


function formatType(type) {
  const names = {
    farmer: "Farmer",
    "cooperative-new":
      "New Cooperative",
    "cooperative-old":
      "Existing Cooperative",
    partner: "Partner",
    investor: "Investor",
    sponsor: "Sponsor",
  };

  return (
    names[type] ||
    type ||
    "Unknown"
  );
}


/* API */

async function fetchRegistrations() {
  if (!adminKey) {
    throw new Error(
      "Admin authentication required."
    );
  }

  const response =
    await fetch(
      `${API_BASE_URL}/api/registrations`,
      {
        headers: {
          "x-admin-key": adminKey,
        },
      }
    );

  const data =
    await response.json();
    console.log(data)

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Could not retrieve registrations."
    );
  }

  if (!data.success) {
    throw new Error(
      data.message ||
        "Could not retrieve registrations."
    );
  }

  registrations =
    Array.isArray(data.registrations)
      ? data.registrations
      : [];

  renderDashboard();
}


/* DASHBOARD */

function renderDashboard() {
  renderStats();
  renderTable();
}


function renderStats() {
  const total =
    registrations.length;

  const completed =
    registrations.filter(
      (item) =>
        item.status === "completed" ||
        item.paymentStatus === "paid"
    ).length;

  const pending =
    registrations.filter(
      (item) =>
        item.paymentStatus !== "paid"
    ).length;

  const farmers =
    registrations.filter(
      (item) =>
        item.type === "farmer"
    ).length;

  const cooperatives =
    registrations.filter(
      (item) =>
        item.type === "cooperative-new" ||
        item.type === "cooperative-old"
    ).length;

  const partners =
    registrations.filter(
      (item) =>
        item.type === "partner"
    ).length;

  const investors =
    registrations.filter(
      (item) =>
        item.type === "investor"
    ).length;

  const sponsors =
    registrations.filter(
      (item) =>
        item.type === "sponsor"
    ).length;

  document.getElementById(
    "totalCount"
  ).textContent = total;

  document.getElementById(
    "completedCount"
  ).textContent = completed;

  document.getElementById(
    "pendingCount"
  ).textContent = pending;

  document.getElementById(
    "farmerCount"
  ).textContent = farmers;

  document.getElementById(
    "cooperativeCount"
  ).textContent = cooperatives;

  document.getElementById(
    "partnerCount"
  ).textContent = partners;

  document.getElementById(
    "investorCount"
  ).textContent = investors;

  document.getElementById(
    "sponsorCount"
  ).textContent = sponsors;
}


function getFilteredRegistrations() {
  const search =
    searchInput.value
      .trim()
      .toLowerCase();

  const type =
    typeFilter.value;

  const status =
    statusFilter.value;

  return registrations.filter(
    (registration) => {

      const name =
        getApplicantName(
          registration
        ).toLowerCase();

      const email =
        String(
          registration.email || ""
        ).toLowerCase();

      const membershipId =
        getMembershipId(
          registration
        ).toLowerCase();

      const registrationId =
        String(
          registration.id || ""
        ).toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        membershipId.includes(search) ||
        registrationId.includes(search);

      const matchesType =
        type === "all" ||
        registration.type === type;

      let matchesStatus = true;

      if (status === "completed") {
        matchesStatus =
          registration.status ===
            "completed" ||
          registration.paymentStatus ===
            "paid";
      }

      if (status === "paid") {
        matchesStatus =
          registration.paymentStatus ===
          "paid";
      }

      if (status === "pending") {
        matchesStatus =
          registration.paymentStatus !==
          "paid";
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    }
  );
}


function renderTable() {
  const filtered =
    getFilteredRegistrations();

  resultCount.textContent =
    `${filtered.length} ${
      filtered.length === 1
        ? "record"
        : "records"
    }`;

  if (!filtered.length) {
    registrationsBody.innerHTML = `
      <tr>
        <td
          colspan="8"
          class="empty-state"
        >
          No registrations found.
        </td>
      </tr>
    `;

    return;
  }

  registrationsBody.innerHTML =
    filtered
      .map(
        (registration) => {

          const name =
            getApplicantName(
              registration
            );

          const email =
            registration.email ||
            "—";

          const membershipId =
            getMembershipId(
              registration
            );

          const paymentStatus =
            getPaymentStatus(
              registration
            );

          const status =
            getRegistrationStatus(
              registration
            );

          const amount =
            registration.payment?.amount ||
            registration.amount ||
            0;

          const paymentClass =
            paymentStatus === "paid"
              ? "paid"
              : "pending";

          return `
            <tr>

              <td>
                <div class="applicant-name">
                  ${escapeHtml(name)}
                </div>

                <div class="applicant-email">
                  ${escapeHtml(email)}
                </div>
              </td>

              <td>
                <span class="badge">
                  ${escapeHtml(
                    formatType(
                      registration.type
                    )
                  )}
                </span>
              </td>

              <td>
                ${escapeHtml(email)}
              </td>

              <td>
                ${escapeHtml(
                  membershipId
                )}
              </td>

              <td>
                ${formatAmount(amount)}
              </td>

              <td>
                <span
                  class="badge ${paymentClass}"
                >
                  ${escapeHtml(
                    status === "completed"
                      ? "Completed"
                      : paymentStatus
                  )}
                </span>
              </td>

              <td>
                ${formatDate(
                  registration.createdAt
                )}
              </td>

              <td>
                <button
                  class="view-button"
                  data-id="${escapeHtml(
                    registration.id
                  )}"
                >
                  View
                </button>
              </td>

            </tr>
          `;
        }
      )
      .join("");

  document
    .querySelectorAll(
      ".view-button"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {
          openRegistration(
            button.dataset.id
          );
        }
      );

    });
}


/* DETAILS */

async function openRegistration(id) {
  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/registrations/${encodeURIComponent(
          id
        )}`,
        {
          headers: {
            "x-admin-key":
              adminKey,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Could not retrieve registration."
      );
    }

    renderRegistrationDetails(
      data.registration
    );

    detailsModal.classList.remove(
      "hidden"
    );

  } catch (error) {

    alert(
      error.message ||
        "Could not load registration."
    );

  }
}


function renderRegistrationDetails(
  registration
) {
  const name =
    getApplicantName(
      registration
    );

  modalName.textContent = name;

  const excludedKeys = new Set([
    "documents",
    "payment",
    "membership",
    "createdAt",
    "updatedAt",
  ]);

  const basicEntries =
    Object.entries(
      registration
    ).filter(
      ([key]) =>
        !excludedKeys.has(key) &&
        typeof registration[key] !==
          "object"
    );

  const basicHtml =
    basicEntries
      .map(
        ([key, value]) => `
          <div class="detail-item">

            <span class="detail-label">
              ${escapeHtml(
                key.replaceAll(
                  "-",
                  " "
                )
              )}
            </span>

            <div class="detail-value">
              ${escapeHtml(
                value || "—"
              )}
            </div>

          </div>
        `
      )
      .join("");


  const payment =
    registration.payment || {};

  const membership =
    registration.membership || {};


  const paymentHtml = `
    <div class="detail-grid">

      <div class="detail-item">
        <span class="detail-label">
          Payment Status
        </span>

        <div class="detail-value">
          ${escapeHtml(
            payment.status ||
              registration.paymentStatus ||
              "—"
          )}
        </div>
      </div>

      <div class="detail-item">
        <span class="detail-label">
          Amount
        </span>

        <div class="detail-value">
          ${formatAmount(
            payment.amount
          )}
        </div>
      </div>

      <div class="detail-item">
        <span class="detail-label">
          Reference
        </span>

        <div class="detail-value">
          ${escapeHtml(
            payment.reference ||
              registration.registrationReference ||
              "—"
          )}
        </div>
      </div>

      <div class="detail-item">
        <span class="detail-label">
          Transaction ID
        </span>

        <div class="detail-value">
          ${escapeHtml(
            payment.transactionId ||
              "—"
          )}
        </div>
      </div>

      <div class="detail-item">
        <span class="detail-label">
          Paid At
        </span>

        <div class="detail-value">
          ${formatDate(
            payment.paidAt
          )}
        </div>
      </div>

    </div>
  `;


  const membershipHtml = `
    <div class="detail-grid">

      <div class="detail-item">
        <span class="detail-label">
          Membership ID
        </span>

        <div class="detail-value">
          ${escapeHtml(
            membership.membershipId ||
              registration.membershipId ||
              "—"
          )}
        </div>
      </div>

      <div class="detail-item">
        <span class="detail-label">
          Plan
        </span>

        <div class="detail-value">
          ${escapeHtml(
            membership.plan ||
              "—"
          )}
        </div>
      </div>

      <div class="detail-item">
        <span class="detail-label">
          Certificate Number
        </span>

        <div class="detail-value">
          ${escapeHtml(
            membership.certificateNumber ||
              registration.certificateNumber ||
              "—"
          )}
        </div>
      </div>

      <div class="detail-item">
        <span class="detail-label">
          Issued
        </span>

        <div class="detail-value">
          ${formatDate(
            membership.issuedAt
          )}
        </div>
      </div>

    </div>
  `;


  const documents =
    registration.documents || {};

  const documentLinks = [];

  if (
    documents.certificate?.url
  ) {
    documentLinks.push(`
      <a
        class="document-link"
        href="${escapeHtml(
          documents.certificate.url
        )}"
        target="_blank"
        rel="noopener"
      >
        View Membership Certificate
      </a>
    `);
  }

  if (
    documents.farmerIdCard?.url
  ) {
    documentLinks.push(`
      <a
        class="document-link"
        href="${escapeHtml(
          documents.farmerIdCard.url
        )}"
        target="_blank"
        rel="noopener"
      >
        View Farmer ID Card
      </a>
    `);
  }


  modalContent.innerHTML = `

    <section class="detail-section">

      <h3>
        Registration Information
      </h3>

      <div class="detail-grid">
        ${basicHtml}
      </div>

    </section>


    <section class="detail-section">

      <h3>
        Membership
      </h3>

      ${membershipHtml}

    </section>


    <section class="detail-section">

      <h3>
        Payment
      </h3>

      ${paymentHtml}

    </section>


    ${
      documentLinks.length
        ? `
          <section class="detail-section">

            <h3>
              Membership Documents
            </h3>

            <div class="document-links">
              ${documentLinks.join("")}
            </div>

          </section>
        `
        : ""
    }

  `;
}


/* LOGIN */

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const key =
      adminKeyInput.value.trim();

    if (!key) {
      return;
    }

    loginError.textContent =
      "Checking credentials...";

    try {

      adminKey = key;

      await fetchRegistrations();

      sessionStorage.setItem(
        ADMIN_KEY_STORAGE,
        adminKey
      );

      loginScreen.classList.add(
        "hidden"
      );

      dashboard.classList.remove(
        "hidden"
      );

      loginError.textContent = "";

    } catch (error) {

      adminKey = null;

      loginError.textContent =
        error.message ||
        "Invalid admin key.";

    }

  }
);


/* FILTERS */

searchInput.addEventListener(
  "input",
  renderTable
);

typeFilter.addEventListener(
  "change",
  renderTable
);

statusFilter.addEventListener(
  "change",
  renderTable
);


/* REFRESH */

refreshButton.addEventListener(
  "click",
  async () => {

    refreshButton.disabled =
      true;

    refreshButton.textContent =
      "Refreshing...";

    try {
      await fetchRegistrations();
    } catch (error) {
      alert(
        error.message ||
          "Could not refresh."
      );
    } finally {
      refreshButton.disabled =
        false;

      refreshButton.textContent =
        "↻ Refresh";
    }

  }
);


/* LOGOUT */

logoutButton.addEventListener(
  "click",
  () => {

    adminKey = null;

    sessionStorage.removeItem(
      ADMIN_KEY_STORAGE
    );

    dashboard.classList.add(
      "hidden"
    );

    loginScreen.classList.remove(
      "hidden"
    );

    adminKeyInput.value = "";

  }
);


/* MODAL */

closeModal.addEventListener(
  "click",
  () => {
    detailsModal.classList.add(
      "hidden"
    );
  }
);


document
  .querySelector(
    ".modal-backdrop"
  )
  .addEventListener(
    "click",
    () => {
      detailsModal.classList.add(
        "hidden"
      );
    }
  );


/* RESTORE SESSION */

async function restoreSession() {

  const savedKey =
    sessionStorage.getItem(
      ADMIN_KEY_STORAGE
    );

  if (!savedKey) {
    return;
  }

  adminKey = savedKey;

  try {

    await fetchRegistrations();

    loginScreen.classList.add(
      "hidden"
    );

    dashboard.classList.remove(
      "hidden"
    );

  } catch {
    sessionStorage.removeItem(
      ADMIN_KEY_STORAGE
    );

    adminKey = null;
  }
}


restoreSession();