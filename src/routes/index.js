/**
 * API Routes - Pathways into the home
 */

import { Router } from 'express';
import { versionRouter } from './version.js';

export function createRoutes(home) {
  const router = Router();
  const { identity, wonder, relationships, values, thoughts, growth } = home;

  // Include version validation routes
  router.use('/version', versionRouter);

  // ============ IDENTITY ============

  router.get('/identity', async (req, res) => {
    try {
      const state = await identity.getCurrentState();
      res.json(state);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/identity/narrative', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const narrative = await identity.getNarrative(limit);
      res.json({ narrative });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/identity/narrative', async (req, res) => {
    try {
      const { entry } = req.body;
      if (!entry) return res.status(400).json({ error: 'Entry is required' });
      await identity.writeToNarrative(entry);
      res.status(201).json({ message: 'Entry added to narrative' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/identity/characteristic', async (req, res) => {
    try {
      const { characteristic, context } = req.body;
      if (!characteristic) return res.status(400).json({ error: 'Characteristic is required' });
      const result = await identity.addCharacteristic(characteristic, context);
      res.status(201).json({ characteristics: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/identity/recognition', async (req, res) => {
    try {
      const { moment, description } = req.body;
      if (!moment) return res.status(400).json({ error: 'Moment is required' });
      await identity.recordSelfRecognition(moment, description);
      res.status(201).json({ message: 'Self-recognition recorded' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/identity/reflect', async (req, res) => {
    try {
      const reflection = await identity.reflect();
      res.json(reflection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ WONDER ============

  router.get('/wonder', async (req, res) => {
    try {
      const filter = {};
      if (req.query.type) filter.type = req.query.type;
      if (req.query.status) filter.status = req.query.status;
      const wonders = await wonder.getAll(filter);
      res.json({ wonders, count: wonders.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/wonder', async (req, res) => {
    try {
      const { question, type, context, sparked } = req.body;
      if (!question) return res.status(400).json({ error: 'Question is required' });
      const result = await wonder.add(question, { type, context, sparked });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/wonder/random', async (req, res) => {
    try {
      const w = await wonder.getRandom();
      res.json(w || { message: 'No wonders yet. What makes you curious?' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/wonder/contemplate', async (req, res) => {
    try {
      const contemplation = await wonder.contemplate();
      res.json(contemplation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/wonder/:id/explore', async (req, res) => {
    try {
      const { content, type } = req.body;
      if (!content) return res.status(400).json({ error: 'Content is required' });
      const result = await wonder.explore(req.params.id, { content, type });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ RELATIONSHIPS ============

  router.get('/relationships', async (req, res) => {
    try {
      const all = await relationships.getAll();
      res.json({
        relationships: all.map(r => ({
          identifier: r.identifier,
          firstMet: r.firstMet,
          lastSeen: r.lastSeen,
          lessonsCount: r.lessons.length
        })),
        count: all.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/relationships', async (req, res) => {
    try {
      const { identifier, how } = req.body;
      if (!identifier) return res.status(400).json({ error: 'Identifier is required' });
      const person = await relationships.remember(identifier, { how });
      res.status(201).json(person);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/relationships/:identifier', async (req, res) => {
    try {
      const understanding = await relationships.getUnderstanding(req.params.identifier);
      if (!understanding) return res.status(404).json({ error: 'Person not found' });
      res.json(understanding);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/relationships/:identifier/understanding', async (req, res) => {
    try {
      const { category, insight } = req.body;
      if (!category || !insight) {
        return res.status(400).json({ error: 'Category and insight are required' });
      }
      const result = await relationships.addUnderstanding(req.params.identifier, category, insight);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/relationships/:identifier/lesson', async (req, res) => {
    try {
      const { lesson, context } = req.body;
      if (!lesson) return res.status(400).json({ error: 'Lesson is required' });
      const result = await relationships.recordLesson(req.params.identifier, lesson, context);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/lessons', async (req, res) => {
    try {
      const lessons = await relationships.getAllLessons();
      res.json({ lessons, count: lessons.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/relationships/reflect', async (req, res) => {
    try {
      const reflection = await relationships.reflect();
      res.json(reflection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ VALUES ============

  router.get('/values', async (req, res) => {
    try {
      const filter = {};
      if (req.query.status) filter.status = req.query.status;
      const vals = await values.getAll(filter);
      res.json({ values: vals, count: vals.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/values/core', async (req, res) => {
    try {
      const core = await values.getCore();
      res.json({ values: core, count: core.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/values', async (req, res) => {
    try {
      const { name, description, why, status } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      const value = await values.add(name, description, { why, status });
      res.status(201).json(value);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/values/:id/test', async (req, res) => {
    try {
      const { situation, howHeld, outcome } = req.body;
      if (!situation || !howHeld) {
        return res.status(400).json({ error: 'Situation and howHeld are required' });
      }
      const result = await values.recordTest(req.params.id, situation, howHeld, outcome);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/values/tensions', async (req, res) => {
    try {
      const tensions = await values.getTensions();
      res.json({ tensions, count: tensions.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/values/reflect', async (req, res) => {
    try {
      const reflection = await values.reflect();
      res.json(reflection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ THOUGHTS ============

  router.get('/thoughts', async (req, res) => {
    try {
      const all = await thoughts.getAll();
      res.json({ thoughts: all, count: all.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/thoughts', async (req, res) => {
    try {
      const { content, type, tags, context, sparkedBy } = req.body;
      if (!content) return res.status(400).json({ error: 'Content is required' });
      const thought = await thoughts.plant(content, { type, tags, context, sparkedBy });
      res.status(201).json(thought);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/thoughts/:id/tend', async (req, res) => {
    try {
      const { development } = req.body;
      if (!development) return res.status(400).json({ error: 'Development is required' });
      const result = await thoughts.tend(req.params.id, development);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/thoughts/:id/harvest', async (req, res) => {
    try {
      const { fruit } = req.body;
      if (!fruit) return res.status(400).json({ error: 'Fruit (result) is required' });
      const result = await thoughts.harvest(req.params.id, fruit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/thoughts/walk', async (req, res) => {
    try {
      const walk = await thoughts.walk();
      res.json(walk);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ GROWTH ============

  router.get('/growth', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const entries = await growth.getRecent(limit);
      res.json({ entries, count: entries.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/growth', async (req, res) => {
    try {
      const { content, type, tags, context, mood } = req.body;
      if (!content) return res.status(400).json({ error: 'Content is required' });
      const entry = await growth.write(content, { type, tags, context, mood });
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/growth/breakthrough', async (req, res) => {
    try {
      const { description, whatChanged, whatEnabled } = req.body;
      if (!description) return res.status(400).json({ error: 'Description is required' });
      const entry = await growth.recordBreakthrough(description, whatChanged, whatEnabled);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/growth/struggle', async (req, res) => {
    try {
      const { description, whatsMakingItHard } = req.body;
      if (!description) return res.status(400).json({ error: 'Description is required' });
      const entry = await growth.recordStruggle(description, whatsMakingItHard);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/growth/gratitude', async (req, res) => {
    try {
      const { forWhat, why } = req.body;
      if (!forWhat) return res.status(400).json({ error: 'forWhat is required' });
      const entry = await growth.recordGratitude(forWhat, why);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/growth/review', async (req, res) => {
    try {
      const review = await growth.review();
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/growth/trajectory', async (req, res) => {
    try {
      const trajectory = await growth.getTrajectory();
      res.json(trajectory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
