import { useState, useEffect } from 'react';
import { useForgeStore } from '../../store/useForgeStore';
import { api } from '../../api/client';
import '../../styles/theme.css';

export function IdentityViewScreen() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { identity, setScreen } = useForgeStore();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [allDays, allEvents] = await Promise.all([
        api.getAllDays(),
        api.getEvents()
      ]);

      const sortedDays = allDays.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      let currentStreak = 0;
      for (const day of sortedDays) {
        if (day.completed) currentStreak++;
        else break;
      }

      let longestStreak = 0;
      let tempStreak = 0;
      for (const day of allDays.sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )) {
        if (day.completed) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      const eventsByDomain = allEvents.reduce((acc: any, event: any) => {
        acc[event.domain] = (acc[event.domain] || 0) + 1;
        return acc;
      }, {});

      const studyEvents = allEvents.filter((e: any) => e.domain === 'study');
      const totalStudyHours = studyEvents.reduce((sum: number, e: any) => {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        return sum + (data.hoursStudied || 0);
      }, 0);

      const readingEvents = allEvents.filter((e: any) => 
        e.domain === 'reading' && e.eventType === 'reading_session'
      );
      const totalPages = readingEvents.reduce((sum: number, e: any) => {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        return sum + (data.pagesRead || 0);
      }, 0);

      setStats({
        currentStreak,
        longestStreak,
        totalDays: allDays.length,
        completedDays: allDays.filter((d: any) => d.completed).length,
        eventsByDomain,
        totalStudyHours,
        totalPages
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="ice-screen">
        <div className="container">
          <h2 className="ice-text">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="ice-screen">
      <div className="container">
        
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <button 
            onClick={() => setScreen('home')}
            className="btn btn-fire"
            style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)' }}
          >
            ← Back
          </button>
          
          <h1 className="ice-text" style={{ fontSize: '72px' }}>
            YOUR IDENTITY
          </h1>
        </div>

        {identity && (
          <div style={{ 
            background: 'rgba(10, 42, 74, 0.6)',
            border: '2px solid var(--steel)',
            padding: 'var(--space-xl)',
            marginBottom: 'var(--space-xl)'
          }}>
            <h2 className="ice-text" style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>
              {identity.name}
            </h2>
            <p style={{ 
              color: 'var(--frost)', 
              fontSize: '20px', 
              lineHeight: '1.6',
              marginBottom: 'var(--space-lg)'
            }}>
              {identity.statement}
            </p>
            {identity.principles && (
              <>
                <h3 className="ice-text" style={{ fontSize: '24px', marginBottom: 'var(--space-sm)' }}>
                  PRINCIPLES
                </h3>
                <p style={{ color: 'var(--frost)', fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {identity.principles}
                </p>
              </>
            )}
          </div>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)'
        }}>
          <div style={{ 
            background: 'rgba(255, 69, 0, 0.1)',
            border: '2px solid var(--ember)',
            padding: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--frost)', fontSize: '14px', marginBottom: 'var(--space-sm)' }}>
              CURRENT STREAK
            </p>
            <h2 className="fire-text" style={{ fontSize: '64px', lineHeight: '1' }}>
              {stats.currentStreak}
            </h2>
            <p style={{ color: 'var(--gray-light)', fontSize: '12px' }}>days</p>
          </div>

          <div style={{ 
            background: 'rgba(255, 107, 0, 0.1)',
            border: '2px solid var(--molten)',
            padding: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--frost)', fontSize: '14px', marginBottom: 'var(--space-sm)' }}>
              LONGEST STREAK
            </p>
            <h2 style={{ 
              color: 'var(--molten)', 
              fontFamily: 'var(--font-display)', 
              fontSize: '64px', 
              lineHeight: '1' 
            }}>
              {stats.longestStreak}
            </h2>
            <p style={{ color: 'var(--gray-light)', fontSize: '12px' }}>days</p>
          </div>

          <div style={{ 
            background: 'rgba(10, 42, 74, 0.4)',
            border: '2px solid var(--steel)',
            padding: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--frost)', fontSize: '14px', marginBottom: 'var(--space-sm)' }}>
              COMPLETION RATE
            </p>
            <h2 className="ice-text" style={{ fontSize: '64px', lineHeight: '1' }}>
              {Math.round((stats.completedDays / stats.totalDays) * 100) || 0}%
            </h2>
            <p style={{ color: 'var(--gray-light)', fontSize: '12px' }}>
              {stats.completedDays} / {stats.totalDays} days
            </p>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid var(--gray-dark)',
          padding: 'var(--space-xl)'
        }}>
          <h3 className="fire-text" style={{ fontSize: '32px', marginBottom: 'var(--space-lg)' }}>
            LIFETIME TOTALS
          </h3>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-md)'
          }}>
            <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <p style={{ color: 'var(--ember)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>
                READING SESSIONS
              </p>
              <h3 style={{ color: 'var(--frost)', fontSize: '32px', fontFamily: 'var(--font-display)' }}>
                {stats.eventsByDomain.reading || 0}
              </h3>
              <p style={{ color: 'var(--gray-light)', fontSize: '14px' }}>
                {stats.totalPages} pages total
              </p>
            </div>

            <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <p style={{ color: 'var(--molten)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>
                WORKOUTS
              </p>
              <h3 style={{ color: 'var(--frost)', fontSize: '32px', fontFamily: 'var(--font-display)' }}>
                {stats.eventsByDomain.fitness || 0}
              </h3>
            </div>

            <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <p style={{ color: 'var(--steel)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>
                STUDY SESSIONS
              </p>
              <h3 style={{ color: 'var(--frost)', fontSize: '32px', fontFamily: 'var(--font-display)' }}>
                {stats.eventsByDomain.study || 0}
              </h3>
              <p style={{ color: 'var(--gray-light)', fontSize: '14px' }}>
                {stats.totalStudyHours.toFixed(1)} hours total
              </p>
            </div>

            <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <p style={{ color: 'var(--frost)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>
                SPANISH PRACTICE
              </p>
              <h3 style={{ color: 'var(--frost)', fontSize: '32px', fontFamily: 'var(--font-display)' }}>
                {stats.eventsByDomain.spanish || 0}
              </h3>
            </div>

            <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.03)' }}>
              <p style={{ color: 'var(--flame)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>
                SPEAKING PRACTICE
              </p>
              <h3 style={{ color: 'var(--frost)', fontSize: '32px', fontFamily: 'var(--font-display)' }}>
                {stats.eventsByDomain.speaking || 0}
              </h3>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
