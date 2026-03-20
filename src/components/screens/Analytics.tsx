import { useState, useEffect } from 'react';
import { useForgeStore } from '../../store/useForgeStore';
import { api } from '../../api/client';
import type { DayData } from '../../engine/challenge';
import '../../styles/theme.css';

export function AnalyticsScreen() {
  const [allDays, setAllDays] = useState<DayData[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setScreen } = useForgeStore();
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [days, allEvents] = await Promise.all([
        api.getAllDays(),
        api.getEvents()
      ]);
      setAllDays(days);
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalDays = allDays.length;
  const completedDays = allDays.filter(d => d.completed).length;
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  
  const currentStreak = allDays
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce((streak, day) => day.completed ? streak + 1 : streak, 0);

  // Domain stats
  const eventsByDomain = events.reduce((acc: any, event) => {
    acc[event.domain] = (acc[event.domain] || 0) + 1;
    return acc;
  }, {});

  // Study breakdown
  const studyEvents = events.filter(e => e.domain === 'study');
  const totalStudyHours = studyEvents.reduce((sum, e) => {
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    return sum + (data.hoursStudied || 0);
  }, 0);

  // Reading stats
  const readingEvents = events.filter(e => e.domain === 'reading' && e.eventType === 'reading_session');
  const totalPagesRead = readingEvents.reduce((sum, e) => {
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    return sum + (data.pagesRead || 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="fire-screen">
        <div className="container">
          <h2 className="fire-text">Loading analytics...</h2>
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
            ANALYTICS
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Your progress at a glance
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)'
        }}>
          
          <MetricCard
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle={`${completedDays} / ${totalDays} days`}
            color="var(--ember)"
          />

          <MetricCard
            title="Current Streak"
            value={`${currentStreak}`}
            subtitle="consecutive days"
            color="var(--molten)"
          />

          <MetricCard
            title="Total Study Hours"
            value={`${totalStudyHours.toFixed(1)}h`}
            subtitle={`${studyEvents.length} sessions`}
            color="var(--steel)"
          />

          <MetricCard
            title="Pages Read"
            value={`${totalPagesRead}`}
            subtitle={`${readingEvents.length} sessions`}
            color="var(--frost)"
          />
        </div>

        {/* Domain Breakdown */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid var(--gray-dark)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)'
        }}>
          <h3 className="fire-text" style={{ fontSize: '28px', marginBottom: 'var(--space-lg)' }}>
            ACTIVITY BY DOMAIN
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {Object.entries(eventsByDomain).map(([domain, count]) => (
                <div key={domain} style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 'var(--space-sm)',
                    background: 'rgba(255, 255, 255, 0.03)'
                }}>
                    <span style={{ 
                    color: 'var(--frost)',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-display)',
                    fontSize: '16px'
                    }}>
                    {domain}
                    </span>
                    <span style={{ 
                    color: 'var(--ember)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '18px',
                    fontWeight: 'bold'
                    }}>
                    {String(count)}
                    </span>
                </div>
                ))}
          </div>
        </div>

      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

function MetricCard({ title, value, subtitle, color }: MetricCardProps) {
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.05)',
      border: `2px solid ${color}`,
      padding: 'var(--space-lg)',
      textAlign: 'center'
    }}>
      <p style={{ 
        color: 'var(--frost)',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: 'var(--space-sm)'
      }}>
        {title}
      </p>
      <h2 style={{ 
        color: color,
        fontFamily: 'var(--font-display)',
        fontSize: '48px',
        marginBottom: 'var(--space-xs)'
      }}>
        {value}
      </h2>
      <p style={{ 
        color: 'var(--gray-light)',
        fontSize: '12px'
      }}>
        {subtitle}
      </p>
    </div>
  );
}