// authSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  name: string | null;
  role: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  name: null,
  role: "candidate",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.name = null;
      state.role = "candidate";
      Cookies.remove("token");
      sessionStorage.removeItem("token");
    },
    setAuthFromStorage: (state) => {
      const token = sessionStorage.getItem("token") || Cookies.get("token");

      if (token) {
        state.isAuthenticated = true;
        state.email = "user@example.com";
        state.name = "User Name";
        state.role = "candidate";
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const { loginSuccess, logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
