const API_BASE_URL = "https://agtechbe.onrender.com/api";

const REGISTRATION_TYPES = {
  farmer: "farmer",
  "cooperative-new": "cooperative-new",
  "cooperative-old": "cooperative-old",
  partner: "partner",
  investor: "investor",
};

async function getCloudinarySignature() {
  const response = await fetch(
    `${API_BASE_URL}/uploads/signature`
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Could not prepare file upload"
    );
  }

  return data;
}

// async function uploadFileToCloudinary(file) {
//   const signature = await getCloudinarySignature();

//   const formData = new FormData();

//   formData.append("file", file);
//   formData.append("api_key", signature.apiKey);
//   formData.append("timestamp", signature.timestamp);
//   formData.append("folder", signature.folder);
//   formData.append("signature", signature.signature);

//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.error?.message || "File upload failed"
//     );
//   }

//   return {
//     url: data.secure_url,
//     publicId: data.public_id,
//     resourceType: data.resource_type,
//     format: data.format,
//     originalFilename: file.name,
//   };
// }

async function uploadFileToCloudinary(file) {
  const signature = await getCloudinarySignature();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp);
  formData.append("folder", signature.folder);
  formData.append("signature", signature.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(
      data.error?.message || "File upload failed"
    );
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    bytes: data.bytes,
    originalFilename: file.name,
  };
}


async function uploadFormFiles(form) {
  const fileInputs = form.querySelectorAll(
    'input[type="file"]'
  );

  const uploadedFiles = {};

  for (const input of fileInputs) {
    const files = Array.from(input.files || []);

    if (!files.length) {
      continue;
    }

    uploadedFiles[input.name] = [];

    for (const file of files) {
      const uploaded = await uploadFileToCloudinary(file);

      uploadedFiles[input.name].push(uploaded);
    }
  }

  return uploadedFiles;
}

function collectFormFields(form) {
  const data = {};

  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      continue;
    }

    data[key] = value;
  }

  return data;
}

function getMessageElement(form) {
  return form.querySelector(".form-message");
}

function setMessage(form, message, type = "") {
  const element = getMessageElement(form);

  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `form-message ${type}`.trim();
}

function setSubmitButtonLoading(form, loading) {
  const button = form.querySelector(
    'button[type="submit"]'
  );

  if (!button) {
    return;
  }

  if (loading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Preparing payment...";
  } else {
    button.disabled = false;

    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
  }
}

async function submitMembershipForm(form) {
  const type = form.dataset.form;

  if (!REGISTRATION_TYPES[type]) {
    console.warn(
      `Registration type "${type}" is not currently enabled for online payment.`
    );

    setMessage(
      form,
      "This registration type is not currently available for online payment.",
      "error"
    );

    return;
  }

  setSubmitButtonLoading(form, true);
  setMessage(form, "Preparing your application...", "loading");

  try {
    /*
     * Upload documents/images first.
     */
    setMessage(
      form,
      "Uploading your documents...",
      "loading"
    );

    const uploadedFiles = await uploadFormFiles(form);

    /*
     * Collect all normal form fields.
     */
    const formFields = collectFormFields(form);

    /*
     * Add Cloudinary URLs to the registration payload.
     */
    const payload = {
      type,
      ...formFields,
      documents: uploadedFiles,
    };

    /*
     * Send the complete registration to the backend.
     */
    setMessage(
      form,
      "Creating your registration...",
      "loading"
    );

    const response = await fetch(
      `${API_BASE_URL}/payments/registration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          "Could not create your registration."
      );
    }

    /*
     * Paystack checkout.
     */
    setMessage(
      form,
      "Redirecting you to secure payment...",
      "success"
    );

    window.location.href = result.authorizationUrl;
  } catch (error) {
    console.error(
      "Membership submission error:",
      error
    );

    setMessage(
      form,
      error.message ||
        "Something went wrong. Please try again.",
      "error"
    );

    setSubmitButtonLoading(form, false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(
    "form.reg-form"
  );

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      /*
       * Let the browser handle required-field validation.
       */
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      await submitMembershipForm(form);
    });
  });
});