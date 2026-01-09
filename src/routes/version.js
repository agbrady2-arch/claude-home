import { Router } from 'express';
import { validateVersion, compareVersions, parseVersion } from '../utils/versionValidator.js';

export const versionRouter = Router();

/**
 * POST /api/version/validate
 * Validates a version string
 * Body: { "version": "1.2.3" }
 */
versionRouter.post('/validate', (req, res) => {
  const { version } = req.body;
  const result = validateVersion(version);

  if (result.valid) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

/**
 * POST /api/version/compare
 * Compares two versions
 * Body: { "versionA": "1.2.3", "versionB": "1.2.4" }
 */
versionRouter.post('/compare', (req, res) => {
  const { versionA, versionB } = req.body;

  const validationA = validateVersion(versionA);
  const validationB = validateVersion(versionB);

  if (!validationA.valid) {
    return res.status(400).json({
      error: `Invalid versionA: ${validationA.error}`,
      field: 'versionA'
    });
  }

  if (!validationB.valid) {
    return res.status(400).json({
      error: `Invalid versionB: ${validationB.error}`,
      field: 'versionB'
    });
  }

  try {
    const comparison = compareVersions(versionA, versionB);
    res.json({
      versionA: validationA.parsed,
      versionB: validationB.parsed,
      result: comparison,
      description: comparison < 0 ? `${versionA} < ${versionB}` :
                   comparison > 0 ? `${versionA} > ${versionB}` :
                   `${versionA} == ${versionB}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/version/parse/:version
 * Parses a version string into components
 */
versionRouter.get('/parse/:version', (req, res) => {
  const { version } = req.params;
  const result = validateVersion(version);

  if (result.valid) {
    res.json(result.parsed);
  } else {
    res.status(400).json({ error: result.error });
  }
});
