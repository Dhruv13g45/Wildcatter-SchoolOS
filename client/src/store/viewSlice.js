import { createSlice } from '@reduxjs/toolkit';

const initialTheme = (() => {
  const saved = localStorage.getItem('schoolos_theme');
  if (saved === 'light' || saved === 'dark') {
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return saved;
  }
  // Default to dark mode from palette
  document.documentElement.classList.add('dark');
  return 'dark';
})();

export const viewSlice = createSlice({
  name: 'view',
  initialState: {
    sidebarOpen: true,
    theme: initialTheme, // 'dark' or 'light'
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('schoolos_theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('schoolos_theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleSidebar, toggleTheme, setTheme } = viewSlice.actions;
export default viewSlice.reducer;
