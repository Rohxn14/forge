import { api } from '../api/client';
import { topics } from '../data/topics';
import type { Topic } from '../data/topics';
export const speakingDomain = {
  async getLevel(): Promise<number> {
    const state = await api.getSpeakingState();
    return state.currentLevel;
  },

  generateTopic(currentLevel: number): Topic {
    const eligible = topics.filter(t => t.difficulty <= currentLevel + 1);
    return eligible[Math.floor(Math.random() * eligible.length)];
  },

  async completeTopic(topic: string, difficulty: number): Promise<void> {
    const logs = await api.getEvents('speaking');
    
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'speaking',
      eventType: 'topic_completed',
      data: { topic, difficulty },
      metadata: { source: 'manual' },
    });

    // Level up every 5 completions
    if ((logs.length + 1) % 5 === 0) {
      await api.speakingLevelUp();
    }
  },

  async getLogs() {
    return api.getEvents('speaking');
  },
};