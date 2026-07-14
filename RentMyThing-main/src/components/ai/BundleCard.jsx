import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function BundleCard({ bundle, onSelectBundle }) {
  if (!bundle) return null;

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="badge badge-coral">
            Save {bundle.discountPercent || 20}% OFF
          </span>
          <Sparkles size={14} color="var(--amber)" />
        </div>

        <h3 style={{ fontSize: 18, marginBottom: 8 }}>{bundle.name}</h3>
        <p className="body-sm" style={{ marginBottom: 16 }}>{bundle.description}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bundle.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coral)', flexShrink: 0 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 20 }}>
        <div>
          <span className="label" style={{ display: 'block', fontSize: 10 }}>Bundle Daily Rate</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>₹{bundle.totalPrice}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>/day</span>
        </div>

        <button onClick={onSelectBundle} className="btn btn-secondary btn-sm">
          <span>Rent Kit</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
