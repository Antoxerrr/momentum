import { create } from 'zustand';

import { getAPI } from '@/core/api';
import {
  getAccessToken,
  purgeAccessToken,
  setAccessToken,
} from '@/core/local-storage.js';

const DEFAULT_ACCOUNT_TTL_MS = 60000;

export const useUserStore = create((set, get) => ({
  isAuthenticated: false,
  account: {},
  accountFetchedAt: null,
  accountLoading: false,

  login: async (payload) => {
    const api = getAPI();
    const { data } = await api.users.login(payload);

    setAccessToken(data.token);
    set({ isAuthenticated: true });
    api.setAuthToken();
  },

  logout: () => {
    set({
      isAuthenticated: false,
      account: {},
      accountFetchedAt: null,
      accountLoading: false,
    });
    purgeAccessToken();
    getAPI().setAuthToken();
  },

  loadUserAccount: async ({ force = false, maxAgeMs = DEFAULT_ACCOUNT_TTL_MS } = {}) => {
    const token = getAccessToken();
    const { accountFetchedAt, accountLoading } = get();

    if (!token || accountLoading) {
      return;
    }

    if (!force && accountFetchedAt && Date.now() - accountFetchedAt < maxAgeMs) {
      return;
    }

    set({ accountLoading: true });

    try {
      const { data } = await getAPI().users.me();

      set({ account: data, accountFetchedAt: Date.now() });
    } finally {
      set({ accountLoading: false });
    }
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
