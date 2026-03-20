import { useState, useEffect } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { readingDomain } from '../../../domains/reading';
import type { Book } from '../../../domains/reading';
import '../../../styles/theme.css';

export function ReadingScreen() {
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [addAsCompleted, setAddAsCompleted] = useState(false);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  
  const [pagesRead, setPagesRead] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  
  const { completeTask, setScreen, showToast } = useForgeStore();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const books = await readingDomain.getAllBooks();
      setAllBooks(books);
      const active = books.find((b: Book) => b.status === 'active') || null;
      setActiveBook(active);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (!title.trim() || !author.trim() || !totalPages) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      if (addAsCompleted) {
        await readingDomain.addCompletedBook(title, author, parseInt(totalPages));
        showToast(`"${title}" added to completed books! ✓`);
      } else {
        const book = await readingDomain.startBook(title, author, parseInt(totalPages));
        setActiveBook(book);
        showToast(`Started reading "${title}"! ✓`);
      }
      
      setShowAddBook(false);
      setTitle('');
      setAuthor('');
      setTotalPages('');
      setAddAsCompleted(false);
      await loadBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      showToast('Failed to add book', 'error');
    }
  };

  const handleLogSession = async () => {
    if (!activeBook || !pagesRead || !currentPage) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      await readingDomain.logSession(
        activeBook.id,
        parseInt(pagesRead),
        parseInt(currentPage)
      );
      await completeTask('read');
      
      showToast(`Reading session logged! ${pagesRead} pages ✓`);
      
      if (parseInt(currentPage) >= activeBook.totalPages) {
        const shouldFinish = confirm('You\'ve reached the end! Mark book as finished?');
        if (shouldFinish) {
          await readingDomain.finishBook(activeBook.id);
          setActiveBook(null);
          showToast('Book marked as finished! 🎉');
          await loadBooks();
        }
      }
      
      setPagesRead('');
      setCurrentPage('');
      
      setTimeout(() => setScreen('home'), 1000);
    } catch (error) {
      console.error('Error logging session:', error);
      showToast('Failed to log session', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="fire-screen">
        <div className="container">
          <h2 className="fire-text">Loading...</h2>
        </div>
      </div>
    );
  }

  const completedBooks = allBooks.filter(b => b.status === 'completed');

  return (
    <div className="fire-screen">
      <div className="container">
        
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <button 
            onClick={() => setScreen('home')}
            className="btn btn-ice"
            style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)' }}
          >
            ← Back
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="fire-text" style={{ fontSize: '72px' }}>
                READ
              </h1>
              <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
                Track your daily reading
              </p>
            </div>
            <button 
              onClick={() => {
                setShowAddBook(true);
                setAddAsCompleted(true);
              }}
              className="btn btn-ice"
            >
              + Add Completed Book
            </button>
          </div>
        </div>

        {showAddBook && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid var(--gray-dark)',
            padding: 'var(--space-xl)',
            marginBottom: 'var(--space-xl)'
          }}>
            <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-lg)' }}>
              ADD BOOK
            </h3>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', color: 'var(--frost)', marginBottom: 'var(--space-xs)' }}>
                Title
              </label>
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Atomic Habits"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', color: 'var(--frost)', marginBottom: 'var(--space-xs)' }}>
                Author
              </label>
              <input
                type="text"
                className="input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="James Clear"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ display: 'block', color: 'var(--frost)', marginBottom: 'var(--space-xs)' }}>
                Total Pages
              </label>
              <input
                type="number"
                className="input"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="320"
              />
            </div>

            <div style={{ 
              marginBottom: 'var(--space-lg)',
              padding: 'var(--space-md)',
              background: 'rgba(168, 216, 234, 0.05)',
              border: '2px solid var(--steel)',
              borderRadius: '4px'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                color: 'var(--frost)'
              }}>
                <input
                  type="checkbox"
                  checked={addAsCompleted}
                  onChange={(e) => setAddAsCompleted(e.target.checked)}
                  style={{ 
                    marginRight: 'var(--space-sm)',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px' }}>
                  I've already read this book
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <button onClick={handleAddBook} className="btn btn-fire" style={{ flex: 1 }}>
                {addAsCompleted ? 'Add as Completed' : 'Start Reading'}
              </button>
              <button onClick={() => {
                setShowAddBook(false);
                setAddAsCompleted(false);
                setTitle('');
                setAuthor('');
                setTotalPages('');
              }} className="btn btn-ice" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeBook && (
          <>
            <div style={{ 
              background: 'rgba(255, 69, 0, 0.05)',
              border: '2px solid var(--ember)',
              padding: 'var(--space-xl)',
              marginBottom: 'var(--space-xl)'
            }}>
              <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-sm)' }}>
                CURRENTLY READING
              </h3>
              <h4 style={{ color: 'var(--frost)', fontSize: '24px', marginBottom: 'var(--space-xs)' }}>
                {activeBook.title}
              </h4>
              <p style={{ color: 'var(--frost)', fontSize: '18px', marginBottom: 'var(--space-xs)' }}>
                by {activeBook.author}
              </p>
              <p style={{ color: 'var(--gray-light)', fontSize: '14px' }}>
                {activeBook.totalPages} pages total
              </p>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid var(--gray-dark)',
              padding: 'var(--space-xl)',
              marginBottom: 'var(--space-xl)'
            }}>
              <h3 className="fire-text" style={{ fontSize: '28px', marginBottom: 'var(--space-lg)' }}>
                LOG TODAY'S SESSION
              </h3>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', color: 'var(--frost)', marginBottom: 'var(--space-xs)' }}>
                  Pages Read Today
                </label>
                <input
                  type="number"
                  className="input"
                  value={pagesRead}
                  onChange={(e) => setPagesRead(e.target.value)}
                  placeholder="25"
                />
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ display: 'block', color: 'var(--frost)', marginBottom: 'var(--space-xs)' }}>
                  Current Page
                </label>
                <input
                  type="number"
                  className="input"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  placeholder="150"
                />
              </div>

              <button onClick={handleLogSession} className="btn btn-fire" style={{ width: '100%' }}>
                Log Session
              </button>
            </div>
          </>
        )}

        {!activeBook && (
          <div style={{ 
            background: 'rgba(255, 69, 0, 0.05)',
            border: '2px solid var(--gray-dark)',
            padding: 'var(--space-xl)',
            textAlign: 'center',
            marginBottom: 'var(--space-xl)'
          }}>
            <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-md)' }}>
              NO ACTIVE BOOK
            </h3>
            <p style={{ color: 'var(--frost)', marginBottom: 'var(--space-lg)' }}>
              Start a new book to track your reading
            </p>
            <button 
              onClick={() => {
                setShowAddBook(true);
                setAddAsCompleted(false);
              }}
              className="btn btn-fire"
            >
              Start New Book
            </button>
          </div>
        )}

        {completedBooks.length > 0 && (
          <div style={{ 
            background: 'rgba(168, 216, 234, 0.05)',
            border: '2px solid var(--steel)',
            padding: 'var(--space-xl)'
          }}>
            <h3 className="ice-text" style={{ fontSize: '28px', marginBottom: 'var(--space-lg)' }}>
              COMPLETED BOOKS ({completedBooks.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {completedBooks.map(book => (
                <div key={book.id} style={{ 
                  padding: 'var(--space-md)',
                  background: 'rgba(10, 42, 74, 0.3)',
                  border: '1px solid var(--steel)'
                }}>
                  <h4 style={{ color: 'var(--frost)', fontSize: '18px', marginBottom: 'var(--space-xs)' }}>
                    {book.title}
                  </h4>
                  <p style={{ color: 'var(--gray-light)', fontSize: '14px' }}>
                    {book.author} • {book.totalPages} pages
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
