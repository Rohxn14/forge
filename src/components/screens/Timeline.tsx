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

export function TimelineScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setScreen } = useForgeStore();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = await api.getEvents();
      // Sort by timestamp descending (most recent first)
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

  const getEventDescription = (event: Event) => {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    
    switch (event.eventType) {
      case 'workout_logged':
        return `${data.workoutType} workout`;
      case 'reading_session':
        return `Read ${data.pagesRead} pages`;
      case 'book_started':
        return `Started: ${data.title}`;
      case 'book_finished':
        return `Finished book`;
      case 'study_session':
        return `Studied ${data.category} for ${data.hoursStudied}h`;
      case 'practice_completed':
        return `Spanish practice completed`;
      case 'level_up':
        return `Leveled up to ${data.level}`;
      case 'topic_completed':
        return `Speaking: ${data.topic}`;
      default:
        return event.eventType;
    }
  };

  if (isLoading) {
    return (
      <div className="ice-screen">
        <div className="container">
          <h2 className="ice-text">Loading timeline...</h2>
        </div>
      </div>
    );
  }

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
            TIMELINE
          </h1>
          <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
            Your complete activity ledger
          </p>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div style={{ 
            background: 'rgba(10, 42, 74, 0.4)',
            border: '2px solid var(--steel)',
            padding: 'var(--space-xl)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--frost)', fontSize: '18px' }}>
              No events yet. Complete your first task to start building your timeline.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)'
          }}>
            {events.map(event => (
              <div 
                key={event.id}
                style={{ 
                  background: 'rgba(10, 42, 74, 0.3)',
                  border: '2px solid var(--gray-dark)',
                  padding: 'var(--space-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = getDomainColor(event.domain);
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gray-dark)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {/* Domain Indicator */}
                <div style={{ 
                  width: '4px',
                  height: '60px',
                  background: getDomainColor(event.domain),
                  flexShrink: 0
                }} />

                {/* Event Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    <span style={{ 
                      color: getDomainColor(event.domain),
                      fontFamily: 'var(--font-display)',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {event.domain}
                    </span>
                    <span style={{ 
                      color: 'var(--gray-light)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  <p style={{ 
                    color: 'var(--frost)',
                    fontSize: '16px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {getEventDescription(event)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}