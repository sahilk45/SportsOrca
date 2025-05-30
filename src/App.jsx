import React from 'react';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import LoadingSpinner from './components/LoadingSpinner';
import useMatches from './Hooks/useMatches';
import './App.css';

function App() {
  const { matches, loading, error, refetch, isUsingDemoData, apiStatus } = useMatches();

  // Debug logging
  console.log('App render - State:', {
    matchesLength: matches?.length,
    loading,
    error,
    isUsingDemoData,
    apiStatus
  });

  // Status Banner Component
  const StatusBanner = () => {
    const getStatusInfo = () => {
      switch (apiStatus) {
        case 'success':
          return {
            title: '🟢 Live Data Active',
            message: 'Showing real Premier League fixtures',
            className: 'status-success'
          };
        case 'no-fixtures':
          return {
            title: '🟡 OFF-Season Period',
            message: 'No live fixtures available. Showing demo data.',
            className: 'status-warning'
          };
        case 'error':
          return {
            title: '🔴 API Error - Demo Mode',
            message: 'Connection failed. Showing demo fixtures.',
            className: 'status-error'
          };
        default:
          return {
            title: '🔄 Checking Status',
            message: 'Loading fixture data...',
            className: 'status-info'
          };
      }
    };

    const { title, message, className } = getStatusInfo();
    
    return (
      <div className={`status-banner ${className} ${isUsingDemoData ? 'status-banner-wide' : ''}`}>
        <div className="status-content">
          <h3>{title}</h3>
          <p>{message}</p>
          {isUsingDemoData && (
            <div className="status-details">
              <small>2024/25 season ended May 25, 2025 | Next fixtures: June 18, 2025</small>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        {/* Hero Section - Full width centered */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Upcoming <span className="gradient-text">Soccer</span> Matches
            </h1>
            <p className="hero-subtitle">
              Stay updated with the latest Premier League fixtures
            </p>
          </div>
        </div>

        {/* Status Banner - Double width when demo data */}
        <StatusBanner />

        {/* Main Content Layout */}
        {isUsingDemoData ? (
          // Demo Mode: Two-column layout
          <div className="demo-layout">
            {/* Left Column: Matches */}
            <div className="matches-container demo-matches">
              {loading && (
                <div className="loading-container">
                  <LoadingSpinner />
                  <p className="loading-text">Loading exciting matches...</p>
                </div>
              )}

              {error && !isUsingDemoData && (
                <div className="error-container">
                  <div className="error-card">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={refetch} className="retry-btn">
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {!loading && Array.isArray(matches) && matches.length > 0 && (
                <>
                  <div className="matches-header">
                    <h2>
                      Demo Fixtures
                      <span className="matches-count">({matches.length})</span>
                    </h2>
                    <button onClick={refetch} className="refresh-btn" disabled={loading}>
                      {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                  <div className="matches-grid demo-grid">
                    {matches.map((match) => (
                      <div key={match.id} className="demo-match">
                        <MatchCard match={match} />
                        <div className="demo-badge">Demo Data</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!loading && Array.isArray(matches) && matches.length === 0 && (
                <div className="no-matches">
                  <h3>No upcoming matches found</h3>
                  <p>Check back later for new fixtures!</p>
                  <button onClick={refetch} className="retry-btn">
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Hero Image */}
            <div className="hero-image-section demo-image">
              <div className="hero-image-container">
                <img 
                  src="/scooer1.jpg" 
                  alt="Soccer Player" 
                  className="hero-soccer-image"
                />
              </div>
            </div>
          </div>
        ) : (
          // Live Mode: Full width layout
          <div className="matches-container full-width">
            {loading && (
              <div className="loading-container">
                <LoadingSpinner />
                <p className="loading-text">Loading exciting matches...</p>
              </div>
            )}

            {error && (
              <div className="error-container">
                <div className="error-card">
                  <h3>Oops! Something went wrong</h3>
                  <p>{error}</p>
                  <button onClick={refetch} className="retry-btn">
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && Array.isArray(matches) && matches.length > 0 && (
              <>
                <div className="matches-header">
                  <h2>
                    Upcoming Matches
                    <span className="matches-count">({matches.length})</span>
                  </h2>
                  <button onClick={refetch} className="refresh-btn" disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
                <div className="matches-grid">
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </>
            )}

            {!loading && Array.isArray(matches) && matches.length === 0 && (
              <div className="no-matches">
                <h3>No upcoming matches found</h3>
                <p>Check back later for new fixtures!</p>
                <button onClick={refetch} className="retry-btn">
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built for SportsOrca Internship • Using Football-Data.org API</p>
        {isUsingDemoData && (
          <p className="demo-notice">
            Currently showing demo data. Will switch to live data when available.
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;