import { useState, useEffect } from 'react';
import { useForgeStore } from '../../store/useForgeStore';
import { api } from '../../api/client';
import '../../styles/theme.css';

interface Event {
  id: string;
  timestamp: string;
  domain: string;
  eventType: string;
  data: any;
}

const DOMAINS = ['all', 'reading', 'fitness', 'study', 'spanish', 'speaking'] as const;

export function DomainTimelineScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { setScreen } = useForgeStore();

  useEffect(() => {
    loadEvents();
  }, [selectedDomain]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = selectedDomain === 'all' 
        ? await api.getEvents()
        : await api.getEvents(selectedDomain);
      
      const sorted = allEvents.sort((a: Event, b: Event) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setEvents(sorted);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      reading: 'var(--ember)',
      fitness: 'var(--molten)',
      study: 'var(--steel)',
      spanish: 'var(--frost)',
      speaking: 'var(--flame)'
    };
    return colors[domain] || 'var(--gray-light)';
  };

  const getDetailedDescription = (event: Event) => {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    
    switch (event.eventType) {
      case 'workout_logged':
        return (
          <div>
            <p><strong>Workout Type:</strong> {data.workoutType}</p>
          </div>
        );
      case 'reading_session':
        return (
          <div>
            <p><strong>Pages Read:</strong> {data.pagesRead}</p>
            <p><strong>Current Page:</strong> {data.currentPage}</p>
          </div>
        );
      case 'study_session':
        return (
          <div>
            <p><strong>Category:</strong> {data.category}</p>
            <p><strong>Hours:</strong> {data.hoursStudied}</p>
            <p><strong>Details:</strong> {data.details}</p>
          </div>
        );
      case 'topic_completed':
        return (
          <div>
            <p><strong>Topic:</strong> {data.topic}</p>
            <p><strong>Difficulty:</strong> {data.difficulty}/5</p>
          </div>
        );
      case 'level_up':
        return (
          <div>
            <p><strong>New Level:</strong> {data.level}</p>
          </div>
        );
      default:
        return <p>{event.eventType}</p>;
    }
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
            DETAILED LOGS
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Review your activity by domain
          </p>
        </div>

        {/* Domain Filter */}
        <div style={{ 
          display: 'flex',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)',
          flexWrap: 'wrap'
        }}>
          {DOMAINS.map(domain => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`btn ${selectedDomain === domain ? 'btn-ice' : 'btn-fire'}`}
              style={{ 
                padding: 'var(--space-sm) var(--space-md)',
                opacity: selectedDomain === domain ? 1 : 0.6
              }}
            >
              {domain.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Events List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', color: 'var(--frost)' }}>
            <p>Loading...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ 
            background: 'rgba(10, 42, 74, 0.4)',
            border: '2px solid var(--steel)',
            padding: 'var(--space-xl)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
              No {selectedDomain === 'all' ? '' : selectedDomain} events yet.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)'
          }}>
            {events.map(event => (
              <div 
                key={event.id}
                style={{ 
                  background: 'rgba(10, 42, 74, 0.3)',
                  border: `2px solid ${getDomainColor(event.domain)}`,
                  padding: 'var(--space-lg)'
                }}
              >
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-md)',
                  paddingBottom: 'var(--space-sm)',
                  borderBottom: `1px solid ${getDomainColor(event.domain)}`
                }}>
                  <h3 style={{ 
                    color: getDomainColor(event.domain),
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                  }}>
                    {event.domain}
                  </h3>
                  <span style={{ 
                    color: 'var(--gray-light)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
                <div style={{ 
                  color: 'var(--frost)',
                  fontSize: '15px',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1.8'
                }}>
                  {getDetailedDescription(event)}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}