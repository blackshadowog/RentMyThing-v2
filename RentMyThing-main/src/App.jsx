import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import ProductDetail from './components/ProductDetail';
import ListingModal from './components/ListingModal';
import ChatModal from './components/ChatModal';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import RequestsPage from './components/marketplace/RequestsPage';
import CampusMap from './components/map/CampusMap';
import AIFraudCenter from './components/ai/AIFraudCenter';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { api } from './api';
import './App.css';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [activeChatPeer, setActiveChatPeer] = useState(null);
  const [auditTargetProduct, setAuditTargetProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const handleRunSafetyAuditForProduct = (prod) => {
    setAuditTargetProduct(prod);
    setActiveView('ai');
  };

  // Load current user and initial products
  const fetchUserAndProducts = async () => {
    try {
      const u = await api.getMe();
      setUser(u);
      const prods = await api.getProducts();
      setAllProducts(prods || []);
      if (u) {
        const wData = await api.getWishlist();
        setWishlistIds((wData || []).map((p) => p.id));
      }
    } catch (err) {
      console.error('Initial load error:', err);
    }
  };

  useEffect(() => {
    fetchUserAndProducts();
  }, []);

  const handleViewChange = (view) => {
    if (view === 'list') {
      if (!user) {
        setShowAuthModal(true);
      } else {
        setShowListingModal(true);
      }
      return;
    }
    setActiveView(view);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await api.toggleWishlist(productId);
      if (res.wishlistIds) {
        setWishlistIds(res.wishlistIds);
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  const handleOpenDirectChat = (recipientId, recipientName, details) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setActiveChatPeer({
      id: recipientId,
      name: recipientName,
      details
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f1117] selection:bg-[#fbd5cc] selection:text-[#0f1117]">
      {/* Top Glassmorphism Navbar */}
      <Navbar
        currentView={activeView}
        activeView={activeView}
        onViewChange={handleViewChange}
        user={user}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('rt_token');
          localStorage.removeItem('rt_user');
          setActiveView('home');
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomePage
            onViewChange={handleViewChange}
            onSelectProduct={handleSelectProduct}
            onWishlistToggle={handleWishlistToggle}
            wishlistedIds={wishlistIds}
          />
        )}

        {activeView === 'search' && (
          <SearchPage
            onSelectProduct={handleSelectProduct}
            onWishlistToggle={handleWishlistToggle}
            wishlistedIds={wishlistIds}
          />
        )}

        {activeView === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CampusMap products={allProducts} onSelectProduct={handleSelectProduct} />
          </div>
        )}

        {(activeView === 'ai' || activeView === 'aifraud') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AIFraudCenter
              allProducts={allProducts}
              initialProduct={auditTargetProduct}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        )}

        {activeView === 'requests' && (
          <RequestsPage
            user={user}
            onOpenAuthModal={() => setShowAuthModal(true)}
            allProducts={allProducts}
          />
        )}

        {activeView === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            user={user}
            onBack={() => setActiveView('home')}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onBookingSuccess={() => setActiveView('dashboard')}
            onOpenDirectChat={handleOpenDirectChat}
            onRunSafetyAudit={handleRunSafetyAuditForProduct}
          />
        )}

        {activeView === 'dashboard' && (
          <Dashboard
            user={user}
            onRefreshUser={fetchUserAndProducts}
            onSelectProduct={handleSelectProduct}
            onViewChange={handleViewChange}
            onOpenDirectChat={handleOpenDirectChat}
            onUpdateUser={(updated) => setUser(updated)}
            onLogout={() => {
              setUser(null);
              localStorage.removeItem('rt_token');
              localStorage.removeItem('rt_user');
              setActiveView('home');
            }}
          />
        )}

        {activeView === 'admin' && <AdminPanel />}
      </main>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setShowAuthModal(false);
            fetchUserAndProducts();
          }}
        />
      )}

      {showListingModal && (
        <ListingModal
          userCollege={user?.college || 'IIT Delhi - Hauz Khas Campus'}
          userHostel={user?.hostel || 'Karakoram Hostel'}
          onClose={() => setShowListingModal(false)}
          onSuccess={() => {
            setShowListingModal(false);
            fetchUserAndProducts();
          }}
        />
      )}

      {activeChatPeer && (
        <ChatModal
          user={user}
          recipientId={activeChatPeer.id}
          recipientName={activeChatPeer.name}
          recipientDetails={activeChatPeer.details}
          onClose={() => setActiveChatPeer(null)}
        />
      )}

      <Footer onViewChange={handleViewChange} />
    </div>
  );
}
