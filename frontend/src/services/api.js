// Base API configuration for Perfynix FastAPI backend using native fetch
const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = {
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || `HTTP Error ${response.status}: Failed to process security scan.`;
      throw new Error(message);
    }

    return await response.json();
  },

  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || `HTTP Error ${response.status}: Failed to fetch report.`;
      throw new Error(message);
    }

    return await response.json();
  },
};

export default apiClient;
