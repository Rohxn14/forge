import { api } from '../api/client';

export const spanishDomain = {
  async getLevel(): Promise<number> {
    const state = await api.getSpanishState();
    return state.currentLevel;
  },

  async logPractice(): Promise<void> {
    // Just log that practice happened, don't level up
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'spanish',
      eventType: 'practice_completed',
      data: {},
      metadata: { source: 'manual' },
    });
  },

  async levelUp(): Promise<number> {
    const result = await api.spanishLevelUp();
    
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'spanish',
      eventType: 'level_up',
      data: { level: result.currentLevel },
      metadata: { source: 'manual' },
    });

    return result.currentLevel;
  },

  async getLogs() {
    return api.getEvents('spanish');
  },
};