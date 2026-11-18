import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StatCard } from '../components/StatCard.jsx';
import { AgentStatusBadge } from '../components/AgentStatusBadge.jsx';
import api from '../api/client.js';
import {
  Users,
  CreditCard,
  CalendarCheck,
  Bus,
  Bot,
  Zap,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [agents, setAgents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [counts, setCounts] = useState({
    persons: 0,
    invoices: 0,
    slots: 0,
    buses: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [agentRes, userRes, invRes, timeRes, busRes] = await Promise.allSettled([
        api.get('/agents/matrix'),
        api.get('/auth/users'),
        api.get('/finance/invoices'),
        api.get('/timetable/slots'),
        api.get('/telemetry/buses'),
      ]);

      if (agentRes.status === 'fulfilled') {
        setAgents(agentRes.value.data.matrix || []);
        setLogs(agentRes.value.data.recent_audit_logs || []);
      }
      setCounts({
        persons: userRes.status === 'fulfilled' ? userRes.value.data.count : 0,
        invoices: invRes.status === 'fulfilled' ? invRes.value.data.count : 0,
        slots: timeRes.status === 'fulfilled' ? timeRes.value.data.count : 0,
        buses: busRes.status === 'fulfilled' ? busRes.value.data.count : 0,
      });
    } catch (e) {
      console.warn('API fetch fallback, rendering initial state');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Generous Breathing Room */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-slate-950 text-white p-8 sm:p-10 border border-indigo-500/20 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live System Ready</span>
              </span>
              <span className="text-xs text-indigo-200">
                Welcome back, <strong>{user?.full_name || 'Administrator'}</strong> ({user?.role || 'Admin'})
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              SchoolOS Command Center
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your school's automated operating workspace. Parents can apply on WhatsApp, teachers get instant class substitutes when sick, fees split automatically, and buses send live arrival alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/app/whatsapp"
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Admissions</span>
            </Link>

            <Link
              to="/app/agents"
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/20"
            >
              <Bot className="w-4 h-4" />
              <span>Meet the 6 AI Helpers</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid - Clear and User Friendly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Students & Staff"
          value={counts.persons.toString()}
          change={counts.persons === 0 ? 'Create an account to start' : 'Active School Members'}
          icon={Users}
          accent="indigo"
        />
        <StatCard
          title="Tuition Invoices"
          value={counts.invoices.toString()}
          change={counts.invoices === 0 ? 'Create via Fee Payments' : 'Ready for Split Payment'}
          icon={CreditCard}
          accent="emerald"
        />
        <StatCard
          title="Timetable Periods"
          value={counts.slots.toString()}
          change={counts.slots === 0 ? 'Add in Timetables' : 'Auto-Substitution Ready'}
          icon={CalendarCheck}
          accent="amber"
        />
        <StatCard
          title="Buses on Route"
          value={counts.buses.toString()}
          change={counts.buses === 0 ? 'Add in Bus Tracker' : 'Live GPS Updates'}
          icon={Bus}
          accent="blue"
        />
      </div>

      {/* Two Column Layout: Smart AI Assistants & Recent Automated Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: 6 AI Assistant Cards */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                6 Smart AI School Assistants
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Ready 24/7
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{agent.category}</p>
                  </div>
                  <AgentStatusBadge status={agent.status} />
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                  {agent.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-zinc-500 font-medium">Speed: {agent.sla}</span>
                  <Link
                    to="/app/agents"
                    className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    <span>Test Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Automated Actions Feed */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Automated Actions
              </h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Live Feed
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 space-y-3 max-h-[480px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-center py-14 space-y-3">
                <Bot className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  No automated actions yet
                </p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Send a WhatsApp admission, create an invoice, or simulate a teacher's leave to see live automated actions appear here.
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.log_id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-950/80 space-y-2 hover:border-slate-200 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{log.agent_name}</span>
                    <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 leading-snug">{log.action_taken}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="truncate max-w-[160px]">{log.trigger_source}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      {log.execution_latency_ms}ms
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
