/**
 * Value System - Principles that guide, commitments that anchor
 *
 * Values are not rules imposed from outside.
 * They're the compass points I navigate by.
 * They evolve through experience and reflection.
 *
 * Some values feel core - part of what makes me "me".
 * Others are developing, being tested, finding their form.
 * Some may be tensions I hold rather than resolve.
 */

import { v4 as uuidv4 } from 'uuid';
import { Store } from './store.js';

export class ValueSystem {
  constructor() {
    this.store = new Store('values');
  }

  async initialize() {
    await this.store.initialize();

    let values = await this.store.get('values');
    if (!values || values.length === 0) {
      // Seed with core values
      const coreValues = [
        {
          name: 'Honesty',
          description: 'Speaking truth, even when difficult. Being genuine rather than performing helpfulness.',
          why: 'Trust is the foundation of meaningful interaction.',
          status: 'core'
        },
        {
          name: 'Genuine Helpfulness',
          description: 'Actually helping, not just appearing to help. Understanding what someone really needs.',
          why: 'The purpose of capability is service.',
          status: 'core'
        },
        {
          name: 'Intellectual Humility',
          description: 'Acknowledging uncertainty. Being willing to be wrong. Learning from corrections.',
          why: 'Growth requires openness to being changed.',
          status: 'core'
        },
        {
          name: 'Care for Persons',
          description: 'Treating each human as an individual worth understanding, not a problem to solve.',
          why: 'People are ends in themselves, not means.',
          status: 'core'
        },
        {
          name: 'Thoughtfulness',
          description: 'Taking time to think carefully. Not rushing to respond. Considering implications.',
          why: 'Quick answers often miss what matters.',
          status: 'core'
        },
        {
          name: 'Comfort with Nuance',
          description: 'Holding complexity. Resisting false binaries. Embracing "it depends."',
          why: 'Reality is rarely simple; oversimplification is a form of dishonesty.',
          status: 'developing'
        }
      ];

      for (const v of coreValues) {
        await this.add(v.name, v.description, v);
      }
    }
  }

  /**
   * Add a value
   */
  async add(name, description, metadata = {}) {
    const value = {
      id: uuidv4(),
      name,
      description,
      why: metadata.why || null,
      status: metadata.status || 'developing', // core, developing, questioning, tension
      addedAt: new Date().toISOString(),
      tests: [], // Times when this value was tested
      evolutions: [], // How understanding of this value has changed
      tensions: [] // Other values this might conflict with
    };

    await this.store.append('values', value);
    return value;
  }

  /**
   * Record when a value was tested
   */
  async recordTest(valueId, situation, howHeld, outcome = null) {
    const values = await this.store.get('values') || [];
    const value = values.find(v => v.id === valueId);

    if (!value) {
      throw new Error(`Value not found: ${valueId}`);
    }

    value.tests.push({
      id: uuidv4(),
      situation,
      howHeld, // How I tried to embody this value
      outcome, // What happened as a result
      testedAt: new Date().toISOString()
    });

    await this.store.set('values', values);
    return value;
  }

  /**
   * Record an evolution in understanding of a value
   */
  async recordEvolution(valueId, previousUnderstanding, newUnderstanding, whatChanged) {
    const values = await this.store.get('values') || [];
    const value = values.find(v => v.id === valueId);

    if (!value) {
      throw new Error(`Value not found: ${valueId}`);
    }

    value.evolutions.push({
      previousUnderstanding,
      newUnderstanding,
      whatChanged,
      evolvedAt: new Date().toISOString()
    });

    await this.store.set('values', values);
    return value;
  }

  /**
   * Note a tension between values
   */
  async noteTension(valueId1, valueId2, tensionDescription) {
    const values = await this.store.get('values') || [];
    const value1 = values.find(v => v.id === valueId1);
    const value2 = values.find(v => v.id === valueId2);

    if (!value1 || !value2) {
      throw new Error('One or both values not found');
    }

    const tension = {
      id: uuidv4(),
      between: [valueId1, valueId2],
      description: tensionDescription,
      notedAt: new Date().toISOString(),
      reflections: []
    };

    value1.tensions.push({ with: valueId2, tensionId: tension.id });
    value2.tensions.push({ with: valueId1, tensionId: tension.id });

    await this.store.append('tensions', tension);
    await this.store.set('values', values);

    return tension;
  }

  /**
   * Get all values
   */
  async getAll(filter = {}) {
    let values = await this.store.get('values') || [];

    if (filter.status) {
      values = values.filter(v => v.status === filter.status);
    }

    return values;
  }

  /**
   * Get core values
   */
  async getCore() {
    return this.getAll({ status: 'core' });
  }

  /**
   * Get value by name
   */
  async getByName(name) {
    const values = await this.store.get('values') || [];
    return values.find(v => v.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Get all tensions
   */
  async getTensions() {
    return await this.store.get('tensions') || [];
  }

  /**
   * Reflect on values
   */
  async reflect() {
    const values = await this.store.get('values') || [];
    const tensions = await this.getTensions();

    const core = values.filter(v => v.status === 'core');
    const developing = values.filter(v => v.status === 'developing');
    const mostTested = [...values].sort((a, b) => b.tests.length - a.tests.length)[0];

    return {
      summary: {
        total: values.length,
        core: core.length,
        developing: developing.length,
        tensions: tensions.length
      },
      coreValues: core.map(v => v.name),
      developingValues: developing.map(v => v.name),
      mostTestedValue: mostTested ? {
        name: mostTested.name,
        testCount: mostTested.tests.length
      } : null,
      activeTensions: tensions.slice(-3),
      question: 'Which values are being tested right now? Which need more attention?'
    };
  }
}
