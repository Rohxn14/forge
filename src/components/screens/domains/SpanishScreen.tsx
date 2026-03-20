import { useState, useEffect } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { spanishDomain } from '../../../domains/spanish';
import '../../../styles/theme.css';

export function SpanishScreen() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const { completeTask, setScreen, currentDay } = useForgeStore();

  useEffect(() => {
    loadLevel();
    checkIfCompleted();
  }, []);

  const loadLevel = async () => {
    setIsLoading(true);
    try {
      const level = await spanishDomain.getLevel();
      setCurrentLevel(level);
    } catch (error) {
      console.error('Error loading Spanish level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfCompleted = () => {
    if (currentDay) {
      setHasCompletedToday(currentDay.tasks.spanish);
    }
  };

  const handleCompletePractice = async () => {
    try {
      // Just log practice, don't level up
      await spanishDomain.logPractice();
      await completeTask('spanish');
      
      alert('Spanish practice completed! ✓');
      setHasCompletedToday(true);
      
      setTimeout(() => setScreen('home'), 1000);
    } catch (error) {
      console.error('Error completing practice:', error);
      alert('Failed to complete practice');
    }
  };

  const handleLevelUp = async () => {
    try {
      const newLevel = await spanishDomain.levelUp();
      setCurrentLevel(newLevel);
      alert(`¡Excelente! You're now Level ${newLevel}! 🎉`);
    } catch (error) {
      console.error('Error leveling up:', error);
      alert('Failed to level up');
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

  return (
    <div className="fire-screen">
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <button 
            onClick={() => setScreen('home')}
            className="btn btn-ice"
            style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)' }}
          >
            ← Back
          </button>
          
          <h1 className="fire-text" style={{ fontSize: '72px' }}>
            ESPAÑOL
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Complete your daily Spanish practice on Duolingo
          </p>
        </div>

        {/* Current Level Display */}
        <div style={{ 
          background: 'rgba(255, 69, 0, 0.05)',
          border: '2px solid var(--ember)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
          textAlign: 'center'
        }} className="pulse-fire">
          <p style={{ 
            color: 'var(--frost)',
            fontSize: '16px',
            marginBottom: 'var(--space-sm)',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Duolingo Level
          </p>
          <h2 className="fire-text" style={{ 
            fontSize: '96px', 
            marginBottom: 'var(--space-sm)',
            lineHeight: '1'
          }}>
            {currentLevel}
          </h2>
        </div>

        {/* Complete Daily Practice */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid var(--gray-dark)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-md)'
        }}>
          <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-md)' }}>
            TODAY'S PRACTICE
          </h3>
          
          <p style={{ 
            color: 'var(--frost)',
            marginBottom: 'var(--space-lg)',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Complete your Spanish lesson on Duolingo, then click below to mark today's practice complete.
          </p>

          <button
            onClick={handleCompletePractice}
            disabled={hasCompletedToday}
            className="btn btn-fire"
            style={{ 
              width: '100%', 
              padding: 'var(--space-lg)',
              fontSize: '24px',
              opacity: hasCompletedToday ? 0.5 : 1
            }}
          >
            {hasCompletedToday ? '✓ PRACTICE COMPLETED' : 'MARK PRACTICE COMPLETE'}
          </button>
        </div>

        {/* Level Up Section */}
        <div style={{ 
          background: 'rgba(168, 216, 234, 0.05)',
          border: '2px solid var(--steel)',
          padding: 'var(--space-lg)'
        }}>
          <h4 className="ice-text" style={{ fontSize: '20px', marginBottom: 'var(--space-sm)' }}>
            GAINED A LEVEL ON DUOLINGO?
          </h4>
          <p style={{ 
            color: 'var(--frost)',
            marginBottom: 'var(--space-md)',
            fontSize: '14px'
          }}>
            When you advance to the next level on Duolingo, click this button to update your level here.
          </p>
          <button
            onClick={handleLevelUp}
            className="btn btn-ice"
            style={{ width: '100%' }}
          >
            I Leveled Up on Duolingo
          </button>
        </div>

      </div>
    </div>
  );
}