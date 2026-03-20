import { useState, useEffect } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import '../../../styles/theme.css';

const REFLECTION_PROMPTS = [
  // Daily Reflection
  "What did I accomplish today that I'm proud of?",
  "What could I have done better today?",
  "Did I honor my identity today? How?",
  
  // Deep Thinking
  "What's a belief I held strongly that I've changed my mind about recently?",
  "If I had to teach someone the most important thing I learned this week, what would it be?",
  "What am I avoiding that I know I need to face?",
  
  // Morality & Ethics
  "When did I face a moral choice today? What did I choose and why?",
  "What does it mean to live a good life?",
  "What would I do differently if no one was watching?",
  
  // Growth
  "What skill am I developing that will matter in 5 years?",
  "What feedback have I received that I'm resisting? Why?",
  "What would I attempt if I knew I couldn't fail?",
  
  // Gratitude & Perspective
  "What struggle today will seem trivial in a year?",
  "Who helped me today in ways they might not realize?",
  "What privilege do I take for granted?",
];

export function ReflectionScreen() {
  const [reflection, setReflection] = useState('');
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const { currentDay, saveReflection, setScreen } = useForgeStore();

  useEffect(() => {
    if (currentDay?.reflection) {
      setReflection(currentDay.reflection);
    }
    // Randomly select 3 prompts
    const shuffled = [...REFLECTION_PROMPTS].sort(() => 0.5 - Math.random());
    setSelectedPrompts(shuffled.slice(0, 3));
  }, [currentDay]);

  const handleSave = async () => {
    if (!reflection.trim()) {
      alert('Please write a reflection before saving');
      return;
    }

    try {
      await saveReflection(reflection);
      alert('Reflection saved! ✓');
      setTimeout(() => setScreen('home'), 1000);
    } catch (error) {
      console.error('Error saving reflection:', error);
      alert('Failed to save reflection');
    }
  };

  const refreshPrompts = () => {
    const shuffled = [...REFLECTION_PROMPTS].sort(() => 0.5 - Math.random());
    setSelectedPrompts(shuffled.slice(0, 3));
  };

  return (
    <div className="ice-screen">
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <button 
            onClick={() => setScreen('home')}
            className="btn btn-fire"
            style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)' }}
          >
            ← Back
          </button>
          
          <h1 className="ice-text" style={{ fontSize: '72px' }}>
            JOURNAL
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Reflect deeply on your day and life
          </p>
        </div>

        {/* Reflection Prompts */}
        <div style={{ 
          background: 'rgba(10, 42, 74, 0.4)',
          border: '2px solid var(--steel)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-xl)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 className="ice-text" style={{ fontSize: '20px' }}>
              REFLECTION PROMPTS
            </h3>
            <button 
              onClick={refreshPrompts}
              className="btn btn-ice"
              style={{ padding: 'var(--space-xs) var(--space-sm)', fontSize: '14px' }}
            >
              ↻ New Prompts
            </button>
          </div>
          <ul style={{ 
            color: 'var(--frost)',
            lineHeight: '2',
            paddingLeft: 'var(--space-lg)'
          }}>
            {selectedPrompts.map((prompt, idx) => (
              <li key={idx} style={{ marginBottom: 'var(--space-sm)' }}>
                {prompt}
              </li>
            ))}
          </ul>
        </div>

        {/* Reflection Form */}
        <div style={{ 
          background: 'rgba(10, 42, 74, 0.4)',
          border: '2px solid var(--steel)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)'
        }}>
          <h3 className="ice-text" style={{ fontSize: '28px', marginBottom: 'var(--space-lg)' }}>
            TODAY'S REFLECTION
          </h3>

          <textarea
            className="input input-ice"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your thoughts here...&#10;&#10;Be honest. Be vulnerable. No one sees this but you."
            rows={15}
            style={{ 
              resize: 'vertical', 
              minHeight: '300px',
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'var(--font-mono)'
            }}
          />

          <div style={{ 
            marginTop: 'var(--space-md)',
            color: 'var(--frost)',
            fontSize: '14px'
          }}>
            {reflection.trim().split(/\s+/).filter(w => w.length > 0).length} words
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="btn btn-ice"
          style={{ 
            width: '100%',
            padding: 'var(--space-lg)',
            fontSize: '24px'
          }}
        >
          Save Reflection
        </button>

      </div>
    </div>
  );
}