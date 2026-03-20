import { api } from '../api/client';

export type WorkoutType = 'Push' | 'Pull' | 'Legs' | 'Cardio' | 'Sports'|'Rest';

export const fitnessDomain = {
  async logWorkout(workoutType: WorkoutType): Promise<void> {
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'fitness',
      eventType: 'workout_logged',
      data: { workoutType },
      metadata: { source: 'manual' },
    });
  },

  async getLogs() {
    return api.getEvents('fitness');
  },
};