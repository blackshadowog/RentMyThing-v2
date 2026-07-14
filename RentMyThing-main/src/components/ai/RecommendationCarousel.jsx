import React from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../ProductCard';

export default function RecommendationCarousel({ title, subtitle, products = [], onSelectProduct, onWishlistToggle, wishlistedIds = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <div>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontFamily: "'Fraunces', serif", fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 4 }}>{subtitle}</p>}
          </div>
        </div>
      )}

      <div style={{
        display: 'flex', gap: 20, overflowX: 'auto',
        paddingBottom: 8, scrollSnapType: 'x mandatory',
      }} className="scrollbar-none">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="anim-up"
            style={{
              minWidth: 260, maxWidth: 280, flexShrink: 0,
              scrollSnapAlign: 'start',
              animationDelay: `${idx * 70}ms`, animationFillMode: 'both',
            }}
          >
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
    </div>
  );
}
