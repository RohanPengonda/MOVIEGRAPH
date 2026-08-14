import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Common/Navbar';
import { ErrorBanner } from './components/Common/ErrorBanner';
import { SeparationPage } from './components/Separation/SeparationPage';
import { ActorPage } from './components/Actor/ActorPage';
import { HiddenCollaboratorsPage } from './components/Hidden/HiddenCollaboratorsPage';
import { MoviePage } from './components/Movie/MoviePage';
import { checkHealth } from './api/client';
import type { HealthStatus, SearchResult } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'separation' | 'actor' | 'hidden' | 'movie'>('separation');
  const [selectedActorId, setSelectedActorId] = useState<string>('a6193'); // Leonardo DiCaprio
  const [selectedMovieId, setSelectedMovieId] = useState<string>('m27205'); // Inception
  const [health, setHealth] = useState<HealthStatus | null>(null);

  const verifyDbHealth = async () => {
    const status = await checkHealth();
    setHealth(status);
  };

  useEffect(() => {
    verifyDbHealth();
    const interval = setInterval(verifyDbHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectSearchItem = (item: SearchResult) => {
    if (item.type === 'Actor') {
      setSelectedActorId(item.id);
      setActiveTab('actor');
    } else if (item.type === 'Movie') {
      setSelectedMovieId(item.id);
      setActiveTab('movie');
    }
  };

  const handleNavigateActor = (actorId: string) => {
    setSelectedActorId(actorId);
    setActiveTab('actor');
  };

  const handleNavigateMovie = (movieId: string) => {
    setSelectedMovieId(movieId);
    setActiveTab('movie');
  };

  const handleNavigateHidden = (actorId: string) => {
    setSelectedActorId(actorId);
    setActiveTab('hidden');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-main)' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectSearchItem={handleSelectSearchItem}
        health={health}
      />

      <main style={{ flex: 1, paddingBottom: '60px', width: '100%' }}>
        <ErrorBanner health={health} onRetry={verifyDbHealth} />

        {activeTab === 'separation' && (
          <SeparationPage
            onNavigateActor={handleNavigateActor}
            onNavigateMovie={handleNavigateMovie}
          />
        )}

        {activeTab === 'actor' && (
          <ActorPage
            actorId={selectedActorId}
            onNavigateActor={handleNavigateActor}
            onNavigateMovie={handleNavigateMovie}
            onNavigateHidden={handleNavigateHidden}
          />
        )}

        {activeTab === 'hidden' && (
          <HiddenCollaboratorsPage
            actorId={selectedActorId}
            onNavigateActor={handleNavigateActor}
            onNavigateMovie={handleNavigateMovie}
          />
        )}

        {activeTab === 'movie' && (
          <MoviePage
            movieId={selectedMovieId}
            onNavigateActor={handleNavigateActor}
            onBack={() => setActiveTab('actor')}
          />
        )}
      </main>

      {/* <footer className="dark-panel" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '13px',
        background: 'rgba(9, 13, 22, 0.9)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>MovieGraph</strong> — Technical Take-Home Assignment | Backed by openCypher & CognoDB over Bolt
          </div>
          <div>
            Data sourced from <a href="https://developer.themoviedb.org" target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>TMDB API</a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default App;
