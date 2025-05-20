import { createSlice } from '@reduxjs/toolkit'
import {getAccountData, purgeAccountData, setAccountData} from "@/core/local-storage.js";

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    username: null
  },
  reducers: {
    login(state, action) {
      const {username, access, refresh} = action.payload;
      state.username = username;
      state.isAuthenticated = true;
      setAccountData(username, access, refresh);
    },

    logout(state) {
      state.username = null;
      state.isAuthenticated = false;
      purgeAccountData();
    },

    checkAuthentication(state) {
      const accountData = getAccountData();
      if (accountData && accountData.username && accountData.accessToken && accountData.refreshToken) {
        state.username = accountData.username;
        state.isAuthenticated = true;
      } else {
        state.username = null;
        state.isAuthenticated = false;
      }
    }
  }
});

export const { login, logout, checkAuthentication } = userSlice.actions;

export default userSlice.reducer;
