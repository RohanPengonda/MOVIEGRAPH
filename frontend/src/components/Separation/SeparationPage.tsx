import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Compass, Loader2 } from 'lucide-react';
import { SearchBar } from '../Common/SearchBar';
import { InteractiveGraph } from '../Graph/InteractiveGraph';
import { getDegreesOfSeparation, getFeatured } from '../../api/client';
import type { SearchResult, DegreesOfSeparationResponse, ActorNode } from '../../types';

interface Props {
  onNavigateActor: (actorId: string) => void;
  onNavigateMovie: (movieId: string) => void;
}

export const SeparationPage: React.FC<Props> = ({ onNavigateActor, onNavigateMovie }) => {
  const [actorA, setActorA] = useState<SearchResult | null>(null);
  const [actorB, setActorB] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DegreesOfSeparationResponse | null>(null);
  const [featuredActors, setFeaturedActors] = useState<ActorNode[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getFeatured().then(res => {
      if (res?.actors?.length >= 2) {
        setFeaturedActors(res.actors);
        const kb = res.actors.find((a: ActorNode) => a.name.includes('Kevin Bacon')) || res.actors[0];
        const ldc = res.actors.find((a: ActorNode) => a.name.includes('Leonardo DiCaprio')) || res.actors[1];
        setActorA({ type: 'Actor', id: kb.id, title: kb.name, image: kb.profileImageUrl, popularity: kb.popularity || 0 });
        setActorB({ type: 'Actor', id: ldc.id, title: ldc.name, image: ldc.profileImageUrl, popularity: ldc.popularity || 0 });
      }
    }).catch(() => {});
  }, []);

  const handleFindConnection = async (aId?: string, bId?: string) => {
    const fromId = aId || actorA?.id;
    const toId = bId || actorB?.id;
    if (!fromId || !toId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await getDegreesOfSeparation(fromId, toId);
      setResult(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to compute shortest path connection.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetPair = (a1: ActorNode, a2: ActorNode) => {
    const itemA: SearchResult = { type: 'Actor', id: a1.id, title: a1.name, image: a1.profileImageUrl, popularity: a1.popularity || 0 };
    const itemB: SearchResult = { type: 'Actor', id: a2.id, title: a2.name, image: a2.profileImageUrl, popularity: a2.popularity || 0 };
    setActorA(itemA);
    setActorB(itemB);
    handleFindConnection(a1.id, a2.id);
  };

  const actorSlot = (actor: SearchResult | null, label: string, labelColor: string, borderColor: string, onClear: () => void, onSet: (r: SearchResult) => void) => (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: labelColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {actor ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.8)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={actor.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={actor.title} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#ffffff' }}>{actor.title}</span>
          </div>
          <button onClick={onClear} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '12px' }}>Change</button>
        </div>
      ) : (
        <SearchBar placeholder={`Search ${label.toLowerCase()}...`} onSelectResult={(r) => r.type === 'Actor' && onSet(r)} />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 152, 0, 0.15)', border: '1px solid rgba(255, 152, 0, 0.3)', color: '#e65100', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
          <Sparkles size={14} /> FLAGSHIP GRAPH TRAVERSAL FEATURE
        </div>
        <h1 className="text-gradient" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '10px' }}>Degrees of Separation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
          Find the shortest graph connection between any two actors through shared movie credits, powered by openCypher graph traversal.
        </p>
      </div>

      {/* Search card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
          {actorSlot(actorA, 'First Actor (Start Node)', '#ff9800', 'var(--border-glow)', () => setActorA(null), setActorA)}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 152, 0, 0.15)', border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9800' }}>
              <ArrowRight size={20} />
            </div>
          </div>
          {actorSlot(actorB, 'Second Actor (Target Node)', '#22d3ee', 'rgba(6, 182, 212, 0.4)', () => setActorB(null), setActorB)}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            disabled={!actorA || !actorB || loading}
            onClick={() => handleFindConnection()}
            style={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: '#ffffff', border: 'none', padding: '12px 32px', borderRadius: 'var(--radius-full)', fontSize: '15px', fontWeight: 700, cursor: actorA && actorB && !loading ? 'pointer' : 'not-allowed', opacity: actorA && actorB && !loading ? 1 : 0.6, boxShadow: '0 8px 24px rgba(255, 152, 0, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
          >
            {loading
              ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Traversing Graph...</>
              : <><Compass size={18} /> Find Connection Path</>}
          </button>
        </div>

        {featuredActors.length >= 4 && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '10px' }}>Try Example Searches:</span>
            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
              <button onClick={() => handlePresetPair(featuredActors[0], featuredActors[1])} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', cursor: 'pointer' }}>
                {featuredActors[0]?.name} & {featuredActors[1]?.name}
              </button>
              <button onClick={() => handlePresetPair(featuredActors[2], featuredActors[3])} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', cursor: 'pointer' }}>
                {featuredActors[2]?.name} & {featuredActors[3]?.name}
              </button>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="glass-card" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5', marginBottom: '24px' }}>
          {errorMsg}
        </div>
      )}

      {result && (
        result.found && result.path ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Result summary */}
            <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)', borderColor: 'var(--border-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Graph Traversal Result</span>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {result.degrees} {result.degrees === 1 ? 'Degree' : 'Degrees'} of Separation
                  </h2>
                </div>
                <div style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.5)', fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
                  {result.path.filter(n => n.type === 'Actor').length} Actors · {result.path.filter(n => n.type === 'Movie').length} Shared Movies
                </div>
              </div>
              <div style={{ marginTop: '16px', padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '15px', lineHeight: '1.6', color: '#ffffff' }}>
                <strong style={{ color: '#ff9800' }}>Connection: </strong>{result.explanation}
              </div>
            </div>

            {/* Graph */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#ff9800" /> Visual Network Path
              </h3>
              <InteractiveGraph
                nodes={result.nodes || []}
                links={result.links || []}
                onNodeClick={(node) => {
                  if (node.type === 'Actor') onNavigateActor(node.id);
                  else if (node.type === 'Movie') onNavigateMovie(node.id);
                }}
              />
            </div>

            {/* Path timeline */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Step-by-Step Path Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.path.map((item, index) => {
                  const isActor = item.type === 'Actor';
                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className="glass-card glass-card-interactive"
                      onClick={() => isActor ? onNavigateActor(item.id) : onNavigateMovie(item.id)}
                      style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderLeft: `4px solid ${isActor ? '#ff9800' : '#d84315'}` }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: isActor ? '50%' : '8px', overflow: 'hidden', background: '#1e293b', flexShrink: 0 }}>
                        <img src={item.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: isActor ? '#ff9800' : '#d84315', textTransform: 'uppercase' }}>Step {index + 1} · {item.type}</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{item.name || item.title}</div>
                      </div>
                      {item.year && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.year}</div>}
                      <ArrowRight size={16} color="var(--text-muted)" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#d84315', marginBottom: '8px' }}>No Connection Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {result.message || 'No connection path exists within 6 degrees of separation in the current dataset.'}
            </p>
          </div>
        )
      )}
    </div>
  );
};
