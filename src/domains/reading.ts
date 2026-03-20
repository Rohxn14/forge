import { api } from '../api/client';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

export interface ReadingLog {
  id: string;
  timestamp: string;
  domain: string;
  eventType: string;
  data: {
    bookId: string;
    pagesRead: number;
    currentPage: number;
  };
}

export const readingDomain = {
  async startBook(title: string, author: string, totalPages: number): Promise<Book> {
    const books = await api.getBooks();
    
    // Pause all active books
    for (const book of books) {
      if (book.status === 'active') {
        await api.updateBook(book.id, { status: 'paused' });
      }
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      title,
      author,
      totalPages,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await api.createBook(newBook);
    
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'reading',
      eventType: 'book_started',
      data: { bookId: newBook.id, title, author, totalPages },
      metadata: { source: 'manual' },
    });
    
    return newBook;
  },

  async addCompletedBook(title: string, author: string, totalPages: number): Promise<Book> {
    const completedBook: Book = {
      id: crypto.randomUUID(),
      title,
      author,
      totalPages,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    await api.createBook(completedBook);
    
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'reading',
      eventType: 'book_finished',
      data: { bookId: completedBook.id, title, author },
      metadata: { source: 'manual' },
    });
    
    return completedBook;
  },

  async logSession(bookId: string, pagesRead: number, currentPage: number): Promise<void> {
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'reading',
      eventType: 'reading_session',
      data: { bookId, pagesRead, currentPage },
      metadata: { source: 'manual' },
    });
  },

  async finishBook(bookId: string): Promise<void> {
    await api.updateBook(bookId, { status: 'completed' });
    await api.createEvent({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      domain: 'reading',
      eventType: 'book_finished',
      data: { bookId },
      metadata: { source: 'manual' },
    });
  },

  async getActiveBook(): Promise<Book | null> {
    const books = await api.getBooks();
    return books.find((b: Book) => b.status === 'active') || null;
  },

  async getAllBooks(): Promise<Book[]> {
    return api.getBooks();
  },

  async getLogs(): Promise<ReadingLog[]> {
    return api.getEvents('reading');
  },
};