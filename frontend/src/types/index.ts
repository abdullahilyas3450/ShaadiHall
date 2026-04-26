export type UserRole = 'user' | 'admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Hall {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  location: string;
  price_per_hour: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

export interface Booking {
  id: string;
  user_id: string;
  hall_id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_price: number;
  notes: string | null;
  created_at: string;
  user?: User;
  hall?: Hall;
}

export interface BookingCreate {
  hall_id: string;
  title: string;
  start_time: string;
  end_time: string;
  notes?: string | null;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AdminStats {
  total_bookings: number;
  total_revenue: number;
  bookings_today: number;
  active_halls: number;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}
