import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem("access_token", access_token);
          
          api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// ─── Named helper exports used by pages & components ──────────────────────────

export const getHalls = async (filters?: {
  location?: string;
  event_type?: string;
  min_capacity?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.location) params.set("location", filters.location);
  if (filters?.event_type) params.set("event_type", filters.event_type);
  if (filters?.min_capacity) params.set("min_capacity", filters.min_capacity);
  const response = await api.get(`/halls?${params.toString()}`);
  return response.data;
};

export const getHallById = async (id: string) => {
  const response = await api.get(`/halls/${id}`);
  return response.data;
};

export const sendMessage = async (message: string, sessionId: string) => {
  const response = await api.post("/chat", { message, session_id: sessionId });
  return response.data;
};
