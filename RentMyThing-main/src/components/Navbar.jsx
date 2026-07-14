import React, { useState } from 'react';
import { ShieldCheck, LogOut, Plus, Menu, X, User, LayoutDashboard, ChevronDown } from 'lucide-react';
import LogoIcon from './LogoIcon';

export default function Navbar({ currentView, onViewChange, user, onOpenAuthModal, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Explore' },
    { id: 'search', label: 'Search Gear' },
    { id: 'requests', label: 'Demand Hub' },
    { id: 'map', label: 'Live Map' },
    { id: 'ai', label: 'AI Safety Center' },
  ];

  const go = (id) => {
    onViewChange(id);
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('rt_user');
    localStorage.removeItem('rt_token');
    onLogout?.();
    setProfileDropdownOpen(false);
    go('home');
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 68,
        }}>
          {/* Logo */}
          <div
            onClick={() => go('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <LogoIcon size={42} />
            <div>
              <span style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
                display: 'block',
                lineHeight: 1.1,
              }}>
                RentMyThing
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Campus India
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            {navItems.map(({ id, label }) => {
              const isActive = currentView === id || (id === 'ai' && currentView === 'aifraud');
              return (
                <button
                  key={id}
                  onClick={() => go(id)}
                  style={{
                    background: isActive ? 'var(--surface-2)' : 'transparent',
                    color: isActive ? 'var(--coral)' : 'var(--ink-soft)',
                    border: 'none',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.2s',
                    borderRadius: 8,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, position: 'relative' }}>
            <button onClick={() => go('list')} className="btn btn-primary btn-sm hidden-mobile">
              <Plus size={14} />
              List Gear
            </button>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  title="Profile menu"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px 6px 6px',
                    borderRadius: 100,
                    border: '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--coral)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  className="hidden-mobile"
                >
                  <div style={{
                    height: 28, width: 28, borderRadius: '50%',
                    background: 'var(--coral)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, fontFamily: "'Inter', sans-serif",
                    flexShrink: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--ink-muted)" />
                </button>

                {/* Profile Section Dropdown (contains Dashboard and Log Out) */}
                {profileDropdownOpen && (
                  <div className="card anim-in" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 220,
                    padding: 8,
                    background: 'var(--surface)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    zIndex: 1000,
                  }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{user.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    </div>

                    <button
                      onClick={() => go('dashboard')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '10px 12px', border: 'none', background: 'none',
                        textAlign: 'left', cursor: 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 600,
                        color: 'var(--ink)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LayoutDashboard size={16} color="var(--coral)" />
                      <span>My Profile & Dashboard</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '10px 12px', border: 'none', background: 'none',
                        textAlign: 'left', cursor: 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 600,
                        color: '#dc2626'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onOpenAuthModal} className="btn btn-secondary btn-sm hidden-mobile">
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10,
                border: '1.5px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={18} color="var(--ink)" /> : <Menu size={18} color="var(--ink)" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 68,
          left: 0, right: 0,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px 24px',
          zIndex: 890,
          boxShadow: 'var(--shadow-md)',
        }} className="anim-in">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                style={{
                  background: currentView === id ? 'var(--surface-2)' : 'transparent',
                  color: currentView === id ? 'var(--coral)' : 'var(--ink)',
                  border: 'none',
                  padding: '12px 14px',
                  textAlign: 'left',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: currentView === id ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => go('list')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={15} />
              List Gear
            </button>
            {user ? (
              <>
                <button
                  onClick={() => go('dashboard')}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  My Profile & Dashboard ({user.name})
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); onOpenAuthModal(); }}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
