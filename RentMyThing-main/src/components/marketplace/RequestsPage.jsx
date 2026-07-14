import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, MessageSquare, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { api } from '../../api';

export default function RequestsPage({ user, onOpenAuthModal }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('2');
  const [pickupDate, setPickupDate] = useState('2026-07-18');
  const [activeOfferReqId, setActiveOfferReqId] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getRequests();
      setRequests(data || []);
    } catch (err) {
      console.error('Failed loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!user) { onOpenAuthModal(); return; }
    try {
      await api.createRequest({
        title,
        description,
        category,
        maxDailyBudget: Number(budget),
        durationDays: Number(duration),
        pickupDate,
      });
      setShowModal(false);
      setTitle(''); setDescription(''); setBudget('');
      loadRequests();
    } catch (err) {
      alert('Error posting request: ' + err.message);
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!user) { onOpenAuthModal(); return; }
    try {
      await api.addRequestOffer(activeOfferReqId, {
        pricePerDay: Number(offerPrice),
        message: offerMessage,
      });
      setActiveOfferReqId(null);
      setOfferPrice(''); setOfferMessage('');
      loadRequests();
    } catch (err) {
      alert('Error submitting offer: ' + err.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Student Demand Hub</p>
          <h1 className="display-md">Need Something on Campus?</h1>
          <p className="body-md" style={{ marginTop: 4 }}>
            Post what gear you need for hackathons, shoots, or projects. Verified peers offer their gear instantly.
          </p>
        </div>

        <button onClick={() => user ? setShowModal(true) : onOpenAuthModal()} className="btn btn-primary">
          <Plus size={16} /> Post Demand Request (₹)
        </button>
      </div>

      {/* Grid of requests */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 260 }} />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: 'center', maxWidth: 480, margin: '40px auto' }}>
          <ClipboardList size={44} color="var(--ink-faint)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 20 }}>No active demand requests</h3>
          <p className="body-md" style={{ marginTop: 6, marginBottom: 20 }}>Be the first to ask for gear you need on campus!</p>
          <button onClick={() => user ? setShowModal(true) : onOpenAuthModal()} className="btn btn-primary">+ Post Request</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="requests-grid">
          {requests.map(r => (
            <div key={r.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className="badge badge-coral">{r.category || 'Gear'}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{r.durationDays || 2} day(s)</span>
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{r.title}</h3>
                <p className="body-sm" style={{ marginBottom: 16 }}>{r.description}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <span className="label" style={{ display: 'block', fontSize: 10 }}>Max Daily Budget</span>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>₹{r.maxDailyBudget}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>/day</span>
                  </div>
                  <span className="badge badge-gray">{r.offers?.length || 0} peer offer(s)</span>
                </div>

                <button
                  onClick={() => user ? setActiveOfferReqId(r.id) : onOpenAuthModal()}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageSquare size={14} /> Offer Your Gear
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 32, background: 'var(--surface)', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: 22, marginBottom: 6 }}>Post Student Demand</h3>
            <p className="body-sm" style={{ marginBottom: 20 }}>Specify what you need and your max daily rental budget.</p>
            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Need DSLR Camera for Inter-IIT Shoot" className="input" />
              <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} placeholder="Specify lens or accessories needed..." className="input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input type="number" required value={budget} onChange={e => setBudget(e.target.value)} placeholder="Max ₹/day (e.g. 450)" className="input" />
                <input type="number" required value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration in days (e.g. 3)" className="input" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Publish Demand Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {activeOfferReqId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 440, padding: 28, background: 'var(--surface)', position: 'relative' }}>
            <button onClick={() => setActiveOfferReqId(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Offer Your Gear</h3>
            <form onSubmit={handleSubmitOffer} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <input type="number" required value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="Your daily rental offer (₹ INR)" className="input" />
              <textarea rows={3} required value={offerMessage} onChange={e => setOfferMessage(e.target.value)} placeholder="Mention what gear you can provide and hostel pickup room..." className="input" />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Offer
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .requests-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .requests-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
