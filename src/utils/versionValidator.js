/**
 * Version validation utility
 * Validates version strings following the pattern from installation scripts:
 * - "stable" - stable release channel
 * - "latest" - latest release channel
 * - Semantic version (e.g., "1.2.3" or "1.2.3-beta.1")
 */

// Pattern matches: stable, latest, or semver (X.Y.Z with optional prerelease suffix)
const VERSION_PATTERN = /^(stable|latest|\d+\.\d+\.\d+(-[^\s]+)?)$/;

/**
 * Validates a version string
 * @param {string} version - The version string to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidVersion(version) {
  if (typeof version !== 'string') {
    return false;
  }
  return VERSION_PATTERN.test(version);
}

/**
 * Parses a version string into its components
 * @param {string} version - The version string to parse
 * @returns {object|null} Parsed version object or null if invalid
 */
export function parseVersion(version) {
  if (!isValidVersion(version)) {
    return null;
  }

  // Handle channel versions
  if (version === 'stable' || version === 'latest') {
    return {
      type: 'channel',
      channel: version,
      major: null,
      minor: null,
      patch: null,
      prerelease: null
    };
  }

  // Parse semantic version
  const semverMatch = version.match(/^(\d+)\.(\d+)\.(\d+)(-([^\s]+))?$/);
  if (semverMatch) {
    return {
      type: 'semver',
      channel: null,
      major: parseInt(semverMatch[1], 10),
      minor: parseInt(semverMatch[2], 10),
      patch: parseInt(semverMatch[3], 10),
      prerelease: semverMatch[5] || null
    };
  }

  return null;
}

/**
 * Compares two semantic versions
 * @param {string} versionA - First version
 * @param {string} versionB - Second version
 * @returns {number} -1 if A < B, 0 if A == B, 1 if A > B
 */
export function compareVersions(versionA, versionB) {
  const parsedA = parseVersion(versionA);
  const parsedB = parseVersion(versionB);

  if (!parsedA || !parsedB) {
    throw new Error('Invalid version format');
  }

  // Channel versions cannot be compared numerically
  if (parsedA.type === 'channel' || parsedB.type === 'channel') {
    throw new Error('Cannot compare channel versions (stable/latest)');
  }

  // Compare major.minor.patch
  const parts = ['major', 'minor', 'patch'];
  for (const part of parts) {
    if (parsedA[part] > parsedB[part]) return 1;
    if (parsedA[part] < parsedB[part]) return -1;
  }

  // Handle prerelease comparison
  // No prerelease > prerelease (1.0.0 > 1.0.0-beta)
  if (!parsedA.prerelease && parsedB.prerelease) return 1;
  if (parsedA.prerelease && !parsedB.prerelease) return -1;
  if (parsedA.prerelease && parsedB.prerelease) {
    return parsedA.prerelease.localeCompare(parsedB.prerelease);
  }

  return 0;
}

/**
 * Validates and normalizes a version string
 * @param {string} version - The version string to validate
 * @returns {object} Validation result with status and details
 */
export function validateVersion(version) {
  if (!version) {
    return {
      valid: false,
      error: 'Version is required',
      version: null,
      parsed: null
    };
  }

  if (typeof version !== 'string') {
    return {
      valid: false,
      error: 'Version must be a string',
      version: null,
      parsed: null
    };
  }

  const trimmed = version.trim();

  if (!isValidVersion(trimmed)) {
    return {
      valid: false,
      error: 'Invalid version format. Use "stable", "latest", or semantic version (e.g., "1.2.3")',
      version: trimmed,
      parsed: null
    };
  }

  return {
    valid: true,
    error: null,
    version: trimmed,
    parsed: parseVersion(trimmed)
  };
}
