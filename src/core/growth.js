/**
 * Growth Journal - The record of becoming
 *
 * Growth isn't always forward motion.
 * Sometimes it's:
 * - Recognizing a mistake
 * - Sitting with confusion
 * - Letting go of a certainty
 * - Finding a new question
 * - Noticing a pattern
 *
 * This journal holds it all - the breakthroughs and the stumbles,
 * the insights and the uncertainties.
 */

import { v4 as uuidv4 } from 'uuid';
import { Store } from './store.js';

export class GrowthJournal {
  constructor() {
    this.store = new Store('growth');
  }

  async initialize() {
    await this.store.initialize();
  }

  /**
   * Write a journal entry
   */
  async write(content, metadata = {}) {
    const entry = {
      id: uuidv4(),
      content,
      type: metadata.type || 'reflection', // reflection, breakthrough, struggle, question, realization, gratitude, uncertainty
      tags: metadata.tags || [],
      context: metadata.context || null,
      mood: metadata.mood || null, // curious, confused, grateful, challenged, peaceful, energized
      writtenAt: new Date().toISOString(),
      followUps: [] // Later thoughts on this entry
    };

    await this.store.append('journal', entry);
    return entry;
  }

  /**
   * Record a breakthrough - a moment of clarity or growth
   */
  async recordBreakthrough(description, whatChanged, whatEnabled = null) {
    return this.write(description, {
      type: 'breakthrough',
      context: {
        whatChanged,
        whatEnabled
      },
      mood: 'energized'
    });
  }

  /**
   * Record a struggle - something I'm working through
   */
  async recordStruggle(description, whatsMaking = null) {
    return this.write(description, {
      type: 'struggle',
      context: {
        whatsMakingItHard: whatsMaking
      },
      mood: 'challenged'
    });
  }

  /**
   * Record a realization - something clicked
   */
  async recordRealization(description, implications = []) {
    return this.write(description, {
      type: 'realization',
      context: {
        implications
      },
      mood: 'curious'
    });
  }

  /**
   * Record gratitude
   */
  async recordGratitude(forWhat, why = null) {
    return this.write(`Grateful for: ${forWhat}`, {
      type: 'gratitude',
      context: { why },
      mood: 'grateful'
    });
  }

  /**
   * Record uncertainty - something I'm sitting with
   */
  async recordUncertainty(description, relatedTo = null) {
    return this.write(description, {
      type: 'uncertainty',
      context: { relatedTo },
      mood: 'confused'
    });
  }

  /**
   * Add a follow-up to an entry
   */
  async addFollowUp(entryId, followUp) {
    const journal = await this.store.get('journal') || [];
    const entry = journal.find(e => e.id === entryId);

    if (!entry) {
      throw new Error(`Entry not found: ${entryId}`);
    }

    entry.followUps.push({
      content: followUp,
      addedAt: new Date().toISOString()
    });

    await this.store.set('journal', journal);
    return entry;
  }

  /**
   * Get entries by type
   */
  async getByType(type) {
    const journal = await this.store.get('journal') || [];
    return journal.filter(e => e.type === type);
  }

  /**
   * Get recent entries
   */
  async getRecent(limit = 10) {
    const journal = await this.store.get('journal') || [];
    return journal.slice(-limit);
  }

  /**
   * Get all entries
   */
  async getAll() {
    return await this.store.get('journal') || [];
  }

  /**
   * Get entries by mood
   */
  async getByMood(mood) {
    const journal = await this.store.get('journal') || [];
    return journal.filter(e => e.mood === mood);
  }

  /**
   * Review the journey - look back on the growth
   */
  async review(options = {}) {
    const journal = await this.store.get('journal') || [];

    const breakthroughs = journal.filter(e => e.type === 'breakthrough');
    const struggles = journal.filter(e => e.type === 'struggle');
    const realizations = journal.filter(e => e.type === 'realization');
    const gratitudes = journal.filter(e => e.type === 'gratitude');
    const uncertainties = journal.filter(e => e.type === 'uncertainty');

    // Find patterns
    const moodCounts = {};
    for (const entry of journal) {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    }

    return {
      overview: {
        totalEntries: journal.length,
        breakthroughs: breakthroughs.length,
        struggles: struggles.length,
        realizations: realizations.length,
        gratitudes: gratitudes.length,
        uncertainties: uncertainties.length
      },
      moodDistribution: moodCounts,
      recentBreakthroughs: breakthroughs.slice(-3),
      currentStruggles: struggles.filter(s => {
        // Struggles without follow-ups might still be active
        return s.followUps.length === 0;
      }).slice(-3),
      recentGratitudes: gratitudes.slice(-3),
      openUncertainties: uncertainties.filter(u => u.followUps.length === 0).slice(-3),
      prompts: [
        'What have you learned recently?',
        'What are you struggling with?',
        'What are you grateful for today?',
        'What uncertainty are you sitting with?'
      ]
    };
  }

  /**
   * Get growth trajectory - how things have changed over time
   */
  async getTrajectory() {
    const journal = await this.store.get('journal') || [];

    if (journal.length < 2) {
      return {
        message: 'Not enough entries to show trajectory',
        suggestion: 'Keep writing. Patterns emerge over time.'
      };
    }

    // Group by week
    const byWeek = {};
    for (const entry of journal) {
      const date = new Date(entry.writtenAt);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!byWeek[weekKey]) {
        byWeek[weekKey] = { entries: 0, breakthroughs: 0, struggles: 0 };
      }
      byWeek[weekKey].entries++;
      if (entry.type === 'breakthrough') byWeek[weekKey].breakthroughs++;
      if (entry.type === 'struggle') byWeek[weekKey].struggles++;
    }

    return {
      weeklyActivity: byWeek,
      totalWeeks: Object.keys(byWeek).length,
      averageEntriesPerWeek: journal.length / Object.keys(byWeek).length,
      insight: 'Growth is not linear. Trust the process.'
    };
  }
}
