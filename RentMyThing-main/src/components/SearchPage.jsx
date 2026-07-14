import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import NLPSearchBar from './ai/NLPSearchBar';
import { api } from '../api';

const CATEGORIES = ['All', 'Electronics', 'Laptop', 'Camera', 'Cycle', 'Gaming', 'Projector', 'Sports', 'Musical Instruments', 'Books', 'Hostel Essentials', 'Tools', 'Fashion'];

export default function SearchPage({ onSelectProduct, onWishlistToggle, wishlistedIds = [], onViewChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState(2000);
  const [nlpInfo, setNlpInfo] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory === 'All' ? '' : selectedCategory,
        search: searchQuery,
      });
      let result = data || [];

      if (sortBy === 'price_asc') result = [...result].sort((a, b) => a.rentPricePerDay - b.rentPricePerDay);
      if (sortBy === 'price_desc') result = [...result].sort((a, b) => b.rentPricePerDay - a.rentPricePerDay);
      if (sortBy === 'rating') result = [...result].sort((a, b) => (b.ownerRating || 0) - (a.ownerRating || 0));

      result = result.filter(p => p.rentPricePerDay <= priceMax);
      setProducts(result);
    } catch (err) {
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, priceMax]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleNLPResult = (parsed) => {
    setNlpInfo(parsed);
    if (parsed.category && CATEGORIES.includes(parsed.category)) setSelectedCategory(parsed.category);
    if (parsed.keyword) setSearchQuery(parsed.keyword);
  };

  return (
    <div className="container" style={{ paddingBottom: 96, paddingTop: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Indian Campus Gear Directory</p>
            <h1 className="display-md">Browse Campus Gear</h1>
            <p className="body-md" style={{ marginTop: 4 }}>
              {loading ? 'Searching campus nodes...' : `${products.length} verified student listings`} · ₹ INR pricing
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: showFilters ? 'var(--coral)' : 'var(--border)' }}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>

            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
                style={{ paddingRight: 32, paddingLeft: 14, paddingTop: 8, paddingBottom: 8, fontSize: 13, cursor: 'pointer', width: 'auto' }}
              >
                <option value="default">Sort: Relevance</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Host Rating</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-muted)' }} />
            </div>
          </div>
        </div>

        {/* AI NLP Search Bar */}
        <NLPSearchBar onSearch={handleNLPResult} />

        {/* Price slider filter */}
        {showFilters && (
          <div className="card-flat anim-slide" style={{ padding: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', display: 'block', marginBottom: 8 }}>
              Max Daily Rental Rate: <span style={{ color: 'var(--coral)', fontFamily: "'Fraunces', serif" }}>₹{priceMax}/day</span>
            </label>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--coral)', cursor: 'pointer' }}
            />
          </div>
        )}

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'pill pill-solid' : 'pill pill-outline'}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* NLP Parsed banner */}
      {nlpInfo && (
        <div className="badge badge-coral" style={{ padding: '10px 16px', marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} />
            <span>AI search parsed: Category "{nlpInfo.category || 'All'}" · Query "{nlpInfo.keyword}"</span>
          </span>
          <button onClick={() => { setNlpInfo(null); setSelectedCategory('All'); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', fontWeight: 700 }}>
            Clear
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="grid-responsive">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 320 }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card-flat" style={{ padding: '64px 24px', textAlign: 'center', maxWidth: 460, margin: '40px auto' }}>
          <HelpCircle size={48} color="var(--ink-faint)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>No matching gear found</h3>
          <p className="body-md" style={{ marginBottom: 20 }}>Try selecting a different category or post a student demand request.</p>
          <button onClick={() => onViewChange?.('requests')} className="btn btn-primary">
            Post a Demand Request
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="grid-responsive">
          {products.map((product, idx) => (
            <div key={product.id} className="anim-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <ProductCard
                product={product}
                onSelectProduct={onSelectProduct}
                onWishlistToggle={onWishlistToggle}
                isWishlisted={wishlistedIds.includes(product.id)}
                matchScore={idx === 0 ? 96 : idx === 1 ? 91 : null}
              />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) { .grid-responsive { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 768px) { .grid-responsive { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
