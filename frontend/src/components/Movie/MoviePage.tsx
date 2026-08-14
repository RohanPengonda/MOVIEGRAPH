import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, ArrowLeft } from 'lucide-react';
import { getMovieDetail } from '../../api/client';
import type { MovieDetailResponse } from '../../types';
import { ProfileSkeleton } from '../Common/SkeletonLoader';

interface Props {
  movieId: string;
  onNavigateActor: (actorId: string) => void;
  onBack?: () => void;
}

export const MoviePage: React.FC<Props> = ({ movieId, onNavigateActor, onBack }) => {
  const [data, setData] = useState<MovieDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getMovieDetail(movieId)
      .then(res => { if (isMounted) setData(res); })
      .catch(err => console.error('Failed fetching movie detail:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [movieId]);

  if (loading) return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      <ProfileSkeleton />
    </div>
  );

  if (!data?.movie) return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
      <h2>Movie Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Could not locate movie with ID "{movieId}".</p>
    </div>
  );

  const { movie, director, genres, cast } = data;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>

      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back
        </button>
      )}

      {/* Movie hero */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <img src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300'} alt={movie.title} style={{ width: '180px', height: '260px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {genres.map(g => (
                <span key={g} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 600 }}>{g}</span>
              ))}
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>{movie.title}</h1>
            <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '14px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={15} /> {movie.releaseYear}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700 }}>
                <Star size={15} color="#f59e0b" /> {movie.rating ? movie.rating.toFixed(1) : 'N/A'} / 10
              </span>
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>{movie.overview}</p>
            {director && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={director.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={director.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Directed by</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{director.name}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cast */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={22} color="#818cf8" /> Cast & Character Roles ({cast.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {cast.map(c => (
            <div key={c.id} onClick={() => onNavigateActor(c.id)} className="glass-card glass-card-interactive" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
              <img src={c.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={c.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
              <div style={{ fontSize: '12px', color: '#818cf8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.role}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
