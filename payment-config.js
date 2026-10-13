/*
 * Edit this file with frontend-safe payment settings.
 * Never put Paystack secret keys, Flutterwave secret keys, SMTP passwords,
 * webhook secrets, or database credentials in this file.
 */
window.ATH_PAYMENT_CONFIG = {
  currency: 'NGN',
  // Update these amounts when the official fees are confirmed.
  membershipFees: {
    farmer: { amount: 3000, label: 'Farmer registration' },
    'cooperative-new': { amount: 25000, label: 'Cooperative registration' },
    'cooperative-old': { amount: 25000, label: 'Cooperative revalidation' },
    partner: { amount: 200000, label: 'Partnership registration with Agro Trade Hub Africa' },
    investor: { minimum: 500000, maximum: 10000000, label: 'Investor contribution' },
    sponsor: { minimum: 500000, maximum: 10000000, label: 'Investor contribution' }
  },
  backend: {
    // Example: 'https://api.your-domain.com/api/membership/applications'
    applicationEndpoint: '',
    // Public approved-member directory; returns { items: [{ name, imageUrl }] }.
    directoryEndpoint: '',
    // Example: 'https://api.your-domain.com/api/payments/initialize'
    paymentInitializationEndpoint: '',
    // Example: 'https://api.your-domain.com/api/payments/verify'
    paymentVerificationEndpoint: ''
  },
  gateways: {
    paystack: {
      // Set true only after adding the public key for the correct environment.
      enabled: false,
      // Use a public key only: pk_test_... or pk_live_...
      publicKey: '',
      // Example: https://your-domain.com/payment-callback
      callbackUrl: ''
    },
    flutterwave: {
      enabled: false,
      // Use a public key only: FLWPUBK_TEST-... or FLWPUBK-...
      publicKey: '',
      // Example: https://your-domain.com/payment-callback
      redirectUrl: ''
    },
    ussd: {
      enabled: true,
      // USSD users can transfer to the official Bank of Agriculture account shown on the form.
      merchantCode: '',
      instructions: 'Use your bank\'s USSD transfer menu to send the payment to the official account above.'
    },
    bankTransfer: {
      enabled: true,
      bankName: 'Bank of Agriculture',
      accountName: 'AGRO TRADE HUB AFRICA LTD',
      accountNumber: '0018887667'
    }
  }
};
