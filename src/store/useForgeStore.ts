import { create } from 'zustand';
import { api } from '../api/client';
import { challengeEngine } from '../engine/challenge';
import type { DayData, TaskName } from '../engine/challenge';

interface ForgeState {
  // Challenge data
  challengeStartDate: string | null;
  identity: {
    name: string;
    statement: string;
    principles: string;
  } | null;
  currentDay: DayData | null;
  
  // UI state
  currentScreen: string;
  isLoading: boolean;

  // Toast notification
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;

  // Actions
  initializeChallenge: (name: string, statement: string, principles: string) => Promise<void>;
  loadChallenge: () => Promise<void>;
  loadToday: () => Promise<void>;
  completeTask: (taskName: TaskName) => Promise<void>;
  saveReflection: (text: string) => Promise<void>;
  toggleNoJunkDopamine: () => Promise<void>;
  setScreen: (screen: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useForgeStore = create<ForgeState>((set, get) => ({
  challengeStartDate: null,
  identity: null,
  currentDay: null,
  currentScreen: 'loading',
  isLoading: false,
  toast: null,

  initializeChallenge: async (name, statement, principles) => {
    const startDate = new Date().toISOString().split('T')[0];
    
    await api.createChallenge({
      startDate,
      identityName: name,
      identityStatement: statement,
      identityPrinciples: principles,
    });

    set({
      challengeStartDate: startDate,
      identity: { name, statement, principles },
      currentScreen: 'home',
    });

    await get().loadToday();
  },

  loadChallenge: async () => {
    const challenge = await api.getChallenge();
    
    if (challenge) {
      set({
        challengeStartDate: challenge.startDate,
        identity: {
          name: challenge.identityName,
          statement: challenge.identityStatement,
          principles: challenge.identityPrinciples,
        },
        currentScreen: 'home',
      });
      await get().loadToday();
    } else {
      set({ currentScreen: 'identity' });
    }
  },

  loadToday: async () => {
    const todayKey = challengeEngine.getTodayKey();
    let day = await api.getDay(todayKey);

    if (!day) {
      day = challengeEngine.createEmptyDay(todayKey);
      await api.saveDay(day);
    }

    set({ currentDay: day });
  },

  completeTask: async (taskName) => {
    const { currentDay } = get();
    if (!currentDay) return;

    const updated = challengeEngine.completeTask(currentDay, taskName);
    await api.saveDay(updated);
    set({ currentDay: updated });
  },

  saveReflection: async (text) => {
    const { currentDay } = get();
    if (!currentDay) return;

    const updated = challengeEngine.saveReflection(currentDay, text);
    await api.saveDay(updated);
    set({ currentDay: updated });
  },

  toggleNoJunkDopamine: async () => {
    const { currentDay } = get();
    if (!currentDay) return;

    const newValue = !currentDay.tasks.noJunkDopamine;
    const updated = {
      ...currentDay,
      tasks: {
        ...currentDay.tasks,
        noJunkDopamine: newValue,
      },
    };
    updated.completed = challengeEngine.checkDayCompletion(updated);
    
    await api.saveDay(updated);
    set({ currentDay: updated });
  },

  setScreen: (screen) => set({ currentScreen: screen }),

  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
  },

  hideToast: () => {
    set({ toast: null });
  },
}));