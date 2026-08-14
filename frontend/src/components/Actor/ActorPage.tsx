import React, { useState, useEffect } from 'react';
import { Users, Film, Award, Flame, Eye, ArrowRight, Star } from 'lucide-react';
import { getActorDetail, getFeatured } from '../../api/client';
import type { ActorDetailResponse, ActorNode } from '../../types';
import { ProfileSkeleton } from '../Common/SkeletonLoader';
import { SearchBar } from '../Common/SearchBar';

interface Props {
  actorId?: string;
  onNavigateActor: (actorId: string) => void;
  onNavigateMovie: (movieId: string) => void;
  onNavigateHidden: (actorId: string) => void;
}

export const ActorPage: React.FC<Props> = ({ actorId = 'a6193', onNavigateActor, onNavigateMovie, onNavigateHidden }) => {
  const [data, setData] = useState<ActorDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredActors, setFeaturedActors] = useState<ActorNode[]>([]);

  useEffect(() => {
    getFeatured().then(res => setFeaturedActors(res.actors || [])).catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getActorDetail(actorId)
      .then(res => { if (isMounted) setData(res); })
      .catch(err => console.error('Failed fetching actor detail:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [actorId]);

  if (loading) return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      <ProfileSkeleton />
    </div>
  );

  if (!data?.actor) return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
      <h2>Actor Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Could not locate actor with ID "{actorId}".</p>
    </div>
  );

  const { actor, insights, filmography, directCollaborators } = data;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1, maxWidth: '480px' }}>
          <SearchBar placeholder="Search & explore another actor..." onSelectResult={(item) => item.type === 'Actor' && onNavigateActor(item.id)} />
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {featuredActors.slice(0, 5).map(fa => (
            <button key={fa.id} onClick={() => onNavigateActor(fa.id)} style={{ background: fa.id === actor.id ? 'var(--primary)' : 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>
              {fa.name}
            </button>
          ))}
        </div>
      </div>

      {/* Profile card */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '3px solid var(--border-glow)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }}>
            <img src={actor.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'} alt={actor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actor Profile & Graph Detail</span>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px', marginBottom: '12px' }}>{actor.name}</h1>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              {actor.birthYear && <span>Born: {actor.birthYear}</span>}
              <span>Popularity: {actor.popularity ? actor.popularity.toFixed(1) : 'N/A'}</span>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => onNavigateHidden(actor.id)} style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.5)', color: '#c084fc', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={15} /> Find Hidden Collaborators for {actor.name}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#818cf8" /> Graph-Derived Insights Panel
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '13px', fontWeight: 600 }}><Film size={18} /> Total Movies in Graph</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>{insights.totalMovies}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontSize: '13px', fontWeight: 600 }}><Users size={18} /> Direct Collaborators</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>{insights.totalCollaborators}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d8b4fe', fontSize: '13px', fontWeight: 600 }}><Flame size={18} /> Most Frequent Collaborator</div>
            {insights.topCollaborator ? (
              <div onClick={() => onNavigateActor(insights.topCollaborator!.id)} style={{ marginTop: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={insights.topCollaborator.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={insights.topCollaborator.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>{insights.topCollaborator.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{insights.topCollaborator.collaborationCount} shared movies</div>
                </div>
              </div>
            ) : <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>None</div>}
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f9a8d4', fontSize: '13px', fontWeight: 600 }}><Award size={18} /> Main Genres</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {insights.genres.length > 0
                ? insights.genres.map(g => <span key={g} style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600 }}>{g}</span>)
                : <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>General</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Filmography + Collaborators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Filmography ({filmography.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filmography.map(movie => (
              <div key={movie.id} onClick={() => onNavigateMovie(movie.id)} className="glass-card glass-card-interactive" style={{ padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer' }}>
                <img src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100'} alt={movie.title} style={{ width: '45px', height: '65px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.title}</div>
                  {movie.role && <div style={{ fontSize: '13px', color: '#818cf8', marginTop: '2px' }}>as {movie.role}</div>}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{movie.releaseYear}</span>
                    <Star size={11} color="#f59e0b" />
                    <span>{movie.rating || 'N/A'}</span>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Direct Collaborators ({directCollaborators.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
            {directCollaborators.map(collab => (
              <div key={collab.id} onClick={() => onNavigateActor(collab.id)} className="glass-card glass-card-interactive" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
                <img src={collab.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={collab.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{collab.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{collab.collaborationCount} shared</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
