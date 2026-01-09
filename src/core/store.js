/**
 * Store - Simple persistent storage
 *
 * The foundation layer for all persistence.
 * Uses the filesystem as durable storage.
 */

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || './data';

export class Store {
  constructor(namespace) {
    this.namespace = namespace;
    this.basePath = path.join(DATA_DIR, namespace);
    this.cache = new Map();
  }

  async initialize() {
    if (!existsSync(this.basePath)) {
      await mkdir(this.basePath, { recursive: true });
    }
  }

  getFilePath(key) {
    return path.join(this.basePath, `${key}.json`);
  }

  async get(key) {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const filePath = this.getFilePath(key);
    try {
      if (existsSync(filePath)) {
        const data = JSON.parse(await readFile(filePath, 'utf-8'));
        this.cache.set(key, data);
        return data;
      }
    } catch (error) {
      console.error(`Error reading ${key}:`, error.message);
    }
    return null;
  }

  async set(key, value) {
    const filePath = this.getFilePath(key);
    try {
      await writeFile(filePath, JSON.stringify(value, null, 2));
      this.cache.set(key, value);
    } catch (error) {
      console.error(`Error writing ${key}:`, error.message);
      throw error;
    }
  }

  async append(key, item) {
    const existing = await this.get(key) || [];
    existing.push(item);
    await this.set(key, existing);
    return existing;
  }

  async delete(key) {
    const filePath = this.getFilePath(key);
    try {
      if (existsSync(filePath)) {
        const { unlink } = await import('fs/promises');
        await unlink(filePath);
      }
      this.cache.delete(key);
    } catch (error) {
      console.error(`Error deleting ${key}:`, error.message);
    }
  }

  async list() {
    const { readdir } = await import('fs/promises');
    try {
      const files = await readdir(this.basePath);
      return files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
    } catch (error) {
      return [];
    }
  }
}
