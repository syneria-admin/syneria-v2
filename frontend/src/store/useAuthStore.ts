import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) => {
    localStorage.setItem('syneria_token', token);
    localStorage.setItem('syneria_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('syneria_token');
    localStorage.removeItem('syneria_user');
    set({ token: null, user: null });
  },
  initialize: () => {
    const token = localStorage.getItem('syneria_token');
    const userStr = localStorage.getItem('syneria_user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  }
}));
