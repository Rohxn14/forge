const API_BASE = 'http://localhost:3001/api';

export const api = {
  // Challenge
  getChallenge: () => fetch(`${API_BASE}/challenge`).then(r => r.json()),
  createChallenge: (data: any) => fetch(`${API_BASE}/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),

  // Days
  getDay: (date: string) => fetch(`${API_BASE}/days/${date}`).then(r => r.json()),
  saveDay: (data: any) => fetch(`${API_BASE}/days`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  getAllDays: () => fetch(`${API_BASE}/days`).then(r => r.json()),

  // Events
  createEvent: (data: any) => fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  getEvents: (domain?: string) => {
    const url = domain ? `${API_BASE}/events?domain=${domain}` : `${API_BASE}/events`;
    return fetch(url).then(r => r.json());
  },

  // Books
  getBooks: () => fetch(`${API_BASE}/books`).then(r => r.json()),
  createBook: (data: any) => fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  updateBook: (id: string, data: any) => fetch(`${API_BASE}/books/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),

  // Spanish
  getSpanishState: () => fetch(`${API_BASE}/spanish`).then(r => r.json()),
  spanishLevelUp: () => fetch(`${API_BASE}/spanish/level-up`, {
    method: 'POST',
  }).then(r => r.json()),
  spanishReset: () => fetch(`${API_BASE}/spanish/reset`, {
    method: 'POST',
  }).then(r => r.json()),

  // Speaking
  getSpeakingState: () => fetch(`${API_BASE}/speaking`).then(r => r.json()),
  speakingLevelUp: () => fetch(`${API_BASE}/speaking/level-up`, {
    method: 'POST',
  }).then(r => r.json()),
};