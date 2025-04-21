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
      sessionStorage.removeItem("authData"); // User data bhi hata diya
    },
    setAuthFromStorage: (state) => {
      const token = sessionStorage.getItem("token") || Cookies.get("token");
      const authData = sessionStorage.getItem("authData");

      if (token && authData) {
        try {
          const parsed = JSON.parse(authData);
          state.isAuthenticated = true;
          state.email = parsed.email || null;
          state.name = parsed.name || null;
          state.role = parsed.role || "candidate";
        } catch (err) {
          console.error("Auth parse error:", err);
          // Agar kuch galti ho jaaye parsing me, toh default me le aao
          state.isAuthenticated = false;
          state.email = null;
          state.name = null;
          state.role = "candidate";
        }
      } else {
        state.isAuthenticated = false;
        state.email = null;
        state.name = null;
        state.role = "candidate";
      }
    },
  },
});

export const { loginSuccess, logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
