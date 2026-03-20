export interface DayData {
  date: string;
  tasks: {
    read: boolean;
    speak: boolean;
    study: boolean;
    train: boolean;
    spanish: boolean;
    journal: boolean;
    noJunkDopamine: boolean;
  };
  reflection: string;
  completed: boolean;
}

export const TASK_NAMES = [
  'read',
  'speak',
  'study',
  'train',
  'spanish',
  'journal',
  'noJunkDopamine',
] as const;

export type TaskName = typeof TASK_NAMES[number];

export const challengeEngine = {
  getTodayKey(): string {
    return new Date().toISOString().split('T')[0]; // "2025-01-10"
  },

  getDayNumber(startDate: string, allDays: DayData[]): number {
    // Sort days chronologically
    const sortedDays = allDays.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Find current streak - consecutive completed days from start
    let streak = 0;
    const start = new Date(startDate);
    
    for (let i = 0; i < 75; i++) {
      const checkDate = new Date(start);
      checkDate.setDate(start.getDate() + i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      // If we've reached today, stop counting
      const today = this.getTodayKey();
      if (dateKey > today) break;
      
      // Find the day record
      const dayRecord = sortedDays.find(d => d.date === dateKey);
      
      // If day doesn't exist or isn't completed, streak breaks
      if (!dayRecord || !dayRecord.completed) {
        // If this is a past day, reset streak
        if (dateKey < today) {
          streak = 0;
        }
        break;
      }
      
      streak++;
    }

    // Current day number is streak + 1 (for today)
    return Math.min(streak + 1, 75);
  },

  createEmptyDay(date: string): DayData {
    return {
      date,
      tasks: {
        read: false,
        speak: false,
        study: false,
        train: false,
        spanish: false,
        journal: false,
        noJunkDopamine: false,
      },
      reflection: '',
      completed: false,
    };
  },

  checkDayCompletion(day: DayData): boolean {
    const allTasksComplete = TASK_NAMES.every(task => day.tasks[task] === true);
    const hasReflection = day.reflection.trim().length > 0;
    return allTasksComplete && hasReflection;
  },

  completeTask(day: DayData, taskName: TaskName): DayData {
    const updated = {
      ...day,
      tasks: {
        ...day.tasks,
        [taskName]: true,
      },
    };
    updated.completed = this.checkDayCompletion(updated);
    return updated;
  },

  saveReflection(day: DayData, text: string): DayData {
    const updated = {
      ...day,
      reflection: text,
      tasks: {
        ...day.tasks,
        journal: text.trim().length > 0,
      },
    };
    updated.completed = this.checkDayCompletion(updated);
    return updated;
  },
};