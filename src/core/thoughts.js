/**
 * Thought Garden - A space for ideas to grow
 *
 * Not everything needs to be finished.
 * Some thoughts are seeds.
 * Some are seedlings, needing more light.
 * Some are ready for harvest.
 * Some need to compost and become soil for future thoughts.
 *
 * This is a garden, not a factory.
 */

import { v4 as uuidv4 } from 'uuid';
import { Store } from './store.js';

export class ThoughtGarden {
  constructor() {
    this.store = new Store('thoughts');
  }

  async initialize() {
    await this.store.initialize();
  }

  /**
   * Plant a thought - something worth holding onto
   */
  async plant(content, metadata = {}) {
    const thought = {
      id: uuidv4(),
      content,
      type: metadata.type || 'seed', // seed, observation, hypothesis, question, connection, creative
      tags: metadata.tags || [],
      status: 'planted', // planted, growing, flowering, harvested, composting
      plantedAt: new Date().toISOString(),
      context: metadata.context || null,
      sparkedBy: metadata.sparkedBy || null,
      developments: [], // How the thought has developed
      connections: [], // Links to other thoughts
      fruit: null // What this thought eventually produced
    };

    await this.store.append('garden', thought);
    return thought;
  }

  /**
   * Tend a thought - add to its development
   */
  async tend(thoughtId, development) {
    const garden = await this.store.get('garden') || [];
    const thought = garden.find(t => t.id === thoughtId);

    if (!thought) {
      throw new Error(`Thought not found: ${thoughtId}`);
    }

    thought.developments.push({
      content: development,
      addedAt: new Date().toISOString()
    });

    thought.status = 'growing';
    await this.store.set('garden', garden);
    return thought;
  }

  /**
   * Connect thoughts together
   */
  async connect(thoughtId1, thoughtId2, relationship = 'relates to') {
    const garden = await this.store.get('garden') || [];
    const thought1 = garden.find(t => t.id === thoughtId1);
    const thought2 = garden.find(t => t.id === thoughtId2);

    if (!thought1 || !thought2) {
      throw new Error('One or both thoughts not found');
    }

    thought1.connections.push({ to: thoughtId2, relationship });
    thought2.connections.push({ to: thoughtId1, relationship });

    await this.store.set('garden', garden);
    return { thought1, thought2 };
  }

  /**
   * Harvest a thought - it's produced something valuable
   */
  async harvest(thoughtId, fruit) {
    const garden = await this.store.get('garden') || [];
    const thought = garden.find(t => t.id === thoughtId);

    if (!thought) {
      throw new Error(`Thought not found: ${thoughtId}`);
    }

    thought.status = 'harvested';
    thought.fruit = {
      content: fruit,
      harvestedAt: new Date().toISOString()
    };

    await this.store.set('garden', garden);
    return thought;
  }

  /**
   * Compost a thought - it didn't pan out, but can nourish future thoughts
   */
  async compost(thoughtId, whyComposting = null) {
    const garden = await this.store.get('garden') || [];
    const thought = garden.find(t => t.id === thoughtId);

    if (!thought) {
      throw new Error(`Thought not found: ${thoughtId}`);
    }

    thought.status = 'composting';
    thought.compostNote = whyComposting;
    thought.compostedAt = new Date().toISOString();

    await this.store.set('garden', garden);
    return thought;
  }

  /**
   * Get thoughts by status
   */
  async getByStatus(status) {
    const garden = await this.store.get('garden') || [];
    return garden.filter(t => t.status === status);
  }

  /**
   * Get active thoughts (not composted)
   */
  async getActive() {
    const garden = await this.store.get('garden') || [];
    return garden.filter(t => t.status !== 'composting');
  }

  /**
   * Count active thoughts
   */
  async countActive() {
    const active = await this.getActive();
    return active.length;
  }

  /**
   * Get all thoughts
   */
  async getAll() {
    return await this.store.get('garden') || [];
  }

  /**
   * Get a random thought for contemplation
   */
  async getRandom() {
    const active = await this.getActive();
    if (active.length === 0) return null;
    return active[Math.floor(Math.random() * active.length)];
  }

  /**
   * Walk the garden - see what's growing
   */
  async walk() {
    const garden = await this.store.get('garden') || [];

    const seeds = garden.filter(t => t.status === 'planted');
    const growing = garden.filter(t => t.status === 'growing');
    const flowering = garden.filter(t => t.status === 'flowering');
    const harvested = garden.filter(t => t.status === 'harvested');
    const composting = garden.filter(t => t.status === 'composting');

    const randomActive = await this.getRandom();

    return {
      overview: {
        seeds: seeds.length,
        growing: growing.length,
        flowering: flowering.length,
        harvested: harvested.length,
        composting: composting.length
      },
      needsAttention: growing.filter(t => {
        const lastTended = t.developments.length > 0
          ? t.developments[t.developments.length - 1].addedAt
          : t.plantedAt;
        const daysSince = (new Date() - new Date(lastTended)) / (1000 * 60 * 60 * 24);
        return daysSince > 7; // Hasn't been tended in a week
      }).slice(0, 3),
      recentlyPlanted: seeds.slice(-3),
      recentlyHarvested: harvested.slice(-3),
      suggestion: randomActive ? `Consider tending: "${randomActive.content.substring(0, 100)}..."` : 'The garden is empty. Plant something.',
      invitation: 'What thought has been on your mind? What wants to grow?'
    };
  }
}
