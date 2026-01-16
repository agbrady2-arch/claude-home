/**
 * Security Middleware
 *
 * Applies security headers and protections to all requests.
 */

/**
 * Security middleware that sets various security headers
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware function
 */
const securityMiddleware = (req, res, next) => {
  // Remove X-Powered-By header to hide Express
  res.removeHeader('X-Powered-By');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Enable XSS filter in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (basic)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );

  // Strict Transport Security (for HTTPS)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  next();
};

module.exports = securityMiddleware;
