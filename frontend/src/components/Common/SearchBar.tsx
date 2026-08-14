import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, User, Film } from 'lucide-react';
import { searchEntities } from '../../api/client';
import type { SearchResult } from '../../types';

interface Props {
  onSelectResult?: (result: SearchResult) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({
  onSelectResult,
  placeholder = 'Search actors or movies (e.g. Kevin Bacon, Inception)...',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const res = await searchEntities(query);
          setResults(res);
          setIsOpen(true);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    onSelectResult?.(item);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: '580px' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(245, 245, 245, 0.7)',
        border: '1.5px solid rgba(255, 152, 0, 0.3)',
        borderRadius: 'var(--radius-full)',
        padding: '8px 16px',
        boxShadow: isOpen ? '0 0 20px rgba(255, 152, 0, 0.2)' : '0 4px 16px rgba(255, 152, 0, 0.08)',
        transition: 'all 0.3s ease',
      }}>
        <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%', fontFamily: 'var(--font-main)' }}
        />
        {loading && <Loader2 size={16} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
        {query && !loading && (
          <button onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
          background: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 16px 48px rgba(255, 152, 0, 0.12)',
          maxHeight: '360px', overflowY: 'auto', zIndex: 100,
        }}>
          {results.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No actors or movies found matching "{query}"
            </div>
          ) : results.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 152, 0, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255, 152, 0, 0.08)', transition: 'background 0.15s ease' }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: item.type === 'Actor' ? '50%' : '6px', overflow: 'hidden', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.image
                  ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : item.type === 'Actor' ? <User size={18} color="#818cf8" /> : <Film size={18} color="#22d3ee" />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                {item.subtitle && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {item.type === 'Movie' ? `Released ${item.subtitle}` : `Born ${item.subtitle}`}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: item.type === 'Actor' ? 'var(--actor-badge-bg)' : 'var(--movie-badge-bg)', color: item.type === 'Actor' ? 'var(--actor-badge-text)' : 'var(--movie-badge-text)', flexShrink: 0 }}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
