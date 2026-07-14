import { useState } from 'react';
import { X, Send, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 'Books', 'Laptop', 'Camera', 'Cycle', 'Gaming', 'Projector',
  'Sports', 'Musical Instruments', 'Kitchen Items', 'Hostel Essentials', 'Tools', 'Fashion',
];

export default function RequestForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    duration: '',
    pickupDate: '',
    college: '',
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
      // handle error
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        id="request-form-modal"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-amber-500" />
              Post a Request
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Let campus know what you need</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition" id="close-request-form">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">What do you need?</label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g., DSLR Camera for college fest"
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition"
              required
              id="request-title-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition"
                required
                id="request-category-select"
              >
                <option value="">Select</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Budget (₹)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => set('budget', e.target.value)}
                placeholder="500"
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition"
                required
                id="request-budget-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Duration</label>
              <input
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="3 days"
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition"
                required
                id="request-duration-input"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Pickup Date</label>
              <input
                type="date"
                value={form.pickupDate}
                onChange={(e) => set('pickupDate', e.target.value)}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition"
                id="request-date-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">College / Location</label>
            <input
              value={form.college}
              onChange={(e) => set('college', e.target.value)}
              placeholder="IIT Delhi"
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition"
              id="request-college-input"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="Add more details about what you need..."
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-medium outline-none focus:border-rose-500 focus:bg-white transition resize-none"
              id="request-desc-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-rose-500 py-3 text-xs font-bold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2"
            id="submit-request-btn"
          >
            <Send size={14} />
            {loading ? 'Posting…' : 'Post Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
