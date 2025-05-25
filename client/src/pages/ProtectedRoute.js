import { useAppContext } from '../context/appContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [loadingStartTime] = useState(Date.now());

  useEffect(() => {
    const MINIMUM_LOADING_TIME = 1000; // 1 second minimum loading time
    const timeElapsed = Date.now() - loadingStartTime;
    
    if (!userLoading) {
      const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - timeElapsed);
      const timer = setTimeout(() => setLoading(false), remainingTime);
      return () => clearTimeout(timer);
    }
  }, [userLoading, loadingStartTime]);

  if (loading || userLoading) {
    return <Loading center />;
  }

  if (!user) {
    return <Navigate to='/landing' />;
  }
  return children;
};

export default ProtectedRoute;
