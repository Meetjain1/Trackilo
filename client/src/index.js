import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import 'normalize.css';
import './index.css';
import App from './App';
import { AppProvider } from './context/appContext';

// Create root with React 18's createRoot
const container = document.getElementById('root');
const root = createRoot(container);

// Add error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-page">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={
        <div className="loading-center">
          <div className="loading"></div>
        </div>
      }>
    <AppProvider>
      <App />
    </AppProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
