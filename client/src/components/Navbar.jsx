import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.jsx';
import { toggleSidebar } from '../store/viewSlice.js';
import { logout } from '../store/authSlice.js';
import { Menu, Bot, School, LogOut, CheckCircle2, Home } from 'lucide-react';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const alert = useSelector((state) => state.agents.agentExecutionAlert);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-5 sm:px-8 py-3.5 transition-colors duration-200">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 md:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/app" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  School<span className="text-indigo-600 dark:text-indigo-400">OS</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-zinc-500 hidden sm:block">
                All-in-One School Operating System
              </p>
            </div>
          </Link>

          {/* Quick link to Landing Page / User Flow */}
          <Link
            to="/"
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800 transition ml-2"
          >
            <Home className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tour & Guide</span>
          </Link>
        </div>

        {/* Center: Live notification when an assistant runs */}
        {alert && (
          <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-full text-xs text-emerald-800 dark:text-emerald-300 shadow-sm animate-pulse">
            <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">{alert.agent}:</span>
            <span className="truncate max-w-xs">{alert.message}</span>
            <span className="text-[10px] text-emerald-600 font-mono">({alert.latency_ms}ms)</span>
          </div>
        )}

        {/* Right: Theme Toggle & User profile */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-zinc-800">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700/80 flex items-center justify-center font-bold text-xs text-indigo-700 dark:text-indigo-300 uppercase shadow-sm">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.full_name}
                </p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold">
                    {user.role || user.active_roles?.[0] || 'User'}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
