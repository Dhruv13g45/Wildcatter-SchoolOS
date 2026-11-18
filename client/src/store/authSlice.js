import { createSlice } from '@reduxjs/toolkit';

const getSavedUser = () => {
  const saved = localStorage.getItem('schoolos_user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return null;
};

const savedToken = localStorage.getItem('schoolos_token');

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getSavedUser(),
    token: savedToken || null,
    isAuthenticated: Boolean(savedToken && getSavedUser()),
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.person;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('schoolos_token', action.payload.token);
      localStorage.setItem('schoolos_user', JSON.stringify(action.payload.person));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('schoolos_token');
      localStorage.removeItem('schoolos_user');
    },
    switchRole: (state, action) => {
      if (state.user) {
        state.user.active_roles = [action.payload];
        state.user.role = action.payload;
        localStorage.setItem('schoolos_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, switchRole } = authSlice.actions;
export default authSlice.reducer;
