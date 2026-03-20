import { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { fitnessDomain } from '../../../domains/fitness';
import type { WorkoutType } from '../../../domains/fitness';
import '../../../styles/theme.css';

const WORKOUT_TYPES: WorkoutType[] = ['Push', 'Pull', 'Legs', 'Cardio', 'Sports', 'Rest'];

export function FitnessScreen() {
  const [selectedType, setSelectedType] = useState<WorkoutType>('Push');
  const [isLogging, setIsLogging] = useState(false);
  const { completeTask, setScreen } = useForgeStore();

  const handleLogWorkout = async () => {
    setIsLogging(true);
    try {
      await fitnessDomain.logWorkout(selectedType);
      await completeTask('train');
      
      // Success feedback
      alert(`${selectedType} workout logged! ✓`);
      
      // Return to home after 1 second
      setTimeout(() => {
        setScreen('home');
      }, 1000);
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout');
    } finally {
      setIsLogging(false);
    }
  };

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
            TRAIN
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Log your workout to complete today's training task
          </p>
        </div>

        {/* Workout Type Selection */}
        <div style={{ 
          background: 'rgba(255, 69, 0, 0.05)',
          border: '2px solid var(--gray-dark)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)'
        }}>
          <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-lg)' }}>
            SELECT WORKOUT TYPE
          </h3>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-xl)'
          }}>
            {WORKOUT_TYPES.map(type => (
              <div
                key={type}
                onClick={() => setSelectedType(type)}
                className={`task-card ${selectedType === type ? 'completed' : ''}`}
                style={{ 
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: 'var(--space-lg)'
                }}
              >
                <h3 style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  color: selectedType === type ? 'var(--ember)' : 'var(--frost)'
                }}>
                  {type}
                </h3>
              </div>
            ))}
          </div>

          <button
            onClick={handleLogWorkout}
            disabled={isLogging}
            className="btn btn-fire"
            style={{ 
              width: '100%', 
              padding: 'var(--space-lg)',
              fontSize: '24px',
              opacity: isLogging ? 0.5 : 1
            }}
          >
            {isLogging ? 'LOGGING...' : `LOG ${selectedType.toUpperCase()} WORKOUT`}
          </button>
        </div>

        {/* Info Box */}
        <div style={{ 
          background: 'rgba(168, 216, 234, 0.05)',
          border: '2px solid var(--steel)',
          padding: 'var(--space-lg)'
        }}>
          <h4 className="ice-text" style={{ fontSize: '20px', marginBottom: 'var(--space-sm)' }}>
            WORKOUT GUIDE
          </h4>
          <ul style={{ 
            color: 'var(--frost)',
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.8',
            paddingLeft: 'var(--space-md)'
          }}>
            <li><strong>Push:</strong> Chest, shoulders, triceps</li>
            <li><strong>Pull:</strong> Back, biceps</li>
            <li><strong>Legs:</strong> Quads, hamstrings, glutes</li>
            <li><strong>Cardio:</strong> Running, cycling, swimming</li>
            <li><strong>Sports:</strong> Basketball, football, tennis, etc.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}