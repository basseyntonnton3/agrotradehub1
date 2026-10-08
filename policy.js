const policyDialog = document.getElementById('policyDialog');
const policyTitle = document.getElementById('policyTitle');
const policyBody = document.getElementById('policyBody');
const policyClose = document.getElementById('policyClose');
const policyButtons = document.querySelectorAll('[data-policy]');

const policyContent = {
  privacy: {
    title: 'Privacy Policy',
    body: `<p>Agro Trade Hub Africa respects your privacy. We collect only the information needed to respond to enquiries, process membership or service requests, improve our website, and keep appropriate business records.</p><p>Your information may include your name, contact details, organisation, payment reference, and messages you send to us. We do not sell your personal information. We may share it only with trusted service providers where necessary to deliver a requested service or where required by law.</p><p>We use reasonable safeguards to protect your information and retain it only for as long as needed for the purposes described above. To ask about, correct, or request deletion of your personal information, contact us through the <a href="contact.html">contact form</a>.</p>`
  },
  cookies: {
    title: 'Cookie Policy',
    body: `<p>This website may use essential browser storage, such as local storage, to remember preferences like your display theme. These technologies help the site work and do not identify you by themselves.</p><p>We may also receive limited technical information from your browser, such as device or usage details, where this is provided by hosting, security, analytics, or embedded services. You can manage cookies and browser storage through your browser settings. Disabling them may affect some site features.</p>`
  },
  payments: {
    title: 'Payment and Refund Policy',
    body: `<p><strong>Effective date: 24 September 2026</strong></p><p>This Payment and Refund Policy applies to every registration route offered through the Agro Trade Hub Africa Membership page: farmer registration, new cooperative registration, cooperative revalidation, partner registration, and sponsor registration. It also applies to related onboarding, planning, promotional, consultancy, and coordination services requested through those routes.</p><h3>1. What payments cover</h3><p>Any stated fee is a charge for the application or service selected. It may cover administrative review, document handling, onboarding, coordination, planning, promotional work, or other services described to the applicant before payment. Submitting an application does not guarantee approval, membership, funding, partnership, sponsorship, or any particular business result.</p><h3>2. Payment responsibility</h3><ul><li>Applicants must provide accurate registration and payment information and must be authorised to use the selected payment method.</li><li>Applicants should confirm the service, amount, and payment reference before authorising payment.</li><li>A payment is treated as received when it is successfully confirmed by Agro Trade Hub Africa or its payment provider.</li><li>Payment-provider, bank, currency-conversion, or transfer charges may be deducted where applicable and may not be refundable.</li></ul><h3>3. Cancellation and refund window</h3><p>A cancellation or refund request must be sent to Agro Trade Hub Africa within 24 hours of the confirmed payment time. Requests should include the applicant's full name, registration route or service, payment date and time, amount, payment reference, and reason for the request.</p><p>Requests received within the 24-hour window will be reviewed individually. A refund may be reduced by work already completed, third-party charges, payment-provider fees, bank charges, or other costs that cannot be recovered. Where no work has started and no unrecoverable charge applies, the eligible amount may be refunded to the original payment method.</p><h3>4. Payments that are generally non-refundable</h3><p>After the 24-hour window, payments are generally non-refundable because review, onboarding, planning, coordination, or promotional work may already have started. A refund will not normally be issued for a change of mind, failure to provide requested documents, inaccurate information, missed communication, ineligibility, or a decision by an applicant not to continue.</p><p>This policy does not limit any refund or remedy that cannot lawfully be excluded. Agro Trade Hub Africa may consider exceptional cases where a service was not provided because of an error attributable to Agro Trade Hub Africa.</p><h3>5. Failed, duplicate, or incorrect payments</h3><ul><li>A failed or reversed payment does not complete registration. Applicants should not submit repeated payments without first checking with their bank or payment provider.</li><li>Confirmed duplicate payments should be reported promptly. After verification, an eligible duplicate amount may be returned to the original payment method, less any unrecoverable charges.</li><li>Overpayments or payments made for the wrong service will be reviewed after the applicant provides the relevant payment evidence.</li></ul><h3>6. Payment disputes</h3><p>Please contact Agro Trade Hub Africa before initiating a chargeback or payment dispute so the transaction can be investigated. Unresolved disputes may require the applicant to provide transaction records, identity details, and communication relating to the application. Nothing in this section prevents an applicant from exercising a legal right available to them.</p><h3>7. How to contact us</h3><p>Send payment and refund requests through the <a href="contact.html">contact form</a>. Include your name, phone or email address, registration route, payment date, amount, payment reference, and supporting evidence. We will acknowledge the request and communicate the outcome after reviewing the transaction and any work already completed.</p>`
  }
};

const closePolicyDialog = () => {
  if (policyDialog && policyDialog.open) policyDialog.close();
};

policyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const policy = policyContent[button.dataset.policy];
    if (!policy || !policyDialog) return;
    policyTitle.textContent = policy.title;
    policyBody.innerHTML = policy.body;
    policyDialog.showModal();
    policyClose.focus();
  });
});

if (policyClose) policyClose.addEventListener('click', closePolicyDialog);
if (policyDialog) {
  policyDialog.addEventListener('click', (event) => {
    if (event.target === policyDialog) closePolicyDialog();
  });
}
