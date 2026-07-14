import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, CheckCircle, ExternalLink, Sparkles, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function CampusMap({ products = [], onSelectProduct }) {
  const [userCoords, setUserCoords] = useState({ lat: 28.5450, lng: 77.1926, label: 'IIT Delhi - Hauz Khas Campus' });
  const [manualInput, setManualInput] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const campusPresets = {
    'iit delhi': { lat: 28.5450, lng: 77.1926, label: 'IIT Delhi - Hauz Khas Campus' },
    'iit bombay': { lat: 19.1334, lng: 72.9133, label: 'IIT Bombay - Powai Campus' },
    'bits pilani': { lat: 28.3638, lng: 75.5870, label: 'BITS Pilani - Vidya Vihar Campus' },
    'iit madras': { lat: 12.9915, lng: 80.2337, label: 'IIT Madras - Adyar Campus' },
    'iim bangalore': { lat: 12.8953, lng: 77.6018, label: 'IIM Bangalore - Bannerghatta Campus' },
  };

  const detectRealLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Your Detected Campus Location' });
        setDetecting(false);
      },
      (err) => {
        alert('Could not detect location. Using IIT Delhi campus center.');
        setDetecting(false);
      }
    );
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    const key = manualInput.toLowerCase().trim();
    for (const [presetKey, presetVal] of Object.entries(campusPresets)) {
      if (presetKey.includes(key) || key.includes(presetKey)) {
        setUserCoords(presetVal);
        return;
      }
    }
    setUserCoords({ lat: 28.5450, lng: 77.1926, label: `${manualInput} (Campus Center)` });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [userCoords.lat, userCoords.lng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 15);
    }

    // Force Leaflet to recompute container size on mount/render
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);
  }, [userCoords]);

  // Render & Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // User Location Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `<div style="width: 20px; height: 20px; background: #2563eb; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 0 0 6px rgba(37,99,235,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    const uMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(mapInstanceRef.current);
    uMarker.bindPopup(`<b>${userCoords.label}</b>`);
    markersRef.current.push(uMarker);

    // Filtered Products
    const list = activeCategory === 'ALL'
      ? products
      : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

    list.forEach((prod, i) => {
      const lat = prod.lat || userCoords.lat + (Math.sin(i + 1) * 0.007);
      const lng = prod.lng || userCoords.lng + (Math.cos(i + 1) * 0.007);

      const prodIcon = L.divIcon({
        className: 'custom-prod-marker',
        html: `<div style="background: #e8472a; color: #fff; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 12px; padding: 5px 10px; border-radius: 20px; box-shadow: 0 4px 12px rgba(232,71,42,0.45); border: 2px solid #fff; white-space: nowrap; cursor: pointer;">₹${prod.rentPricePerDay}</div>`,
        iconSize: [54, 28],
        iconAnchor: [27, 14]
      });

      const marker = L.marker([lat, lng], { icon: prodIcon }).addTo(mapInstanceRef.current);
      marker.on('click', () => setSelectedPin(prod));
      markersRef.current.push(marker);
    });
  }, [products, userCoords, activeCategory]);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Interactive Geographical Map</p>
          <h1 className="display-md">Live Campus Gear Map</h1>
          <p className="body-md" style={{ marginTop: 4 }}>
            Explore verified gear within walking distance of hostels at <strong style={{ color: 'var(--ink)' }}>{userCoords.label}</strong>
          </p>
        </div>

        {/* GPS + Preset controls */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={detectRealLocation} disabled={detecting} className="btn btn-primary btn-sm">
            <Navigation size={14} />
            <span>{detecting ? 'Detecting GPS...' : 'Use Live GPS'}</span>
          </button>
          {Object.entries(campusPresets).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setUserCoords(val)}
              className="btn btn-secondary btn-sm"
            >
              {val.label.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Search bar */}
      <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          value={manualInput}
          onChange={e => setManualInput(e.target.value)}
          placeholder="Search campus or institute (e.g. IIT Bombay, BITS Pilani)..."
          className="input"
        />
        <button type="submit" className="btn btn-secondary">
          <Search size={15} /> Locate
        </button>
      </form>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }} className="scrollbar-none">
        {['ALL', 'Camera', 'Laptop', 'Cycle', 'Gaming', 'Electronics', 'Books'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? 'pill pill-solid' : 'pill pill-outline'}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map Container Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedPin ? '2fr 1fr' : '1fr', gap: 24 }}>
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: 560,
            minHeight: 560,
            borderRadius: 24,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1
          }}
        />

        {/* Selected Pin Side Card */}
        {selectedPin && (
          <div className="card anim-in" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden' }} className="ratio-16-9">
              <img src={selectedPin.images?.[0]} alt={selectedPin.title} className="img-cover" />
            </div>
            <div>
              <span className="badge badge-coral">{selectedPin.category}</span>
              <h3 style={{ fontSize: 20, marginTop: 10 }}>{selectedPin.title}</h3>
              <p className="body-sm" style={{ marginTop: 4 }}>{selectedPin.college}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700 }}>₹{selectedPin.rentPricePerDay}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>/day</span>
              </div>
              <button onClick={() => onSelectProduct?.(selectedPin)} className="btn btn-primary">
                View & Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
