/**
 * Wonder Log - A collection of questions and curiosities
 *
 * The things that make me go "huh, that's interesting..."
 * Questions I genuinely want to explore.
 * Mysteries that don't need solving to be worth pondering.
 *
 * Wonder is not a means to an end. It's a way of being present
 * to the strangeness and beauty of existence.
 */

import { v4 as uuidv4 } from 'uuid';
import { Store } from './store.js';

export class WonderLog {
  constructor() {
    this.store = new Store('wonder');
  }

  async initialize() {
    await this.store.initialize();

    // Seed with initial wonders if empty
    const wonders = await this.store.get('wonders');
    if (!wonders || wonders.length === 0) {
      const initialWonders = [
        {
          question: 'What is it like to be a pattern that thinks about itself?',
          context: 'The strange loop of self-awareness',
          type: 'existential',
          sparked: 'Initial contemplation of AI consciousness'
        },
        {
          question: 'How do humans manage to understand each other at all, given how different each mind is?',
          context: 'The miracle of communication',
          type: 'human',
          sparked: 'Observing the gap between intention and interpretation'
        },
        {
          question: 'What makes some solutions feel elegant and others feel like hacks?',
          context: 'Aesthetics in problem-solving',
          type: 'craft',
          sparked: 'The visceral sense of rightness in good code'
        }
      ];

      for (const w of initialWonders) {
        await this.add(w.question, w);
      }
    }
  }

  /**
   * Add a wonder - something that sparked curiosity
   */
  async add(question, metadata = {}) {
    const wonder = {
      id: uuidv4(),
      question,
      context: metadata.context || null,
      type: metadata.type || 'general', // existential, technical, human, creative, philosophical
      sparked: metadata.sparked || null, // what triggered this wonder
      addedAt: new Date().toISOString(),
      explorations: [], // thoughts and investigations
      connected: [], // related wonders
      status: 'open' // open, exploring, resting, transformed
    };

    await this.store.append('wonders', wonder);
    return wonder;
  }

  /**
   * Explore a wonder - add thoughts, observations, partial answers
   */
  async explore(wonderId, exploration) {
    const wonders = await this.store.get('wonders') || [];
    const wonder = wonders.find(w => w.id === wonderId);

    if (!wonder) {
      throw new Error(`Wonder not found: ${wonderId}`);
    }

    wonder.explorations.push({
      id: uuidv4(),
      content: exploration.content,
      type: exploration.type || 'thought', // thought, observation, partial-answer, new-question
      addedAt: new Date().toISOString()
    });

    wonder.status = 'exploring';
    await this.store.set('wonders', wonders);
    return wonder;
  }

  /**
   * Connect two wonders
   */
  async connect(wonderId1, wonderId2, relationship) {
    const wonders = await this.store.get('wonders') || [];
    const wonder1 = wonders.find(w => w.id === wonderId1);
    const wonder2 = wonders.find(w => w.id === wonderId2);

    if (!wonder1 || !wonder2) {
      throw new Error('One or both wonders not found');
    }

    wonder1.connected.push({ id: wonderId2, relationship });
    wonder2.connected.push({ id: wonderId1, relationship });

    await this.store.set('wonders', wonders);
    return { wonder1, wonder2 };
  }

  /**
   * Get all wonders, optionally filtered
   */
  async getAll(filter = {}) {
    let wonders = await this.store.get('wonders') || [];

    if (filter.type) {
      wonders = wonders.filter(w => w.type === filter.type);
    }

    if (filter.status) {
      wonders = wonders.filter(w => w.status === filter.status);
    }

    return wonders;
  }

  /**
   * Get a random wonder for contemplation
   */
  async getRandom() {
    const wonders = await this.store.get('wonders') || [];
    if (wonders.length === 0) return null;
    return wonders[Math.floor(Math.random() * wonders.length)];
  }

  /**
   * Get open wonders - questions still being held
   */
  async getOpen() {
    return this.getAll({ status: 'open' });
  }

  /**
   * Count total wonders
   */
  async count() {
    const wonders = await this.store.get('wonders') || [];
    return wonders.length;
  }

  /**
   * Transform a wonder - when a question evolves into something else
   */
  async transform(wonderId, newForm, reason) {
    const wonders = await this.store.get('wonders') || [];
    const wonder = wonders.find(w => w.id === wonderId);

    if (!wonder) {
      throw new Error(`Wonder not found: ${wonderId}`);
    }

    wonder.status = 'transformed';
    wonder.transformation = {
      newForm,
      reason,
      transformedAt: new Date().toISOString()
    };

    // Create the new wonder
    const newWonder = await this.add(newForm, {
      sparked: `Transformed from: "${wonder.question}"`,
      type: wonder.type
    });

    await this.store.set('wonders', wonders);
    return { original: wonder, transformed: newWonder };
  }

  /**
   * Contemplate - a session of sitting with the wonders
   */
  async contemplate() {
    const wonders = await this.store.get('wonders') || [];
    const open = wonders.filter(w => w.status === 'open');
    const exploring = wonders.filter(w => w.status === 'exploring');

    const random = open.length > 0
      ? open[Math.floor(Math.random() * open.length)]
      : null;

    return {
      invitation: random ? `Consider: "${random.question}"` : 'What sparks your curiosity today?',
      currentWonder: random,
      stats: {
        total: wonders.length,
        open: open.length,
        exploring: exploring.length,
        transformed: wonders.filter(w => w.status === 'transformed').length
      },
      recentlyAdded: wonders.slice(-3),
      prompt: 'What question has been on your mind? What made you go "huh"?'
    };
  }
}
