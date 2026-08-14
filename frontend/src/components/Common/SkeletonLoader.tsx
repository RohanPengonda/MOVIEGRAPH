import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px' }}>
    <div className="skeleton" style={{ width: '80px', height: '110px', flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="skeleton" style={{ width: '65%', height: '22px' }} />
      <div className="skeleton" style={{ width: '40%', height: '14px' }} />
      <div className="skeleton" style={{ width: '90%', height: '14px', marginTop: 'auto' }} />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div style={{ display: 'flex', gap: '24px', alignItems: 'center', margin: '24px 0' }}>
    <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%', flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="skeleton" style={{ width: '240px', height: '32px' }} />
      <div className="skeleton" style={{ width: '180px', height: '16px' }} />
      <div className="skeleton" style={{ width: '320px', height: '14px' }} />
    </div>
  </div>
);
