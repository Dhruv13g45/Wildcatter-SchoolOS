import React, { useState, useEffect } from 'react';
import api from '../api/client.js';
import {
  CalendarDays,
  UserX,
  RotateCcw,
  CheckCircle2,
  UserCheck,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const TimetableOptimizer = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastReallocation, setLastReallocation] = useState(null);

  // New slot form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [subject, setSubject] = useState('Physics');
  const [teacherName, setTeacherName] = useState('Prof. Rajesh Kulkarni');
  const [classroom, setClassroom] = useState('Science Lab B-102');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:00 AM');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await api.get('/timetable/slots');
      setSlots(res.data.slots || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/timetable/slots', {
        period_index: slots.length + 1,
        day_of_week: 'Monday',
        time_slot: timeSlot,
        subject,
        assigned_teacher_id: `TCH-${Math.floor(10 + Math.random() * 90)}`,
        assigned_teacher_name: teacherName,
        classroom_number: classroom,
      });

      setShowAddForm(false);
      fetchSchedule();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateLeave = async (slotTeacherId, slotTeacherName) => {
    setLoading(true);
    setLastReallocation(null);

    try {
      const res = await api.post('/agents/timetable-optimizer', {
        absentTeacherId: slotTeacherId || 'TCH-01',
        absentTeacherName: slotTeacherName || (slots[0]?.assigned_teacher_name || 'Prof. Rajesh Kulkarni'),
        leaveReason: 'Sudden Sick Leave',
      });

      setLastReallocation(res.data);
      fetchSchedule();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSchedule = async () => {
    try {
      await api.post('/timetable/reset');
      setLastReallocation(null);
      fetchSchedule();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Timetable & Teacher Substitutions
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              When a teacher calls in sick, the AI assistant reassigns free qualified teachers automatically within seconds.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddForm ? 'Close' : 'Add Class Period'}</span>
          </button>

          <button
            onClick={() => handleSimulateLeave(slots[0]?.assigned_teacher_id, slots[0]?.assigned_teacher_name)}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition disabled:opacity-50"
          >
            <UserX className="w-4 h-4" />
            <span>{loading ? 'Finding Replacement...' : 'Simulate Teacher Sick Leave'}</span>
          </button>

          {slots.some((s) => s.is_substituted) && (
            <button
              onClick={handleResetSchedule}
              title="Revert back to normal schedule"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-xs border border-slate-200 dark:border-zinc-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Slot Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSlot}
          className="p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 backdrop-blur-md space-y-5"
        >
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
            Add a Teaching Period to the Schedule:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Teacher Name:</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Time Slot:</label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Classroom:</label>
              <input
                type="text"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition"
            >
              Save Period
            </button>
          </div>
        </form>
      )}

      {/* Speed & SLA Banner */}
      {lastReallocation && (
        <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Teacher Substitution Complete!
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                Reallocated {lastReallocation.reallocationsCount} periods in{' '}
                <strong>{lastReallocation.latencyMs}ms</strong> (Guaranteed under 10 seconds).
              </p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white rounded-full shadow-sm">
            100% Solved
          </span>
        </div>
      )}

      {/* Schedule Slots Grid with Breathing Room */}
      {slots.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
          <CalendarDays className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Timetable Periods Configured Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Click "Add Class Period" to add real periods, or click "Simulate Teacher Sick Leave" to let the assistant auto-schedule a replacement.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition"
          >
            Add First Period
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.slot_id}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden space-y-4 ${
                slot.is_substituted
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-md'
                  : 'bg-white dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800 hover:shadow-md'
              }`}
            >
              {slot.is_substituted && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl shadow-sm">
                  Substituted Teacher
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Period {slot.period_index}</span>
                <span>{slot.time_slot}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{slot.subject}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{slot.classroom_number}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  {slot.is_substituted ? (
                    <UserCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  <span className={`font-semibold ${slot.is_substituted ? 'text-amber-800 dark:text-amber-300' : 'text-slate-800 dark:text-zinc-200'}`}>
                    {slot.assigned_teacher_name}
                  </span>
                </div>

                {slot.is_substituted && slot.original_teacher_name && (
                  <p className="text-[11px] text-slate-400 pl-6">
                    Absent: <span className="line-through text-rose-500">{slot.original_teacher_name}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
