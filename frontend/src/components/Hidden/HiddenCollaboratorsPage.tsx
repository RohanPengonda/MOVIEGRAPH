import React, { useState, useEffect } from 'react';
import { Eye, Film, ArrowRight, UserCheck, ShieldAlert, Code2 } from 'lucide-react';
import { getHiddenCollaborators, getFeatured } from '../../api/client';
import type { HiddenCollaboratorsResponse, ActorNode } from '../../types';
import { SearchBar } from '../Common/SearchBar';
import { EmptyState } from '../Common/EmptyState';

interface Props {
  actorId?: string;
  onNavigateActor: (actorId: string) => void;
  onNavigateMovie: (movieId: string) => void;
}

export const HiddenCollaboratorsPage: React.FC<Props> = ({ actorId = 'a6193', onNavigateActor, onNavigateMovie }) => {
  const [currentActorId, setCurrentActorId] = useState(actorId);
  const [data, setData] = useState<HiddenCollaboratorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredActors, setFeaturedActors] = useState<ActorNode[]>([]);
  const [showSqlComparison, setShowSqlComparison] = useState(true);

  useEffect(() => { setCurrentActorId(actorId); }, [actorId]);
  useEffect(() => { getFeatured().then(res => setFeaturedActors(res.actors || [])).catch(() => {}); }, []);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getHiddenCollaborators(currentActorId)
      .then(res => { if (isMounted) setData(res); })
      .catch(err => console.error('Failed fetching hidden collaborators:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [currentActorId]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
          <Eye size={14} /> FEATURE 3 — "SQL WOULD HATE THIS" QUERY
        </div>
        <h1 className="text-gradient" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '10px' }}>Hidden Collaborators</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '680px', margin: '0 auto' }}>
          Find actors who share <strong>3 or more co-stars in common</strong> with the target actor, but have <strong>never acted in a movie together directly</strong>.
        </p>
      </div>

      {/* Actor selector */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, maxWidth: '480px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#c084fc', marginBottom: '8px', textTransform: 'uppercase' }}>Select Target Actor to Inspect</label>
            <SearchBar placeholder="Search target actor (e.g. Leonardo DiCaprio, Tom Hanks)..." onSelectResult={(item) => item.type === 'Actor' && setCurrentActorId(item.id)} />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Select:</span>
            {featuredActors.slice(0, 4).map(fa => (
              <button key={fa.id} onClick={() => setCurrentActorId(fa.id)} style={{ background: fa.id === currentActorId ? 'rgba(168, 85, 247, 0.3)' : 'rgba(30, 41, 59, 0.8)', border: fa.id === currentActorId ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {fa.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SQL comparison */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 size={20} color="#c084fc" />
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Why a Graph Database? (SQL vs openCypher)</span>
          </div>
          <button onClick={() => setShowSqlComparison(!showSqlComparison)} style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            {showSqlComparison ? 'Hide Benchmark' : 'Show Query Comparison'}
          </button>
        </div>
        {showSqlComparison && (
          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(9, 13, 22, 0.8)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', marginBottom: '6px' }}>✓ openCypher Query (1 Clean Traversal)</div>
              <pre style={{ fontSize: '11px', color: '#e2e8f0', fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`MATCH (a:Actor {id: $actorId})-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(shared:Actor)
WHERE a <> shared
WITH a, shared, count(*) AS commonMovies
WHERE commonMovies >= 3
  AND NOT (a)-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(shared)
RETURN shared, commonMovies ORDER BY commonMovies DESC`}
              </pre>
            </div>
            <div style={{ background: 'rgba(9, 13, 22, 0.8)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171', marginBottom: '6px' }}>✕ Relational SQL (Multiple Self-Joins & Anti-Joins)</div>
              <pre style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`SELECT a2.actor_id, COUNT(DISTINCT m1.movie_id) FROM cast c1
JOIN cast c2 ON c1.movie_id = c2.movie_id
JOIN cast c3 ON c2.actor_id = c3.actor_id
... -- 4 table joins, GROUP BY, HAVING, NOT EXISTS anti-join --`}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Target actor label */}
      {data?.targetActor && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <img src={data.targetActor.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={data.targetActor.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Inspecting Hidden Collaborators For</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{data.targetActor.name}</h2>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Computing hidden collaborator graph paths...</div>
      ) : !data || data.hiddenCollaborators.length === 0 ? (
        <EmptyState
          title="No Hidden Collaborators Discovered"
          description={`In the current dataset, there are no actors who share 3+ co-stars with ${data?.targetActor?.name || 'this actor'} without having directly acted together.`}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {data.hiddenCollaborators.map((item, idx) => (
            <div key={item.actor.id} className="glass-card glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>Rank #{idx + 1}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserCheck size={14} /> {item.commonMoviesCount} Shared Co-stars
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img src={item.actor.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={item.actor.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 onClick={() => onNavigateActor(item.actor.id)} style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>{item.actor.name}</h3>
                    <div style={{ fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <ShieldAlert size={12} /> Never Acted Together Directly
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', textTransform: 'uppercase' }}>Shared Connecting Movies:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {item.commonMovies.map(movie => (
                      <div key={movie.id} onClick={() => onNavigateMovie(movie.id)} style={{ fontSize: '13px', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Film size={13} color="#22d3ee" /> {movie.title} ({movie.releaseYear})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => onNavigateActor(item.actor.id)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  View Actor Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
