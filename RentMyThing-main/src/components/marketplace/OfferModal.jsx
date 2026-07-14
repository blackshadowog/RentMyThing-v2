import { useState } from 'react';
import { X, Send, Package } from 'lucide-react';

export default function OfferModal({ request, onClose, onSubmit }) {
  const [form, setForm] = useState({
    price: request?.budget || '',
    message: '',
    productId: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.(form);
      onClose?.();
    } catch {
      // handle
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        id="offer-modal"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Package size={16} className="text-rose-500" />
              Make an Offer
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              For: <span className="font-semibold text-gray-700">{request?.title}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Request summary */}
        <div className="rounded-2xl bg-amber-50 p-3 mb-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-medium">Budget: <strong>₹{request?.budget}</strong></span>
            <span className="text-amber-600">{request?.duration}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Your Price (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="Enter your price"
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition"
              required
              id="offer-price-input"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              rows={3}
              placeholder="Describe your item and availability..."
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition resize-none"
              id="offer-message-input"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-rose-500 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
              id="submit-offer-btn"
            >
              <Send size={12} />
              {loading ? 'Sending…' : 'Send Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
