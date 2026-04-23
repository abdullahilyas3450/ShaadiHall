import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHalls = async (params = {}) => {
  const response = await api.get('/api/halls', { params });
  return response.data;
};

export const getHallById = async (id: string | number) => {
  const response = await api.get(`/api/halls/${id}`);
  return response.data;
};

export const sendMessage = async (message: string, sessionId?: string) => {
  const response = await api.post('/api/chat', { message, session_id: sessionId });
  return response.data;
};

export const checkAvailability = async (hallId: number, date: string) => {
  const response = await api.get('/api/bookings/availability', {
    params: { hall_id: hallId, date },
  });
  return response.data;
};

export default api;
