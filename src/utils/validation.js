/**
 * Validation Utilities
 *
 * Common validation and sanitization functions.
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format (http/https only)
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Sanitize string input (trim and escape HTML)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (str === null || str === undefined) {
    return '';
  }

  if (typeof str !== 'string') {
    return String(str);
  }

  // Trim whitespace
  let sanitized = str.trim();

  // Escape HTML entities
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  sanitized = sanitized.replace(/[&<>"']/g, (char) => htmlEntities[char]);

  return sanitized;
};

/**
 * Validate required fields are present
 * @param {Object} data - Data object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {string[]} Array of missing field names (empty if all present)
 */
const validateRequiredFields = (data, requiredFields) => {
  const missing = [];

  for (const field of requiredFields) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      missing.push(field);
    }
  }

  return missing;
};

/**
 * Validate that a value is within a numeric range
 * @param {number} value - Value to check
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if within range
 */
const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate string length
 * @param {string} str - String to check
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if within length bounds
 */
const isValidLength = (str, minLength, maxLength) => {
  if (typeof str !== 'string') {
    return false;
  }
  return str.length >= minLength && str.length <= maxLength;
};

module.exports = {
  isValidEmail,
  isValidUrl,
  sanitizeString,
  validateRequiredFields,
  isInRange,
  isValidLength
};
