import { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { studyDomain, STUDY_CATEGORIES } from '../../../domains/study';
import type { StudyCategory } from '../../../domains/study';
import '../../../styles/theme.css';

export function StudyScreen() {
  const [category, setCategory] = useState<StudyCategory>('Machine Learning');
  const [hours, setHours] = useState('');
  const [details, setDetails] = useState('');
  const { completeTask, setScreen } = useForgeStore();

  const getPlaceholder = () => {
    switch (category) {
      case 'Machine Learning':
      case 'Data Science':
        return 'e.g., Implemented gradient descent, Studied transformers architecture, Built CNN for image classification';
      case 'Data Structures':
        return 'e.g., Trees traversal algorithms, Dynamic programming patterns, Graph algorithms';
      case 'Kaggle':
        return 'e.g., House Prices Competition - Feature engineering, Titanic Dataset - Model tuning';
      case 'LeetCode':
        return 'e.g., #198 House Robber, #53 Maximum Subarray, #15 3Sum';
      default:
        return 'What did you study?';
    }
  };

  const handleLogSession = async () => {
    if (!hours || parseFloat(hours) <= 0) {
      alert('Please enter valid hours');
      return;
    }

    if (!details.trim()) {
      alert('Please enter what you studied');
      return;
    }

    try {
      await studyDomain.logSession(category, parseFloat(hours), details);
      await completeTask('study');
      
      alert(`Study session logged! ${hours} hours on ${category} ✓`);
      setHours('');
      setDetails('');
      setTimeout(() => setScreen('home'), 1000);
    } catch (error) {
      console.error('Error logging study session:', error);
      alert('Failed to log session');
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
            STUDY
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Log your study sessions with details
          </p>
        </div>

        {/* Study Form */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid var(--gray-dark)',
          padding: 'var(--space-xl)'
        }}>
          <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-lg)' }}>
            LOG STUDY SESSION
          </h3>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ 
              display: 'block', 
              color: 'var(--frost)', 
              marginBottom: 'var(--space-sm)',
              fontFamily: 'var(--font-display)',
              fontSize: '18px'
            }}>
              CATEGORY
            </label>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-sm)'
            }}>
              {STUDY_CATEGORIES.map(cat => (
                <div
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`task-card ${category === cat ? 'completed' : ''}`}
                  style={{ 
                    cursor: 'pointer',
                    padding: 'var(--space-md)',
                    textAlign: 'center'
                  }}
                >
                  <p style={{ 
                    fontSize: '14px',
                    color: category === cat ? 'var(--ember)' : 'var(--frost)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {cat}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ 
              display: 'block', 
              color: 'var(--frost)', 
              marginBottom: 'var(--space-xs)',
              fontFamily: 'var(--font-display)',
              fontSize: '18px'
            }}>
              WHAT DID YOU STUDY?
            </label>
            <textarea
              className="input"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={getPlaceholder()}
              rows={4}
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label style={{ 
              display: 'block', 
              color: 'var(--frost)', 
              marginBottom: 'var(--space-xs)',
              fontFamily: 'var(--font-display)',
              fontSize: '18px'
            }}>
              HOURS STUDIED
            </label>
            <input
              type="number"
              step="0.5"
              className="input"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="2.5"
            />
          </div>

          <button onClick={handleLogSession} className="btn btn-fire" style={{ width: '100%' }}>
            Log Session
          </button>
        </div>

      </div>
    </div>
  );
}