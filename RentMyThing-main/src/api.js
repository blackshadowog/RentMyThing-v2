// Comprehensive API Client for RentMyThing AI Campus Marketplace India

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('rt_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function handleResponse(res) {
  if (!res.ok) {
    let msg = 'API request failed';
    try {
      const data = await res.json();
      if (data.error) msg = data.error;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  // Authentication
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await handleResponse(res);
    if (result.token) localStorage.setItem('rt_token', result.token);
    return result;
  },

  async sendOtp(email) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await handleResponse(res);
  },

  async verifyOtp(email, otp) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return await handleResponse(res);
  },

  async sendMobileOtp(phone) {
    const res = await fetch(`${API_BASE}/auth/send-mobile-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    return await handleResponse(res);
  },

  async verifyMobileOtp(phone, otp) {
    const res = await fetch(`${API_BASE}/auth/verify-mobile-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    return await handleResponse(res);
  },

  async login(email) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await handleResponse(res);
    if (result.token) localStorage.setItem('rt_token', result.token);
    return result;
  },

  async googleAuth(data) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await handleResponse(res);
    if (result.token) localStorage.setItem('rt_token', result.token);
    return result;
  },

  async getMe() {
    const token = localStorage.getItem('rt_token');
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() });
    if (!res.ok) return null;
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async verifyStudent(idType) {
    const res = await fetch(`${API_BASE}/auth/verify-student`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ idType })
    });
    return handleResponse(res);
  },

  // Products CRUD
  async getProducts({ category = '', search = '', college = '', userLat = null, userLng = null } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (college && college !== 'All Campuses') params.append('college', college);
    if (userLat && userLng) {
      params.append('userLat', userLat);
      params.append('userLng', userLng);
    }
    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    return handleResponse(res);
  },

  async getNearbyProducts({ lat, lng, radius, category } = {}) {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    if (radius) params.append('radius', radius);
    if (category && category !== 'All') params.append('category', category);
    const res = await fetch(`${API_BASE}/products/nearby?${params.toString()}`);
    return handleResponse(res);
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  async createProduct(data) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Bookings
  async createBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getMyRentals() {
    const res = await fetch(`${API_BASE}/bookings/my-rentals`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getMyListings() {
    const res = await fetch(`${API_BASE}/bookings/my-listings`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async confirmPickup(id, code) {
    const res = await fetch(`${API_BASE}/bookings/${id}/pickup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code })
    });
    return handleResponse(res);
  },

  async confirmReturn(id, code) {
    const res = await fetch(`${API_BASE}/bookings/${id}/return`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code })
    });
    return handleResponse(res);
  },

  // Social & Wishlist
  async getWishlist() {
    const res = await fetch(`${API_BASE}/wishlist`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async toggleWishlist(productId) {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId })
    });
    return handleResponse(res);
  },

  async getMessages(peerId) {
    const query = peerId ? `?peerId=${encodeURIComponent(peerId)}` : '';
    const res = await fetch(`${API_BASE}/messages${query}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async sendMessage(recipientId, text) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ recipientId, text })
    });
    return handleResponse(res);
  },

  // AI Features
  async analyzeListing(data) {
    const res = await fetch(`${API_BASE}/ai/analyze-listing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getRecommendations(type = 'forYou') {
    const res = await fetch(`${API_BASE}/ai/recommendations?type=${type}`);
    return handleResponse(res);
  },

  async parseSearch(query) {
    const res = await fetch(`${API_BASE}/ai/parse-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return handleResponse(res);
  },

  async getBundles() {
    const res = await fetch(`${API_BASE}/ai/bundles`);
    return handleResponse(res);
  },

  // Requests Marketplace
  async getRequests() {
    const res = await fetch(`${API_BASE}/requests`);
    return handleResponse(res);
  },

  async createRequest(data) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async submitOffer(requestId, data) {
    const res = await fetch(`${API_BASE}/requests/${requestId}/offer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getMyRequests() {
    const res = await fetch(`${API_BASE}/requests/my-requests`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getAdminReports() {
    const res = await fetch(`${API_BASE}/admin/reports`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: getAuthHeaders() });
    return handleResponse(res);
  }
};
