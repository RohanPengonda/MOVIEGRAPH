import React from 'react';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';
import type { HealthStatus } from '../../types';

interface Props {
  health: HealthStatus | null;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<Props> = ({ health, onRetry }) => {
  if (!health || health.database.connected) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.12) 0%, rgba(255, 152, 0, 0.06) 100%)',
      border: '1px solid rgba(255, 112, 67, 0.3)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      margin: '20px auto',
      maxWidth: '1200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxShadow: '0 4px 16px rgba(255, 112, 67, 0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255, 112, 67, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d84315', flexShrink: 0 }}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#d84315', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} /> Database Connection Failure (CognoDB / Neo4j)
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
            {health.database.error || `Could not connect to graph database at ${health.database.uri}`}
          </div>
        </div>
      </div>
      <button onClick={onRetry} style={{ background: 'rgba(255, 112, 67, 0.15)', border: '1px solid rgba(255, 112, 67, 0.4)', color: '#d84315', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, transition: 'all 0.3s ease' }}>
        <RefreshCw size={14} /> Retry Connection
      </button>
    </div>
  );
};
