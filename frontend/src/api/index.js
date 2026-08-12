// API Client Helpers for General Store Ledger App

async function apiFetch(endpoint, options = {}) {
  // Ensure we send cookies for session/JWT tracking
  options.credentials = 'include';
  options.headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(endpoint, options);
  
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }

  return data;
}

// Auth API Functions
export const authApi = {
  signup: async (username, email, password) => {
    return apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  },

  login: async (email, password) => {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  logout: async () => {
    return apiFetch('/api/auth/logout', {
      method: 'POST'
    });
  },

  getMe: async () => {
    return apiFetch('/api/auth/me');
  }
};

// Products API Functions
export const productsApi = {
  getProducts: async ({ category, search, limit = 12, skip = 0 } = {}) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('skip', skip);

    return apiFetch(`/api/products?${params.toString()}`);
  },

  getProduct: async (id) => {
    return apiFetch(`/api/products/${id}`);
  },

  getCategories: async () => {
    return apiFetch('/api/products/categories');
  }
};

// Orders API Functions
export const ordersApi = {
  placeOrder: async (items) => {
    return apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  },

  getOrders: async () => {
    return apiFetch('/api/orders');
  },

  getOrder: async (id) => {
    return apiFetch(`/api/orders/${id}`);
  }
};
