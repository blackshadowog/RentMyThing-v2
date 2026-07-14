import React from 'react';
import { Heart, MapPin, Star, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onWishlistToggle, isWishlisted = false, matchScore = null }) {
  if (!product) return null;

  return (
    <article
      className="card"
      onClick={() => onSelectProduct?.(product)}
      style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: 20 }}
    >
      {/* Image */}
      <div className="ratio-4-3" style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="img-cover img-hover"
          loading="lazy"
        />

        {/* Wishlist */}
        {onWishlistToggle && (
          <button
            onClick={e => { e.stopPropagation(); onWishlistToggle(product.id); }}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.92)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Heart
              size={15}
              fill={isWishlisted ? 'var(--coral)' : 'none'}
              color={isWishlisted ? 'var(--coral)' : 'var(--ink-soft)'}
              strokeWidth={2}
            />
          </button>
        )}

        {/* Condition */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span className="badge badge-gray" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
            {product.condition || 'Like New'}
          </span>
        </div>

        {/* Match score */}
        {matchScore && (
          <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
            <span className="badge badge-coral" style={{ boxShadow: 'var(--shadow-sm)' }}>
              ⚡ {matchScore}% match
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {product.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>{product.ownerRating || '4.9'}</span>
          </div>
        </div>

        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14, fontWeight: 700, color: 'var(--ink)',
          lineHeight: 1.4, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.title}
        </h3>

        {/* Price + Owner row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
              ₹{product.rentPricePerDay}
            </span>
            <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontWeight: 500 }}>/day</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 8,
              background: 'var(--coral)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, flexShrink: 0,
            }}>
              {product.ownerName?.[0]?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.ownerName?.split(' ')[0] || 'Host'}
            </span>
            <ShieldCheck size={12} color="var(--green)" strokeWidth={2.5} />
          </div>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={11} color="var(--ink-faint)" />
          <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontWeight: 500 }}>
            {product.college?.split(' - ')[0] || 'IIT Delhi'}
          </span>
        </div>
      </div>
    </article>
  );
}
