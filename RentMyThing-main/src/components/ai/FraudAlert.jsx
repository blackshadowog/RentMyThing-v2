import { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, Info } from 'lucide-react';

export default function FraudAlert({ severity = 'medium', message, details, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const isHigh = severity === 'high';
  const Icon = isHigh ? ShieldAlert : AlertTriangle;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 18px', borderRadius: 16,
      background: isHigh ? 'var(--coral-light)' : 'var(--amber-light)',
      border: `1px solid ${isHigh ? 'var(--coral-mid)' : '#fde68a'}`,
      marginBottom: 20,
    }} className="anim-in">
      <Icon size={18} color={isHigh ? 'var(--coral)' : 'var(--amber)'} style={{ marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: isHigh ? 'var(--coral)' : 'var(--amber)' }}>
          AI Safety Guard
        </span>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: '4px 0 0' }}>
          {message || 'Listing screened by our real-time Indian campus price safety benchmark.'}
        </p>
        {details && <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{details}</p>}
      </div>
      {onDismiss && (
        <button onClick={() => { setDismissed(true); onDismiss(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}
