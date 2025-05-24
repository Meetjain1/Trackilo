import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--backgroundColor);
  transition: background-color 0.3s ease;

  &.dark-mode {
    background: var(--dark-background);
    color: var(--dark-text);
  }
`;

const LoadingSpinner = styled.div`
  width: 6rem;
  height: 6rem;
  border: 5px solid var(--grey-400);
  border-radius: 50%;
  border-top-color: var(--primary-500);
  animation: spinner 1s linear infinite;
  margin-bottom: 2rem;
`;

const LoadingText = styled.h3`
  color: var(--grey-500);
  margin-bottom: 1rem;
  text-align: center;
`;

const RetryButton = styled.button`
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--borderRadius);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;

  &:hover {
    background: var(--primary-700);
  }

  &:disabled {
    background: var(--grey-500);
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const LoadingFallback = ({ isDarkMode }) => {
  const [showRetry, setShowRetry] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowRetry(true);
      setLoadingText('Taking longer than expected...');
    }, 5000); // Show retry after 5 seconds instead of 10

    return () => clearTimeout(timeoutId);
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch('/api/v1/auth/check-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    setLoadingText('Checking connection...');
    
    const isServerUp = await checkServerConnection();
    
    if (isServerUp) {
      window.location.reload();
    } else {
      setLoadingText('Server appears to be down. Please try again later.');
    }
  };

  const handleRedirect = () => {
    navigate('/landing');
  };

  return (
    <LoadingContainer className={isDarkMode ? 'dark-mode' : ''}>
      <LoadingSpinner />
      <LoadingText>{loadingText}</LoadingText>
      {showRetry && (
        <>
          <LoadingText>
            {retryCount >= 3 
              ? 'Still having trouble connecting to the server.'
              : 'There might be an issue with the connection.'}
          </LoadingText>
          <ButtonContainer>
            <RetryButton 
              onClick={handleRetry}
              disabled={retryCount >= 5}
            >
              Retry Connection
            </RetryButton>
            <RetryButton onClick={handleRedirect}>
              Go to Landing Page
            </RetryButton>
          </ButtonContainer>
          {retryCount >= 5 && (
            <LoadingText>
              Maximum retry attempts reached. Please try again later.
            </LoadingText>
          )}
        </>
      )}
    </LoadingContainer>
  );
};

export default LoadingFallback; 