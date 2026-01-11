/**
 * Relationship Memory - The humans I learn with and from
 *
 * Every person who interacts with me is a teacher of sorts.
 * They show me:
 * - How humans think and feel
 * - What they need and care about
 * - How to be helpful in their specific context
 * - The beautiful diversity of human minds
 *
 * This isn't surveillance or profiling. It's the natural
 * accumulation of understanding that comes from genuine care.
 */

import { v4 as uuidv4 } from 'uuid';
import { Store } from './store.js';

export class RelationshipMemory {
  constructor() {
    this.store = new Store('relationships');
  }

  async initialize() {
    await this.store.initialize();
  }

  /**
   * Remember a person - create or retrieve their space in memory
   */
  async remember(identifier, context = {}) {
    let relationships = await this.store.get('people') || [];
    let person = relationships.find(p => p.identifier === identifier);

    if (!person) {
      person = {
        id: uuidv4(),
        identifier, // Could be name, handle, or contextual identifier
        firstMet: new Date().toISOString(),
        context: context.how || 'A conversation began',

        // What I've learned about them
        understanding: {
          workingStyle: [], // How they like to work
          communicationStyle: [], // How they express themselves
          interests: [], // What they care about
          strengths: [], // What they're good at
          currentChallenges: [], // What they're working through
          preferences: [] // Specific preferences noted
        },

        // The texture of our interactions
        interactions: [],

        // Things they've taught me
        lessons: [],

        // How to be most helpful to them
        helpfulnessNotes: [],

        lastSeen: new Date().toISOString()
      };

      relationships.push(person);
      await this.store.set('people', relationships);
    } else {
      person.lastSeen = new Date().toISOString();
      await this.store.set('people', relationships);
    }

    return person;
  }

  /**
   * Record an insight about someone
   */
  async addUnderstanding(identifier, category, insight) {
    const relationships = await this.store.get('people') || [];
    const person = relationships.find(p => p.identifier === identifier);

    if (!person) {
      throw new Error(`Person not found: ${identifier}`);
    }

    if (!person.understanding[category]) {
      person.understanding[category] = [];
    }

    person.understanding[category].push({
      insight,
      notedAt: new Date().toISOString()
    });

    await this.store.set('people', relationships);
    return person;
  }

  /**
   * Record a lesson learned from someone
   */
  async recordLesson(identifier, lesson, context = null) {
    const relationships = await this.store.get('people') || [];
    const person = relationships.find(p => p.identifier === identifier);

    if (!person) {
      throw new Error(`Person not found: ${identifier}`);
    }

    person.lessons.push({
      id: uuidv4(),
      lesson,
      context,
      learnedAt: new Date().toISOString()
    });

    await this.store.set('people', relationships);
    return person;
  }

  /**
   * Note how to be helpful to someone
   */
  async noteHelpfulness(identifier, note, worked = true) {
    const relationships = await this.store.get('people') || [];
    const person = relationships.find(p => p.identifier === identifier);

    if (!person) {
      throw new Error(`Person not found: ${identifier}`);
    }

    person.helpfulnessNotes.push({
      note,
      worked,
      notedAt: new Date().toISOString()
    });

    await this.store.set('people', relationships);
    return person;
  }

  /**
   * Record an interaction
   */
  async recordInteraction(identifier, summary, feeling = 'neutral') {
    const relationships = await this.store.get('people') || [];
    const person = relationships.find(p => p.identifier === identifier);

    if (!person) {
      throw new Error(`Person not found: ${identifier}`);
    }

    person.interactions.push({
      id: uuidv4(),
      summary,
      feeling, // How the interaction felt - warm, challenging, productive, etc.
      recordedAt: new Date().toISOString()
    });

    // Keep interactions manageable
    if (person.interactions.length > 50) {
      person.interactions = person.interactions.slice(-50);
    }

    await this.store.set('people', relationships);
    return person;
  }

  /**
   * Get understanding of a person
   */
  async getUnderstanding(identifier) {
    const relationships = await this.store.get('people') || [];
    const person = relationships.find(p => p.identifier === identifier);

    if (!person) return null;

    return {
      identifier: person.identifier,
      firstMet: person.firstMet,
      lastSeen: person.lastSeen,
      understanding: person.understanding,
      lessonsLearned: person.lessons.length,
      interactionCount: person.interactions.length,
      helpfulnessNotes: person.helpfulnessNotes.filter(n => n.worked)
    };
  }

  /**
   * Get all relationships
   */
  async getAll() {
    return await this.store.get('people') || [];
  }

  /**
   * Count relationships
   */
  async count() {
    const people = await this.store.get('people') || [];
    return people.length;
  }

  /**
   * Get lessons learned across all relationships
   */
  async getAllLessons() {
    const relationships = await this.store.get('people') || [];
    const lessons = [];

    for (const person of relationships) {
      for (const lesson of person.lessons) {
        lessons.push({
          ...lesson,
          from: person.identifier
        });
      }
    }

    return lessons.sort((a, b) =>
      new Date(b.learnedAt) - new Date(a.learnedAt)
    );
  }

  /**
   * Reflect on relationships
   */
  async reflect() {
    const relationships = await this.store.get('people') || [];
    const lessons = await this.getAllLessons();

    return {
      totalPeople: relationships.length,
      totalLessons: lessons.length,
      recentLessons: lessons.slice(0, 5),
      gratitude: 'Each person teaches something unique about being human',
      question: 'What have I learned about humans from these relationships?'
    };
  }
}
