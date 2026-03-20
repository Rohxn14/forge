import { useState } from 'react';
import { useForgeStore } from '../../store/useForgeStore';
import '../../styles/theme.css';

export function IdentityScreen() {
  const [name, setName] = useState('');
  const [statement, setStatement] = useState('');
  const [principles, setPrinciples] = useState('');
  const { initializeChallenge } = useForgeStore();

  const handleSubmit = async () => {
    if (!name.trim() || !statement.trim()) {
      alert('Name and statement are required');
      return;
    }
    await initializeChallenge(name, statement, principles);
  };

  return (
    <div className="ice-screen">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '80px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 className="ice-text pulse-ice">FORGE</h1>
            <p style={{ fontSize: '18px', color: 'var(--frost)' }}>
              Personal Identity Enforcement System
            </p>
          </div>

          {/* Form */}
          <div style={{ 
            background: 'rgba(10, 42, 74, 0.6)', 
            padding: 'var(--space-xl)',
            border: '2px solid var(--steel)',
            borderRadius: '4px',
          }}>
            
            <h2 className="ice-text" style={{ marginBottom: '40px', fontSize: '36px' }}>
              Define Your Identity
            </h2>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--space-xs)',
                color: 'var(--frost)',
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                letterSpacing: '1px'
              }}>
                IDENTITY NAME
              </label>
              <input
                type="text"
                className="input input-ice"
                placeholder="e.g., The Builder, The Warrior, The Scholar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--space-xs)',
                color: 'var(--frost)',
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                letterSpacing: '1px'
              }}>
                IDENTITY STATEMENT
              </label>
              <textarea
                className="input input-ice"
                placeholder="I am someone who..."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={4}
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--space-xs)',
                color: 'var(--frost)',
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                letterSpacing: '1px'
              }}>
                PRINCIPLES (OPTIONAL)
              </label>
              <textarea
                className="input input-ice"
                placeholder="Core principles that guide this identity..."
                value={principles}
                onChange={(e) => setPrinciples(e.target.value)}
                rows={4}
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>

            <button 
              className="btn btn-ice"
              onClick={handleSubmit}
              style={{ width: '100%', padding: 'var(--space-md)' }}
            >
              BEGIN 75-DAY CHALLENGE
            </button>
          </div>

          <div style={{ 
            marginTop: 'var(--space-lg)', 
            textAlign: 'center',
            color: 'var(--frost)',
            fontSize: '14px'
          }}>
            <p>This identity will guide your 75-day journey.</p>
            <p>Every day, you will prove alignment through action.</p>
          </div>

        </div>
      </div>
    </div>
  );
}