import { useEffect } from 'react';
import { useForgeStore } from './store/useForgeStore';
import { IdentityScreen } from './components/screens/Identity';
import { IdentityViewScreen } from './components/screens/IdentityView';
import { HomeScreen } from './components/screens/Home';
import { FitnessScreen } from './components/screens/domains/FitnessScreen';
import { SpanishScreen } from './components/screens/domains/SpanishScreen';
import { ReadingScreen } from './components/screens/domains/ReadingScreen';
import { SpeakingScreen } from './components/screens/domains/SpeakingScreen';
import { StudyScreen } from './components/screens/domains/StudyScreen';
import { ReflectionScreen } from './components/screens/domains/ReflectionScreen';
import { TimelineScreen } from './components/screens/Timeline';
import { DomainTimelineScreen } from './components/screens/DomainTimeline';
import { AnalyticsScreen } from './components/screens/Analytics';
import { Toast } from './components/ui/Toast';

import './styles/theme.css';

function App() {
  const { loadChallenge, currentScreen, toast, hideToast } = useForgeStore();

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  if (currentScreen === 'loading') {
    return (
      <div className="fire-screen" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh' 
      }}>
        <h2 className="fire-text pulse-fire">LOADING FORGE...</h2>
      </div>
    );
  }

  if (currentScreen === 'identity') {
    return <IdentityScreen />;
  }

  if (currentScreen === 'identity-view') {
    return <IdentityViewScreen />;
  }

  if (currentScreen === 'home') {
    return <HomeScreen />;
  }

  if (currentScreen === 'fitness') {
    return <FitnessScreen />;
  }

  if (currentScreen === 'spanish') {
    return <SpanishScreen />;
  }

  if (currentScreen === 'reading') {
    return <ReadingScreen />;
  }

  if (currentScreen === 'speaking') {
    return <SpeakingScreen />;
  }

  if (currentScreen === 'study') {
    return <StudyScreen />;
  }

  if (currentScreen === 'reflection') {
    return <ReflectionScreen />;
  }

  if (currentScreen === 'timeline') {
    return <TimelineScreen />;
  }
  if (currentScreen === 'domain-timeline') {
  return <DomainTimelineScreen />;
}
if (currentScreen === 'analytics') {
  return <AnalyticsScreen />;
}

  // Fallback
  return (
    <>
      {/* Toast Notification - THIS MUST BE HERE */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}

      {/* Then your screens */}
      {currentScreen === 'identity' && <IdentityScreen />}
      {currentScreen === 'home' && <HomeScreen />}
      // ... etc
    </>
  );
}

export default App;