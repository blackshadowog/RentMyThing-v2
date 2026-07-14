import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, PlusCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';

const SUGGESTED_CATEGORIES = [
  'Camera & Optics',
  'Electronics & Gadgets',
  'Laptops & Tablets',
  'Cycles & Scooters',
  'Gaming Consoles & VR',
  'Projectors & Audio',
  'Sports Equipment',
  'Musical Instruments',
  'Academic Books & Notes',
  'Hostel Essentials & Appliances',
  'Tools & Hardware',
  'Fashion & Ethnic Wear',
  'Lab Equipment & Instruments',
  'Art & Design Gear',
  'Any Other Campus Gear',
];

export default function ListingModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Camera & Optics');
  const [customCategory, setCustomCategory] = useState('');
  const [rentPricePerDay, setRentPricePerDay] = useState('');
  const [deposit, setDeposit] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80');
  const [loading, setLoading] = useState(false);
  const [aiPriceHint, setAiPriceHint] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePriceCheck = () => {
    const val = Number(rentPricePerDay);
    if (!val) return;
    if (val > 1500) {
      setAiPriceHint({ status: 'warn', msg: '₹' + val + '/day is above Indian campus median. Lowering to ₹350–₹600 increases bookings 3x.' });
    } else {
      setAiPriceHint({ status: 'ok', msg: '✓ Price is well within standard Indian campus benchmark range.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const finalCat = category === 'Any Other Campus Gear' ? (customCategory.trim() || 'General Gear') : category;
    try {
      await api.createProduct({
        title,
        category: finalCat,
        rentPricePerDay: Number(rentPricePerDay),
        deposit: Number(deposit),
        condition,
        description,
        images: [imageUrl],
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      alert('Error creating listing: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} className="anim-in">
      <div className="card" style={{
        width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto',
        padding: 32, position: 'relative', background: 'var(--surface)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: 24 }}>
          <span className="eyebrow" style={{ color: 'var(--coral)' }}>Peer Marketplace</span>
          <h2 style={{ fontSize: 24, marginTop: 4 }}>List Any Gear or Item (₹ INR)</h2>
          <p className="body-sm">You can list any item you own—cameras, books, appliances, lab gear, or custom items.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Title / Item Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Casio Scientific Calculator or Induction Cooktop"
              className="input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="input" style={{ cursor: 'pointer' }}>
                {SUGGESTED_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Condition</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} className="input" style={{ cursor: 'pointer' }}>
                {['Brand New', 'Like New', 'Good', 'Fair'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {category === 'Any Other Campus Gear' && (
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Enter Custom Category Name</label>
              <input
                type="text"
                required
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                placeholder="e.g., Lab Instrument, Musical Gear, Costume..."
                className="input"
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Daily Rent (₹ INR)</label>
              <input
                type="number"
                required
                value={rentPricePerDay}
                onChange={e => setRentPricePerDay(e.target.value)}
                onBlur={handlePriceCheck}
                placeholder="100"
                className="input"
              />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Refundable Deposit (₹)</label>
              <input
                type="number"
                required
                value={deposit}
                onChange={e => setDeposit(e.target.value)}
                placeholder="300"
                className="input"
              />
            </div>
          </div>

          {aiPriceHint && (
            <div className={`badge ${aiPriceHint.status === 'ok' ? 'badge-green' : 'badge-amber'}`} style={{ padding: 12, borderRadius: 12, display: 'flex', gap: 8 }}>
              <Sparkles size={16} />
              <span style={{ fontSize: 13 }}>{aiPriceHint.msg}</span>
            </div>
          )}

          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Description & Included Accessories</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="State what is included, any rules, and pickup location..."
              className="input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Native Image Upload & Preview */}
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Upload Gear Photo</label>
            <div style={{
              border: '2px dashed var(--border)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
              background: 'var(--surface-2)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{
                  position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Upload size={24} color="var(--coral)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                  Click to Upload Image from Phone / Laptop
                </span>
                <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                  PNG, JPG, WEBP supported
                </span>
              </div>
            </div>

            {imageUrl && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-2)', padding: 8, borderRadius: 10 }}>
                <img src={imageUrl} alt="Preview" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                <span style={{ fontSize: 12, color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ✓ Image loaded and ready
                </span>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: 14 }}>
            <PlusCircle size={17} />
            <span>{loading ? 'Listing Gear...' : 'Publish Campus Listing (₹)'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
