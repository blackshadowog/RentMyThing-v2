import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';

export default function NLPSearchBar({ onSearch, onParsed, placeholder, className = '' }) {
  const [query, setQuery] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const debounceRef = useRef(null);
  // Keep a stable ref to onParsed so we never need it in the dep array
  const onParsedRef = useRef(onParsed);
  useEffect(() => { onParsedRef.current = onParsed; });

  useEffect(() => {
    if (!query.trim()) { setParsed(null); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setParsing(true);
      // Simulate NLP parse (would call api.parseSearch in production)
      const fakeParsed = {};
      const lower = query.toLowerCase();
      if (lower.match(/under\s*₹?\s*(\d+)/)) fakeParsed.maxPrice = parseInt(RegExp.$1);
      if (lower.match(/(\d+)\s*day/)) fakeParsed.duration = parseInt(RegExp.$1) + ' days';
      const cats = ['camera', 'laptop', 'cycle', 'projector', 'books', 'gaming', 'electronics'];
      cats.forEach(c => { if (lower.includes(c)) fakeParsed.category = c.charAt(0).toUpperCase() + c.slice(1); });
      if (lower.includes('near') || lower.includes('hostel')) fakeParsed.location = 'Nearby';
      setTimeout(() => {
        setParsing(false);
        setParsed(Object.keys(fakeParsed).length ? fakeParsed : null);
        onParsedRef.current?.(fakeParsed);
      }, 400);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query, parsed);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} id="nlp-search-bar">
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Try "camera under ₹500 for 3 days near hostel"'}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-20 text-xs font-medium text-gray-700 placeholder-gray-400 outline-none transition focus:border-rose-500 focus:bg-white focus:shadow-md focus:shadow-rose-100"
          id="nlp-search-input"
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setParsed(null); }}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-1 rounded-xl bg-rose-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600"
            id="nlp-search-submit"
          >
            {parsing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            Search
          </button>
        </div>
      </div>

      {/* Parse indicator chips */}
      {(parsing || parsed) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 animate-fade-in">
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">
            <Sparkles size={10} className="mr-0.5 inline" />
            AI Parsed:
          </span>
          {parsing ? (
            <span className="animate-pulse rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] text-rose-400">
              Analyzing query…
            </span>
          ) : parsed && Object.entries(parsed).map(([key, val]) => (
            <span key={key} className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-600">
              {key}: {val}
            </span>
          ))}
        </div>
      )}
    </form>
  );
}
