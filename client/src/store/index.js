import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import viewReducer from './viewSlice.js';
import agentReducer from './agentSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    view: viewReducer,
    agents: agentReducer,
  },
});

