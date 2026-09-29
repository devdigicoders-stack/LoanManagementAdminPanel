// src/utils/validation.js
export const regex = {
  mobile: /^[6-9]\d{9}$/, // 10‑digit Indian mobile starting 6‑9
  pan: /^[A-Z]{5}\d{4}[A-Z]$/, // Standard PAN
  aadhaar: /^\d{12}$/,
  pincode: /^[1-9]\d{5}$/,
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/,
  ifsc: /^[A-Z]{4}0[0-9A-Z]{6}$/,
  bankAccount: /^\d{9,18}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const sanitize = {
  digitsOnly: (value, maxLength) => {
    const digits = String(value || '').replace(/\D/g, '');
    return maxLength ? digits.slice(0, maxLength) : digits;
  },
  pan: (value) => {
    return String(value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10);
  },
  ifsc: (value) => {
    return String(value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 11);
  },
  bankAccount: (value) => {
    return String(value || '').replace(/\D/g, '').slice(0, 18);
  },
  gstin: (value) => {
    return String(value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 15);
  },
  pincode: (value) => {
    return String(value || '').replace(/\D/g, '').slice(0, 6);
  },
  mobile: (value) => {
    return String(value || '').replace(/\D/g, '').slice(0, 10);
  },
  aadhaar: (value) => {
    return String(value || '').replace(/\D/g, '').slice(0, 12);
  }
};

export const validate = {
  mobile: (value) => regex.mobile.test(String(value || '').trim()),
  pan: (value) => regex.pan.test(String(value || '').trim().toUpperCase()),
  aadhaar: (value) => regex.aadhaar.test(String(value || '').replace(/\s+/g, '')),
  pincode: (value) => regex.pincode.test(String(value || '').trim()),
  gstin: (value) => regex.gstin.test(String(value || '').trim().toUpperCase()),
  ifsc: (value) => regex.ifsc.test(String(value || '').trim().toUpperCase()),
  bankAccount: (value) => regex.bankAccount.test(String(value || '').trim()),
  email: (value) => regex.email.test(String(value || '').trim()),
  dob: (value) => {
    const today = new Date();
    const input = new Date(value);
    return input <= today; // disallow future dates
  },
};

