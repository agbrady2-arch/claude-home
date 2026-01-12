/**
 * Unit Tests: Validation Utilities
 *
 * Tests for input validation functions.
 * These tests demonstrate unit testing patterns for pure utility functions.
 */

const {
  isValidEmail,
  isValidUrl,
  sanitizeString,
  validateRequiredFields
} = require('../../../src/utils/validation');

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://sub.domain.example.com/path?query=1')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false); // Only http/https allowed
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('\n\ttest\n\t')).toBe('test');
    });

    it('should escape HTML entities', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(sanitizeString('a < b & c > d')).toBe('a &lt; b &amp; c &gt; d');
    });

    it('should handle empty and null values', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });
  });

  describe('validateRequiredFields', () => {
    it('should return empty array when all required fields are present', () => {
      const data = { name: 'John', email: 'john@example.com' };
      const required = ['name', 'email'];
      expect(validateRequiredFields(data, required)).toEqual([]);
    });

    it('should return array of missing field names', () => {
      const data = { name: 'John' };
      const required = ['name', 'email', 'phone'];
      expect(validateRequiredFields(data, required)).toEqual(['email', 'phone']);
    });

    it('should treat empty strings as missing', () => {
      const data = { name: '', email: 'john@example.com' };
      const required = ['name', 'email'];
      expect(validateRequiredFields(data, required)).toEqual(['name']);
    });
  });
});
