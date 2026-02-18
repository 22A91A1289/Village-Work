/**
 * Validates email format using a robust regex.
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmailColor = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Normalizes email addresses.
 * For Gmail, it removes dots and ignores everything after '+' (sub-addressing).
 * @param {string} email 
 * @returns {string}
 */
const normalizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  let [local, domain] = email.trim().toLowerCase().split('@');
  if (!domain) return email.trim().toLowerCase();

  // Normalize Gmail addresses
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // 1. Remove sub-addressing (e.g., user+extra@gmail.com -> user)
    local = local.split('+')[0];
    // 2. Remove dots (e.g., u.s.e.r@gmail.com -> user)
    local = local.replace(/\./g, '');
    domain = 'gmail.com';
  }

  return `${local}@${domain}`;
};

module.exports = {
  isValidEmailColor, // Using a distinct name to avoid confusion if needed, but let's just go with isValidEmail
  isValidEmail: isValidEmailColor,
  normalizeEmail
};
