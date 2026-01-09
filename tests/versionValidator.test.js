import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isValidVersion,
  parseVersion,
  compareVersions,
  validateVersion
} from '../src/utils/versionValidator.js';

describe('isValidVersion', () => {
  it('should accept "stable"', () => {
    assert.strictEqual(isValidVersion('stable'), true);
  });

  it('should accept "latest"', () => {
    assert.strictEqual(isValidVersion('latest'), true);
  });

  it('should accept semantic versions', () => {
    assert.strictEqual(isValidVersion('1.0.0'), true);
    assert.strictEqual(isValidVersion('0.1.0'), true);
    assert.strictEqual(isValidVersion('10.20.30'), true);
  });

  it('should accept versions with prerelease suffix', () => {
    assert.strictEqual(isValidVersion('1.0.0-alpha'), true);
    assert.strictEqual(isValidVersion('1.0.0-beta.1'), true);
    assert.strictEqual(isValidVersion('2.0.0-rc.1'), true);
  });

  it('should reject invalid versions', () => {
    assert.strictEqual(isValidVersion(''), false);
    assert.strictEqual(isValidVersion('invalid'), false);
    assert.strictEqual(isValidVersion('1.0'), false);
    assert.strictEqual(isValidVersion('1'), false);
    assert.strictEqual(isValidVersion('1.0.0.0'), false);
    assert.strictEqual(isValidVersion('v1.0.0'), false);
    assert.strictEqual(isValidVersion('1.0.0 '), false);
  });

  it('should reject non-string inputs', () => {
    assert.strictEqual(isValidVersion(null), false);
    assert.strictEqual(isValidVersion(undefined), false);
    assert.strictEqual(isValidVersion(123), false);
    assert.strictEqual(isValidVersion({}), false);
  });
});

describe('parseVersion', () => {
  it('should parse channel versions', () => {
    const stable = parseVersion('stable');
    assert.strictEqual(stable.type, 'channel');
    assert.strictEqual(stable.channel, 'stable');

    const latest = parseVersion('latest');
    assert.strictEqual(latest.type, 'channel');
    assert.strictEqual(latest.channel, 'latest');
  });

  it('should parse semantic versions', () => {
    const version = parseVersion('1.2.3');
    assert.strictEqual(version.type, 'semver');
    assert.strictEqual(version.major, 1);
    assert.strictEqual(version.minor, 2);
    assert.strictEqual(version.patch, 3);
    assert.strictEqual(version.prerelease, null);
  });

  it('should parse versions with prerelease', () => {
    const version = parseVersion('1.0.0-beta.1');
    assert.strictEqual(version.type, 'semver');
    assert.strictEqual(version.major, 1);
    assert.strictEqual(version.minor, 0);
    assert.strictEqual(version.patch, 0);
    assert.strictEqual(version.prerelease, 'beta.1');
  });

  it('should return null for invalid versions', () => {
    assert.strictEqual(parseVersion('invalid'), null);
    assert.strictEqual(parseVersion(''), null);
  });
});

describe('compareVersions', () => {
  it('should compare major versions', () => {
    assert.strictEqual(compareVersions('2.0.0', '1.0.0'), 1);
    assert.strictEqual(compareVersions('1.0.0', '2.0.0'), -1);
  });

  it('should compare minor versions', () => {
    assert.strictEqual(compareVersions('1.2.0', '1.1.0'), 1);
    assert.strictEqual(compareVersions('1.1.0', '1.2.0'), -1);
  });

  it('should compare patch versions', () => {
    assert.strictEqual(compareVersions('1.0.2', '1.0.1'), 1);
    assert.strictEqual(compareVersions('1.0.1', '1.0.2'), -1);
  });

  it('should return 0 for equal versions', () => {
    assert.strictEqual(compareVersions('1.0.0', '1.0.0'), 0);
    assert.strictEqual(compareVersions('1.2.3', '1.2.3'), 0);
  });

  it('should handle prerelease versions', () => {
    // Release > prerelease
    assert.strictEqual(compareVersions('1.0.0', '1.0.0-beta'), 1);
    assert.strictEqual(compareVersions('1.0.0-beta', '1.0.0'), -1);
  });

  it('should throw for channel versions', () => {
    assert.throws(() => compareVersions('stable', '1.0.0'), /Cannot compare channel versions/);
    assert.throws(() => compareVersions('1.0.0', 'latest'), /Cannot compare channel versions/);
  });

  it('should throw for invalid versions', () => {
    assert.throws(() => compareVersions('invalid', '1.0.0'), /Invalid version format/);
  });
});

describe('validateVersion', () => {
  it('should return valid result for valid versions', () => {
    const result = validateVersion('1.0.0');
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.error, null);
    assert.strictEqual(result.version, '1.0.0');
    assert.notStrictEqual(result.parsed, null);
  });

  it('should trim whitespace and validate trimmed value', () => {
    const result = validateVersion('  1.0.0  ');
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.version, '1.0.0'); // Trimmed version
  });

  it('should return error for missing version', () => {
    const result = validateVersion(null);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Version is required');
  });

  it('should return error for non-string', () => {
    const result = validateVersion(123);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Version must be a string');
  });

  it('should return error for invalid format', () => {
    const result = validateVersion('invalid');
    assert.strictEqual(result.valid, false);
    assert.ok(result.error.includes('Invalid version format'));
  });
});
