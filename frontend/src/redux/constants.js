// src/constants.js or src/config/constants.js

// Base URL configuration
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const USERS_URL = `${BASE_URL}/api/users`;
export const CATEGORY_URL = `${BASE_URL}/api/category`;
export const PRODUCTS_URL = `${BASE_URL}/api/products`;
export const UPLOAD_URL = `${BASE_URL}/api/upload`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const PAYPAL_URL = `${BASE_URL}/api/config/paypal`;

// Log for debugging (remove in production)
console.log('API Base URL:', BASE_URL);
