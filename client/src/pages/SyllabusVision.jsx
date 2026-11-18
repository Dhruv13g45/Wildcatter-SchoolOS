import React, { useState } from 'react';
import api from '../api/client.js';
import {
  FileSearch,
  CheckCircle2,
  BookOpen,
  Camera,
  Sparkles,
} from 'lucide-react';

export const SyllabusVision = () => {
  const [board, setBoard] = useState('CBSE');
  const [subjectCode] = useState('PHY-042');
  const [blackboardText, setBlackboardText] = useState(
    'Faraday Law of Electromagnetic Induction: emf = -N (dPhi/dt). Lenz Law conservation of energy direction. Real-world transformer coil eddy currents.'
  );
  const [loading, setLoading] = useState(false);
  const [coverageResult, setCoverageResult] = useState(null);

  const handleAnalyzeSnapshot = async () => {
    setLoading(true);
    setCoverageResult(null);

    try {
      const res = await api.post('/agents/syllabus-coverage', {
        teacherId: 'TCH-PHY-01',
        teacherName: 'Prof. Rajesh Kulkarni',
        subjectCode,
        board,
        rawBlackboardText: blackboardText,
      });

      setCoverageResult(res.data.record);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Lesson & Syllabus Tracker
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Teachers can upload or type classroom chalkboard notes to automatically verify lesson pacing against official board curricula.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Chalkboard Snap Vision Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">Education Board:</label>
                <div className="flex bg-slate-100 dark:bg-zinc-950 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  {['CBSE', 'ICSE', 'IB'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBoard(b)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                        board === b
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-3 py-1.5 rounded-xl">
                Subject: Physics (Class 12)
              </span>
            </div>

            {/* Blackboard Simulated Canvas Area */}
            <div className="relative rounded-3xl border-2 border-slate-300 dark:border-zinc-700 bg-slate-900 dark:bg-zinc-950 p-6 shadow-inner text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                  <Camera className="w-4 h-4" />
                  <span>Classroom Chalkboard Notes</span>
                </span>
                <span className="text-xs text-slate-400">Physics Lab 102</span>
              </div>

              <textarea
                rows={4}
                value={blackboardText}
                onChange={(e) => setBlackboardText(e.target.value)}
                placeholder="Type or paste text recognized from teacher chalkboard photo..."
                className="w-full bg-transparent text-sm text-emerald-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAnalyzeSnapshot}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Checking Syllabus...' : 'Check Lesson Progress Against Syllabus'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Blueprint Alignment & Results */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Curriculum Pacing Report</span>
            </h3>

            {coverageResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <span>Pacing Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    {coverageResult.coverage_status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                    <span>Syllabus Drift:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {coverageResult.pacing_drift_percentage > 0 ? '+' : ''}
                      {coverageResult.pacing_drift_percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                    <span>Standard:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{board} Board Core</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Matched Textbook Chapters:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300">
                    {coverageResult.matched_curriculum_chapters?.map((chap, i) => (
                      <li key={i} className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-medium">{chap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400 dark:text-zinc-500 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-zinc-600" />
                <p>Click "Check Lesson Progress" to compare chalkboard notes with the syllabus</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
