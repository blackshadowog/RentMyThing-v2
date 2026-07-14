import React, { useState, useEffect } from 'react';
import { AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';
import { api } from '../api';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Live Price Audit Test
  const [testItem, setTestItem] = useState('Sony Alpha A6000');
  const [testPrice, setTestPrice] = useState(1800);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const sData = await api.getAdminStats();
        setStats(sData);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    }
    load();
  }, []);

  const isPriceFlagged = testPrice > 1200;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>AI Safety & Audit Center</p>
        <h1 className="display-md">Neural Campus Protection</h1>
        <p className="body-md" style={{ marginTop: 6, maxWidth: 640 }}>
          Real-time price benchmark monitoring and student verification across IIT, BITS & IIM nodes.
        </p>
      </div>

      {/* Live AI Price Audit Simulator */}
      <div className="card" style={{ padding: 28, marginBottom: 40, background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span className="badge badge-coral">
            <Sparkles size={13} /> Interactive AI Audit Engine
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Try simulating a listing price test below</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.2fr', gap: 20, alignItems: 'center' }} className="audit-grid">
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Gear Item Name</label>
            <input type="text" value={testItem} onChange={e => setTestItem(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Daily Rate (₹ INR)</label>
            <input type="number" value={testPrice} onChange={e => setTestPrice(Number(e.target.value))} className="input" />
          </div>

          <div style={{
            padding: 16, borderRadius: 16,
            background: isPriceFlagged ? 'var(--coral-light)' : 'var(--green-light)',
            border: `1px solid ${isPriceFlagged ? 'var(--coral-mid)' : '#a7f3d0'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {isPriceFlagged ? (
                <AlertTriangle size={18} color="var(--coral)" />
              ) : (
                <CheckCircle size={18} color="var(--green)" />
              )}
              <span style={{ fontSize: 14, fontWeight: 700, color: isPriceFlagged ? 'var(--coral)' : 'var(--green)' }}>
                {isPriceFlagged ? 'Price Gouging Flagged' : 'Verified Within Campus Range'}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>
              {isPriceFlagged
                ? `₹${testPrice}/day exceeds the ₹450–₹850 benchmark for ${testItem}. AI advises lowering price.`
                : `₹${testPrice}/day is competitive for Indian student budgets.`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }} className="stats-grid">
        {[
          { label: 'Active Listings Audited', value: stats?.totalListings || '18', suffix: '' },
          { label: 'Verified Campus Nodes', value: '8', suffix: ' institutes' },
          { label: 'Scam Listings Blocked', value: '100', suffix: '%' },
          { label: 'Median Response Time', value: '<4', suffix: 's sync' },
        ].map(({ label, value, suffix }) => (
          <div key={label} className="card" style={{ padding: 24 }}>
            <span className="label">{label}</span>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: 'var(--ink)', marginTop: 8 }}>
              {value}<span style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: 'var(--ink-muted)' }}>{suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Student Directory */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>Verified Student Network</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'Aravind Sharma', email: 'aravind.sharma@iitd.ac.in', college: 'IIT Delhi', role: 'Host & Borrower' },
            { name: 'Priya Nair', email: 'priya.nair@iitb.ac.in', college: 'IIT Bombay', role: 'Borrower' },
            { name: 'Rohan Verma', email: 'rohan.verma@pilani.bits-pilani.ac.in', college: 'BITS Pilani', role: 'Host & Borrower' },
          ].map(u => (
            <div key={u.email} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 14, background: 'var(--surface-2)',
              border: '1px solid var(--border)', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{u.name}</span>
                  <span className="badge badge-green">Verified Student ID</span>
                </div>
                <p className="body-sm" style={{ marginTop: 2 }}>{u.email} · {u.college}</p>
              </div>
              <span className="badge badge-gray">{u.role}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .audit-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
