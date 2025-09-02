import { createSlice } from '@reduxjs/toolkit'
import {
  getAccessToken,
  purgeAccessToken,
  setAccessToken,
} from "@/core/local-storage.js";
import { getAPI } from '@/core/api';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    account: {},
  },
  reducers: {
    login(state, action) {
      const {token} = action.payload;
      state.isAuthenticated = true;
      setAccessToken(token);
    },

    logout(state) {
      state.account = {};
      state.isAuthenticated = false;
      purgeAccessToken();
    },

    login(state, action) {
      const {token} = action.payload;
      state.isAuthenticated = true;
      setAccessToken(token);
    },

    setUserAccount(state, action) {
      state.account = action.payload;
    },

    checkAuthentication(state) {
      const token = getAccessToken();

      if (token) {
        state.isAuthenticated = true;
      } else {
        state.username = {};
        state.isAuthenticated = false;
      }
    }
  }
});


export function loadUserAccount() {
  return async function (dispatch) {
    const response = await getAPI().users.me();
    dispatch(userSlice.actions.setUserAccount(response.data));
  }
}

export const { login, logout, checkAuthentication } = userSlice.actions;

export default userSlice.reducer;
