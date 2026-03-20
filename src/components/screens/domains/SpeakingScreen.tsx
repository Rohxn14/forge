import { useState, useEffect } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { speakingDomain } from '../../../domains/speaking';
import type { Topic } from '../../../data/topics';
import '../../../styles/theme.css';

export function SpeakingScreen() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { completeTask, setScreen } = useForgeStore();

  useEffect(() => {
    loadLevel();
  }, []);

  const loadLevel = async () => {
    setIsLoading(true);
    try {
      const level = await speakingDomain.getLevel();
      setCurrentLevel(level);
    } catch (error) {
      console.error('Error loading speaking level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTopic = () => {
    const topic = speakingDomain.generateTopic(currentLevel);
    setCurrentTopic(topic);
  };

  const handleComplete = async () => {
    if (!currentTopic) return;

    try {
      await speakingDomain.completeTopic(currentTopic.text, currentTopic.difficulty);
      await completeTask('speak');
      
      // Check if level increased
      const newLevel = await speakingDomain.getLevel();
      if (newLevel > currentLevel) {
        alert(`Great job! You've leveled up to Level ${newLevel}! 🎉`);
        setCurrentLevel(newLevel);
      } else {
        alert('Speaking practice completed! ✓');
      }
      
      setCurrentTopic(null);
      setTimeout(() => setScreen('home'), 1000);
    } catch (error) {
      console.error('Error completing topic:', error);
      alert('Failed to complete topic');
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
            SPEAK
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Practice speaking with challenge-driven topics
          </p>
        </div>

        {/* Level Display */}
        <div style={{ 
          background: 'rgba(255, 69, 0, 0.05)',
          border: '2px solid var(--ember)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-xl)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--frost)', fontSize: '16px', marginBottom: 'var(--space-xs)' }}>
            Speaking Level
          </p>
          <h2 className="fire-text" style={{ fontSize: '64px', lineHeight: '1' }}>
            {currentLevel}
          </h2>
        </div>

        {/* No Topic - Generate */}
        {!currentTopic && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid var(--gray-dark)',
            padding: 'var(--space-xl)',
            textAlign: 'center'
          }}>
            <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-md)' }}>
              GENERATE TODAY'S TOPIC
            </h3>
            <p style={{ color: 'var(--frost)', marginBottom: 'var(--space-lg)' }}>
              Get a speaking challenge based on your current level
            </p>
            <button onClick={handleGenerateTopic} className="btn btn-fire" style={{ fontSize: '20px' }}>
              Generate Topic
            </button>
          </div>
        )}

        {/* Topic Display */}
        {currentTopic && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid var(--gray-dark)',
            padding: 'var(--space-xl)'
          }}>
            <div style={{ 
              background: 'rgba(255, 69, 0, 0.1)',
              border: '2px solid var(--ember)',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-lg)',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: 'var(--frost)', 
                fontSize: '14px', 
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: 'var(--space-sm)'
              }}>
                Difficulty: {currentTopic.difficulty}/5
              </p>
              <h2 style={{ 
                color: 'var(--ember)', 
                fontSize: '28px',
                fontFamily: 'var(--font-display)',
                letterSpacing: '1px'
              }}>
                {currentTopic.text}
              </h2>
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h4 className="ice-text" style={{ fontSize: '18px', marginBottom: 'var(--space-sm)' }}>
                INSTRUCTIONS
              </h4>
              <ol style={{ 
                color: 'var(--frost)', 
                paddingLeft: 'var(--space-lg)',
                lineHeight: '1.8'
              }}>
                <li>Read the topic above</li>
                <li>Speak about it for 2-5 minutes (out loud, to yourself or record)</li>
                <li>Focus on clarity, structure, and confidence</li>
                <li>When finished, click "Mark Complete"</li>
              </ol>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <button onClick={handleComplete} className="btn btn-fire" style={{ flex: 1 }}>
                Mark Complete
              </button>
              <button onClick={handleGenerateTopic} className="btn btn-ice" style={{ flex: 1 }}>
                New Topic
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}