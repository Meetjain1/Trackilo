import { useAppContext } from '../context/appContext';
import { Navigate } from 'react-router-dom';
import LoadingFallback from '../components/LoadingFallback';
import { useDarkMode } from '../context/darkModeContext';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();
  const { isDarkMode } = useDarkMode();
  const [showTimeout, setShowTimeout] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  useEffect(() => {
    if (userLoading && !loadingStartTime) {
      setLoadingStartTime(Date.now());
    } else if (!userLoading) {
      setLoadingStartTime(null);
      setShowTimeout(false);
    }
  }, [userLoading]);

  useEffect(() => {
    let timeoutId;
    
    if (loadingStartTime) {
      timeoutId = setTimeout(() => {
        const loadingDuration = Date.now() - loadingStartTime;
        if (loadingDuration >= 8000) { // Show timeout after 8 seconds
          setShowTimeout(true);
        }
      }, 8000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loadingStartTime]);

  if (userLoading) {
    if (showTimeout) {
      return <LoadingFallback isDarkMode={isDarkMode} />;
    }
    return (
      <div className="loading-center" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode ? 'var(--dark-background)' : 'var(--backgroundColor)'
      }}>
        <div className="loading"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/landing' />;
  }

  return children;
};

export default ProtectedRoute;
