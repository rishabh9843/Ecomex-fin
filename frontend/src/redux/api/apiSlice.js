import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// ✅ FIXED: Added credentials and token from localStorage
const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  credentials: 'include', // Send cookies
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state or localStorage
    const token = getState()?.auth?.userInfo?.token || 
                  JSON.parse(localStorage.getItem('userInfo') || '{}')?.token;
    
    // If token exists, add to Authorization header
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
