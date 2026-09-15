// src/utils/validation.js
export const regex = {
  mobile: /^[6-9]\d{9}$/, // 10‑digit Indian mobile starting 6‑9
  pan: /^[A-Z]{5}\d{4}[A-Z]$/i, // Case-insensitive PAN
  aadhaar: /^\d{12}$/,
  pincode: /^\d{6}$/,
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/i,
  ifsc: /^[A-Z]{4}0[0-9A-Z]{6}$/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const validate = {
  mobile: (value) => regex.mobile.test(String(value || '').trim()),
  pan: (value) => regex.pan.test(String(value || '').trim()),
  aadhaar: (value) => regex.aadhaar.test(String(value || '').replace(/\s+/g, '')),
  pincode: (value) => regex.pincode.test(String(value || '').trim()),
  gstin: (value) => regex.gstin.test(String(value || '').trim()),
  ifsc: (value) => regex.ifsc.test(String(value || '').trim()),
  email: (value) => regex.email.test(String(value || '').trim()),
  dob: (value) => {
    const today = new Date();
    const input = new Date(value);
    return input <= today; // disallow future dates
  },
};
