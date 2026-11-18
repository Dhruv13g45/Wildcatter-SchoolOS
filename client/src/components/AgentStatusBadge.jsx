import React from 'react';

export const AgentStatusBadge = ({ status = 'ACTIVE' }) => {
  const norm = (status || '').toUpperCase();
  const isInactive = norm.includes('INACTIVE') || norm.includes('OFFLINE') || norm.includes('ERROR') || norm.includes('STOPPED') || norm.includes('ABSENT');
  const isActive = !isInactive && (norm.includes('ACTIVE') || norm.includes('SUCCESS') || norm.includes('STREAMING') || norm.includes('READY') || norm.includes('STANDBY') || norm.includes('RUNNING') || norm.includes('ONLINE'));

  if (isInactive) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span className="font-semibold tracking-wide">Inactive</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="font-semibold tracking-wide">Active</span>
    </span>
  );
};
