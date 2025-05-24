import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing, Error, ProtectedRoute } from './pages'
import Login from './pages/Login'
import Signup from './pages/Signup'
import {
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
  AddJob,
} from './pages/dashboard'
import { DarkModeProvider } from './context/darkModeContext'
import { useDarkMode } from './context/darkModeContext'
import LoadingFallback from './components/LoadingFallback'
import styled from 'styled-components'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--backgroundColor);
  color: var(--textColor);
  transition: background-color 0.3s, color 0.3s;

  &.dark-mode {
    background: var(--dark-background);
    color: var(--dark-text);
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 90vw;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 0;
`;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: this.props.isDarkMode ? 'var(--dark-background)' : 'var(--backgroundColor)',
          color: this.props.isDarkMode ? 'var(--dark-text)' : 'var(--textColor)'
        }}>
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--borderRadius)',
              marginTop: '1rem',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap the app with dark mode context
const AppWithDarkMode = () => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <ErrorBoundary isDarkMode={isDarkMode}>
      <AppContainer className={isDarkMode ? 'dark-mode' : ''}>
        <BrowserRouter>
          <Navbar />
          <MainContent>
            <Suspense fallback={<LoadingFallback isDarkMode={isDarkMode} />}>
              <Routes>
                <Route path='/landing' element={<Landing />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
                  <Route index element={<Stats />} />
                  <Route path='stats' element={<Stats />} />
                  <Route path='all-jobs' element={<AllJobs />} />
                  <Route path='add-job' element={<AddJob />} />
                  <Route path='profile' element={<Profile />} />
                </Route>
                <Route path='*' element={<Error />} />
              </Routes>
            </Suspense>
          </MainContent>
          <Footer />
        </BrowserRouter>
      </AppContainer>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <AppWithDarkMode />
    </DarkModeProvider>
  );
}

export default App;
