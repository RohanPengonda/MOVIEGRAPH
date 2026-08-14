import React from 'react';
import { SearchX } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<Props> = ({
  title = 'No Data Found',
  description = 'No matching records were discovered in the movie relationship graph.',
  icon,
  actionText,
  onAction,
}) => (
  <div style={{ textAlign: 'center', padding: '48px 24px', margin: '24px auto', maxWidth: '560px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#818cf8' }}>
      {icon || <SearchX size={32} />}
    </div>
    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{title}</h3>
    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', marginBottom: actionText ? '20px' : 0 }}>{description}</p>
    {actionText && onAction && (
      <button onClick={onAction} style={{ background: 'var(--primary)', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
        {actionText}
      </button>
    )}
  </div>
);
