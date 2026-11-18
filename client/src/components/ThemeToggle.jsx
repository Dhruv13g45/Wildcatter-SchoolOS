import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/viewSlice.js';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.view.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className="p-2 rounded-xl border transition-all duration-200 border-mono-dark/40 dark:border-mono-dark bg-mono-100 dark:bg-mono-900 text-mono-dark dark:text-mono-light hover:text-mono-black dark:hover:text-mono-white hover:border-mono-mid"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-mono-light hover:text-mono-white transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-mono-dark hover:text-mono-black transition-colors" />
      )}
    </button>
  );
};

