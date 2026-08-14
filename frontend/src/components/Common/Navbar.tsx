import React from 'react';
import { GitCommit, Users, Eye, Sparkles, Database } from 'lucide-react';
import { SearchBar } from './SearchBar';
import type { SearchResult, HealthStatus } from '../../types';

interface Props {
  activeTab: 'separation' | 'actor' | 'hidden' | 'movie';
  setActiveTab: (tab: 'separation' | 'actor' | 'hidden' | 'movie') => void;
  onSelectSearchItem: (item: SearchResult) => void;
  health: HealthStatus | null;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onSelectSearchItem, health }) => {
  const isDbOk = health?.database.connected;

  const tabStyle = (tab: string, activeColor: string): React.CSSProperties => ({
    background: activeTab === tab ? `rgba(${activeColor}, 0.15)` : 'transparent',
    border: activeTab === tab ? `1.5px solid rgba(${activeColor}, 0.5)` : '1.5px solid transparent',
    color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)',
    padding: '8px 14px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  });

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px',
      boxShadow: '0 4px 20px rgba(255, 152, 0, 0.08)',
    }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveTab('separation')}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(255, 152, 0, 0.5)' }}>
            <GitCommit size={24} color="#ffffff" />
          </div>
          <div className="text-gradient" style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>MovieGraph</div>
        </div>

        <div style={{ flex: 1, maxWidth: '460px' }}>
          <SearchBar onSelectResult={onSelectSearchItem} />
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setActiveTab('separation')} style={tabStyle('separation', '255, 152, 0')}>
            <Sparkles size={16} color={activeTab === 'separation' ? '#ff9800' : 'currentColor'} />
            Degrees of Separation
          </button>
          <button onClick={() => setActiveTab('actor')} style={tabStyle('actor', '255, 152, 0')}>
            <Users size={16} color={activeTab === 'actor' ? '#ff9800' : 'currentColor'} />
            Actor Explorer
          </button>
          <button onClick={() => setActiveTab('hidden')} style={tabStyle('hidden', '255, 112, 67')}>
            <Eye size={16} color={activeTab === 'hidden' ? '#ff7043' : 'currentColor'} />
            Hidden Collaborators
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: 'var(--radius-full)',
            background: isDbOk ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 112, 67, 0.15)',
            border: isDbOk ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 112, 67, 0.4)',
            fontSize: '11px', fontWeight: 600,
            color: isDbOk ? '#00897b' : '#d84315',
            marginLeft: '8px',
          }}>
            <Database size={13} />
            {isDbOk ? 'CognoDB Connected' : 'DB Disconnected'}
          </div>
        </nav>

      </div>
    </header>
  );
};
