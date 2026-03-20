import { useEffect } from 'react';
import '../../styles/theme.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'rgba(255, 69, 0, 0.95)',
          border: '2px solid var(--ember)',
          color: 'var(--white)'
        };
      case 'error':
        return {
          background: 'rgba(139, 0, 0, 0.95)',
          border: '2px solid #8B0000',
          color: 'var(--white)'
        };
      case 'info':
        return {
          background: 'rgba(74, 144, 184, 0.95)',
          border: '2px solid var(--steel)',
          color: 'var(--white)'
        };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      ...getStyles(),
      padding: 'var(--space-md) var(--space-lg)',
      borderRadius: '4px',
      fontFamily: 'var(--font-mono)',
      fontSize: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      animation: 'slideIn 0.3s ease',
      minWidth: '300px',
      maxWidth: '500px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontSize: '20px',
            cursor: 'pointer',
            marginLeft: 'var(--space-md)',
            padding: '0',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}