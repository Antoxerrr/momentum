import { getAPI } from '@/core/api';
import { create } from 'zustand';
import {getAccessToken, purgeAccessToken, setAccessToken} from "@/core/local-storage.js";


export const useUserStore = create((set, get) => ({
  isAuthenticated: false,
  account: {},

  login: async (payload) => {
    const api = getAPI();
    const { data } = await api.users.login(payload);
    setAccessToken(data.token);
    set({ isAuthenticated: true })
    api.setAuthToken();
  },

  logout: () => {
    set({ isAuthenticated: false, account: {} })
    purgeAccessToken();
    getAPI().setAuthToken();
  },

  loadUserAccount: async () => {
    const { data } = await getAPI().users.me();
    set({ account: data });
  },

  checkAuthentication: () => {
    const token = getAccessToken();

    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false, account: {} });
    }
  },
}));