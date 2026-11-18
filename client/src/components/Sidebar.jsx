import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  CreditCard,
  CalendarDays,
  FileSearch,
  Bus,
  Network,
  Sparkles,
  HelpCircle,
} from 'lucide-react';



export const Sidebar = () => {
  // Load saved width or default to 20% of viewport width
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved || '20%';
  });
  const sidebarRef = useRef(null);

  // Update localStorage whenever width changes
  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth);
  }, [sidebarWidth]);

  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarRef.current?.getBoundingClientRect().width || 0;
    const onMouseMove = (moveEvt) => {
      const delta = moveEvt.clientX - startX;
      const newWidthPx = startWidth + delta;
      const newWidthPercent = Math.max(10, Math.min(40, (newWidthPx / window.innerWidth) * 100));
      setSidebarWidth(`${newWidthPercent}%`);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const sidebarOpen = useSelector((state) => state.view.sidebarOpen);

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'AI Smart Assistants', path: '/app/agents', icon: Bot, badge: '6 Active' },
    { name: 'WhatsApp Admissions', path: '/app/whatsapp', icon: MessageSquare, badge: 'Live Chat' },
    { name: 'Fee Payments & Splits', path: '/app/billing', icon: CreditCard },
    { name: 'Timetable & Substitutions', path: '/app/timetable', icon: CalendarDays },
    { name: 'Lesson & Syllabus Tracker', path: '/app/syllabus', icon: FileSearch },
    { name: 'Live School Bus Tracker', path: '/app/telemetry', icon: Bus },
    { name: 'School Directory & Records', path: '/app/ontology', icon: Network },
  ];

  return (
    <aside
      ref={sidebarRef}
      style={{ width: sidebarWidth }}
      className={`fixed md:sticky top-[65px] left-0 z-30 h-[calc(100vh-65px)] bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col justify-between transition-all duration-200 relative ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-4 space-y-2 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-1.5 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Main Modules
          </p>
          <Link
            to="/"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
          </Link>
        </div>
        <div onMouseDown={startResize} className="absolute top-0 right-0 h-full w-1 cursor-ew-resize hover:bg-indigo-200 dark:hover:bg-indigo-800 opacity-0 hover:opacity-100" />

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-sm font-semibold border border-indigo-200/60 dark:border-indigo-800/60'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-zinc-900'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </div>
        <div onMouseDown={startResize} className="absolute top-0 right-0 h-full w-1 cursor-ew-resize hover:bg-indigo-200 dark:hover:bg-indigo-800 opacity-0 hover:opacity-100" />
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom informational helper with breathing room */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold">Connected School OS</span>
          </div>
        <div onMouseDown={startResize} className="absolute top-0 right-0 h-full w-1 cursor-ew-resize hover:bg-indigo-200 dark:hover:bg-indigo-800 opacity-0 hover:opacity-100" />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Everything connects automatically — from WhatsApp admissions to fee payments and bus tracking.
          </p>
        </div>
        <div onMouseDown={startResize} className="absolute top-0 right-0 h-full w-1 cursor-ew-resize hover:bg-indigo-200 dark:hover:bg-indigo-800 opacity-0 hover:opacity-100" />
      </div>
    </aside>
  );
};
