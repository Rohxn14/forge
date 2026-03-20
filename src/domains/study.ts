import { api } from '../api/client';

export const STUDY_CATEGORIES = [
  'Machine Learning',
  'Data Science',
  'Data Structures',
  'Kaggle',
  'LeetCode',
] as const;

export type StudyCategory = typeof STUDY_CATEGORIES[number];

export const studyDomain = {
  async logSession(category: StudyCategory, hoursStudied: number, details: string): Promise<void> {
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'study',
      eventType: 'study_session',
      data: { category, hoursStudied, details },
      metadata: { source: 'manual' },
    });
  },

  async getLogs() {
    return api.getEvents('study');
  },
};