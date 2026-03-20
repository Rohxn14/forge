import { useEffect, useState } from 'react';
import { useForgeStore } from '../../store/useForgeStore';
import { challengeEngine } from '../../engine/challenge';
import type { TaskName, DayData } from '../../engine/challenge';
import { api } from '../../api/client';
import '../../styles/theme.css';

const TASK_LABELS: Record<TaskName, string> = {
  read: 'READ',
  speak: 'SPEAK',
  study: 'STUDY',
  train: 'TRAIN',
  spanish: 'LEARN SPANISH',
  journal: 'JOURNAL',
  noJunkDopamine: 'NO JUNK DOPAMINE',
};

export function HomeScreen() {
  const { 
    identity, 
    currentDay, 
    challengeStartDate,
    loadToday,
    setScreen,
    toggleNoJunkDopamine,
  } = useForgeStore();

  const [allDays, setAllDays] = useState<DayData[]>([]);

  useEffect(() => {
    loadToday();
    loadAllDays();
  }, [loadToday]);

  const loadAllDays = async () => {
    try {
      const days = await api.getAllDays();
      setAllDays(days);
    } catch (error) {
      console.error('Error loading all days:', error);
    }
  };

  if (!currentDay || !identity || !challengeStartDate) {
    return (
      <div className="fire-screen">
        <div className="container">
          <h2 className="fire-text">Loading...</h2>
        </div>
      </div>
    );
  }

  const dayNumber = challengeEngine.getDayNumber(challengeStartDate, allDays);
  const completionPercentage = Math.round(
    (Object.values(currentDay.tasks).filter(Boolean).length / 7) * 100
  );

  // ... rest of the component stays the same

  return (
    <div className="fire-screen">
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 className="fire-text" style={{ fontSize: '96px', marginBottom: '8px' }}>
            DAY {dayNumber} / 75
          </h1>
          <h3 style={{ color: 'var(--frost)', fontFamily: 'var(--font-mono)', textTransform: 'none', letterSpacing: '0' }}>
            {identity.name}
          </h3>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'var(--gray-dark)', 
            marginTop: 'var(--space-md)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${completionPercentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--ember), var(--molten))',
              transition: 'width 0.5s ease',
              boxShadow: '0 0 10px var(--ember)'
            }} />
          </div>
        </div>

        {/* Task Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)'
        }}>
          
          {/* Action Tasks - Navigate to Domain Screens */}
          <TaskCard 
            name="read" 
            label={TASK_LABELS.read}
            completed={currentDay.tasks.read}
            onClick={() => setScreen('reading')}
          />
          
          <TaskCard 
            name="speak" 
            label={TASK_LABELS.speak}
            completed={currentDay.tasks.speak}
            onClick={() => setScreen('speaking')}
          />
          
          <TaskCard 
            name="study" 
            label={TASK_LABELS.study}
            completed={currentDay.tasks.study}
            onClick={() => setScreen('study')}
          />
          
          <TaskCard 
            name="train" 
            label={TASK_LABELS.train}
            completed={currentDay.tasks.train}
            onClick={() => setScreen('fitness')}
          />
          
          <TaskCard 
            name="spanish" 
            label={TASK_LABELS.spanish}
            completed={currentDay.tasks.spanish}
            onClick={() => setScreen('spanish')}
          />
          
          <TaskCard 
            name="journal" 
            label={TASK_LABELS.journal}
            completed={currentDay.tasks.journal}
            onClick={() => setScreen('reflection')}
          />
          
          {/* No Junk Dopamine - Toggle */}
          <div 
            className={`task-card ${currentDay.tasks.noJunkDopamine ? 'completed' : ''}`}
            onClick={toggleNoJunkDopamine}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="task-name" style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '24px',
                color: currentDay.tasks.noJunkDopamine ? 'var(--ember)' : 'var(--frost)'
              }}>
                {TASK_LABELS.noJunkDopamine}
              </h3>
              <div style={{ 
                fontSize: '32px',
                color: currentDay.tasks.noJunkDopamine ? 'var(--ember)' : 'var(--gray-mid)'
              }}>
                {currentDay.tasks.noJunkDopamine ? '✓' : '○'}
              </div>
            </div>
          </div>
        </div>

        {/* Day Status */}
        {currentDay.completed && (
          <div style={{ 
            background: 'rgba(255, 69, 0, 0.1)',
            border: '2px solid var(--ember)',
            padding: 'var(--space-lg)',
            textAlign: 'center',
            marginBottom: 'var(--space-xl)'
          }} className="pulse-fire">
            <h2 className="fire-text" style={{ fontSize: '48px' }}>
              DAY COMPLETE
            </h2>
            <p style={{ color: 'var(--frost)', marginTop: 'var(--space-sm)' }}>
              You honored your identity today.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          justifyContent: 'center'
        }}>
          <button 
            className="btn btn-ice"
            onClick={() => setScreen('timeline')}
          >
            Timeline
          </button>
          <button 
            className="btn btn-ice"
            onClick={() => setScreen('domain-timeline')}
          >
            Detailed Logs
          </button>
          <button 
            className="btn btn-ice"
            onClick={() => setScreen('analytics')}
          >
            Analytics
          </button>
          <button 
            className="btn btn-ice"
            onClick={() => setScreen('identity-view')}
          >
            View Identity
          </button>
        </div>
       

      </div>
    </div>
  );
}

interface TaskCardProps {
  name: string;
  label: string;
  completed: boolean;
  onClick: () => void;
}

function TaskCard({ label, completed, onClick }: TaskCardProps) {
  return (
    <div 
      className={`task-card ${completed ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="task-name" style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '24px',
          color: completed ? 'var(--ember)' : 'var(--frost)'
        }}>
          {label}
        </h3>
        <div style={{ 
          fontSize: '32px',
          color: completed ? 'var(--ember)' : 'var(--gray-mid)'
        }}>
          {completed ? '✓' : '→'}
        </div>
      </div>
    </div>
  );
}