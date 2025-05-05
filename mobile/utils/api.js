import axios from 'axios';

// Base URL for API
const API_URL = 'http://10.0.2.2:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Authentication APIs
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/register', { username, email, password });
  return response.data;
};

// Image Upload API
export const uploadImage = async (imageUri, token) => {
  // Create form data
  const formData = new FormData();
  
  // Get filename from URI
  const filename = imageUri.split('/').pop();
  
  // Infer the type of the image
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';
  
  formData.append('file', {
    uri: imageUri,
    name: filename,
    type,
  });

  // Upload image
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get history
export const getHistory = async (token) => {
  const response = await api.get('/history', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.data;
};

// Admin APIs
export const getUsers = async (token) => {
  const response = await api.get('/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const getAdminImages = async (token) => {
  const response = await api.get('/admin/images', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export default api;
