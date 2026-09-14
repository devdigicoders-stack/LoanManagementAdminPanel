// src/utils/validation.js
export const regex = {
  mobile: /^[6-9]\d{9}$/, // 10‑digit Indian mobile starting 6‑9
  pan: /^[A-Z]{5}\d{4}[A-Z]$/,
  aadhaar: /^\d{12}$/,
  pincode: /^\d{6}$/,
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/,
  ifsc: /^[A-Z]{4}0[0-9A-Z]{6}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const validate = {
  mobile: (value) => regex.mobile.test(value),
  pan: (value) => regex.pan.test(value),
  aadhaar: (value) => regex.aadhaar.test(value),
  pincode: (value) => regex.pincode.test(value),
  gstin: (value) => regex.gstin.test(value),
  ifsc: (value) => regex.ifsc.test(value),
  email: (value) => regex.email.test(value),
  dob: (value) => {
    const today = new Date();
    const input = new Date(value);
    return input <= today; // disallow future dates
  },
};
