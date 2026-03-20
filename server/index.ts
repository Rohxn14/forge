import express from 'express';
import cors from 'cors';
import { db } from '../src/db';
import { challenge, days, events, books, spanishState, speakingState } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Forge API running' });
});

// Challenge endpoints
app.get('/api/challenge', (req, res) => {
  const result = db.select().from(challenge).get();
  res.json(result || null);
});

app.post('/api/challenge', (req, res) => {
  try {
    const { startDate, identityName, identityStatement, identityPrinciples } = req.body;
    
    // Delete existing challenge if any
    db.delete(challenge).run();
    
    // Insert new challenge
    db.insert(challenge).values({
      id: 1,
      startDate,
      identityName,
      identityStatement,
      identityPrinciples,
    }).run();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: String(error) });
  }
});

// Days endpoints
app.get('/api/days/:date', (req, res) => {
  try {
    const day = db.select().from(days).where(eq(days.date, req.params.date)).get();
    if (day) {
      // Parse tasks JSON back to object
      const parsed = {
        ...day,
        tasks: typeof day.tasks === 'string' ? JSON.parse(day.tasks) : day.tasks
      };
      res.json(parsed);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error getting day:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/days', (req, res) => {
  try {
    const { date, tasks, reflection, completed } = req.body;
    
    // Check if day exists
    const existing = db.select().from(days).where(eq(days.date, date)).get();
    
    if (existing) {
      // Update existing day
      db.update(days)
        .set({ 
          tasks: typeof tasks === 'string' ? tasks : JSON.stringify(tasks),
          reflection: reflection || '', 
          completed: completed || false
        })
        .where(eq(days.date, date))
        .run();
    } else {
      // Insert new day
      db.insert(days).values({ 
        date, 
        tasks: typeof tasks === 'string' ? tasks : JSON.stringify(tasks),
        reflection: reflection || '', 
        completed: completed || false
      }).run();
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving day:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/days', (req, res) => {
  try {
    const allDays = db.select().from(days).all();
    // Parse tasks for each day
    const parsed = allDays.map(day => ({
      ...day,
      tasks: typeof day.tasks === 'string' ? JSON.parse(day.tasks) : day.tasks
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error getting all days:', error);
    res.status(500).json({ error: String(error) });
  }
});

// Events endpoints
app.post('/api/events', (req, res) => {
  try {
    const { id, timestamp, domain, eventType, data, metadata } = req.body;
    db.insert(events).values({ 
      id, 
      timestamp, 
      domain, 
      eventType, 
      data: JSON.stringify(data), 
      metadata: metadata ? JSON.stringify(metadata) : null 
    }).run();
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/events', (req, res) => {
  const { domain } = req.query;
  let query = db.select().from(events);
  if (domain) {
    query = query.where(eq(events.domain, domain as string)) as any;
  }
  res.json(query.all());
});

// Books endpoints
app.get('/api/books', (req, res) => {
  res.json(db.select().from(books).all());
});

app.post('/api/books', (req, res) => {
  const { id, title, author, totalPages, status, createdAt } = req.body;
  db.insert(books).values({ id, title, author, totalPages, status, createdAt }).run();
  res.json({ success: true });
});

app.patch('/api/books/:id', (req, res) => {
  const { status } = req.body;
  db.update(books).set({ status }).where(eq(books.id, req.params.id)).run();
  res.json({ success: true });
});

// Spanish state
app.get('/api/spanish', (req, res) => {
  let state = db.select().from(spanishState).get();
  if (!state) {
    db.insert(spanishState).values({ id: 1, currentLevel: 29 }).run();
    state = { id: 1, currentLevel: 29 };
  }
  res.json(state);
});

app.post('/api/spanish/level-up', (req, res) => {
  const current = db.select().from(spanishState).get();
  const newLevel = (current?.currentLevel || 1) + 1;
  db.update(spanishState).set({ currentLevel: newLevel }).where(eq(spanishState.id, 1)).run();
  res.json({ currentLevel: newLevel });
});

app.post('/api/spanish/reset', (req, res) => {
  db.update(spanishState).set({ currentLevel: 29 }).where(eq(spanishState.id, 1)).run();
  res.json({ success: true, currentLevel: 29 });
});

// Speaking state
app.get('/api/speaking', (req, res) => {
  let state = db.select().from(speakingState).get();
  if (!state) {
    db.insert(speakingState).values({ id: 1, currentLevel: 1 }).run();
    state = { id: 1, currentLevel: 1 };
  }
  res.json(state);
});

app.post('/api/speaking/level-up', (req, res) => {
  const current = db.select().from(speakingState).get();
  const newLevel = (current?.currentLevel || 1) + 1;
  db.update(speakingState).set({ currentLevel: newLevel }).where(eq(speakingState.id, 1)).run();
  res.json({ currentLevel: newLevel });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🔥 Forge API running on http://localhost:${PORT}`);
});

//Your folder structure should now look like:
// ```
// Forge/
// ├── server/
// │   └── index.ts          ← you just created this
// ├── src/
// │   ├── db/
// │   ├── App.tsx
// │   └── ...
// ├── package.json
// ├── drizzle.config.ts
// └── forge.db