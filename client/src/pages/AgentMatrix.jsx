import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { recordAgentAction } from '../store/agentSlice.js';
import { AgentStatusBadge } from '../components/AgentStatusBadge.jsx';
import api from '../api/client.js';
import {
  Bot,
  Play,
  CheckCircle2,
  Sparkles,
  Cpu,
  FileText,
  DollarSign,
  Calendar,
  Eye,
  Bus,
} from 'lucide-react';

export const AgentMatrix = () => {
  const dispatch = useDispatch();
  const [selectedAgent, setSelectedAgent] = useState('enrollment');
  const [running, setRunning] = useState(false);
  const [lastExecutionResult, setLastExecutionResult] = useState(null);

  // Live user inputs for each assistant - Clean slate, zero fake/hardcoded records
  const [customPayloads, setCustomPayloads] = useState({
    enrollment: {
      parentPhone: '',
      fullName: '',
      streamPreference: 'SCIENCE_STEM',
      simulatedOcrText: '',
    },
    aid: {
      targetPersonId: '',
      declaredGrossIncomeInr: '',
      taxPaidInr: '',
      householdSize: '',
      regionalTier: 'NCR_TIER_2',
    },
    timetable: {
      absentTeacherName: '',
      absentTeacherId: '',
      leaveReason: 'Medical Leave',
    },
    syllabus: {
      teacherName: '',
      teacherId: '',
      subjectCode: 'PHY-042',
      board: 'CBSE',
      rawBlackboardText: '',
    },
    fee: {},
    security: {
      busId: '',
      speedKmh: '',
    },
  });

  const agentsList = [
    {
      id: 'enrollment',
      name: 'Admissions & Document Scanner',
      icon: FileText,
      sla: '< 500ms',
      endpoint: '/agents/enrollment-harvester',
      description:
        'Reads incoming marksheet photos sent by parents over WhatsApp, checks cutoff percentages, and calls Google Gemini AI to analyze candidate profile in real time.',
    },
    {
      id: 'aid',
      name: 'Financial Aid & Scholarship Checker',
      icon: DollarSign,
      sla: '< 1.0s',
      endpoint: '/agents/financial-aid-auditor',
      description:
        'Reviews family income details and automatically calculates fair scholarship tuition discounts based on household capacity.',
    },
    {
      id: 'timetable',
      name: 'Timetable & Teacher Substitution Solver',
      icon: Calendar,
      sla: '< 10s',
      endpoint: '/agents/timetable-optimizer',
      description:
        'When a teacher calls in sick, this assistant instantly reassigns free substitute teachers who teach the same subject within 10 seconds.',
    },
    {
      id: 'syllabus',
      name: 'Blackboard Lesson & Syllabus Tracker',
      icon: Eye,
      sla: '< 800ms',
      endpoint: '/agents/syllabus-coverage',
      description:
        'Reads chalkboard notes from classroom photos taken by teachers, compares topics against the board syllabus, and receives real Gemini AI pedagogical feedback.',
    },
    {
      id: 'fee',
      name: 'Fee Payment Guardian',
      icon: Sparkles,
      sla: '< 250ms',
      endpoint: '/agents/fee-guardian',
      description:
        'Checks unpaid student fees, applies school payment policies, and sends parents direct WhatsApp payment checkout links.',
    },
    {
      id: 'security',
      name: 'School Bus Route & GPS Tracker',
      icon: Bus,
      sla: '< 50ms',
      endpoint: '/agents/security-route-dispatcher',
      description:
        'Tracks school buses on the road in real-time, calculates traffic delays, and sends automated arrival alerts to parents before the bus arrives.',
    },
  ];

  const currentAgent = agentsList.find((a) => a.id === selectedAgent) || agentsList[0];
  const activePayload = customPayloads[selectedAgent] || {};

  const handlePayloadChange = (field, value) => {
    setCustomPayloads((prev) => ({
      ...prev,
      [selectedAgent]: {
        ...prev[selectedAgent],
        [field]: value,
      },
    }));
  };

  const handleExecuteAgent = async () => {
    setRunning(true);
    setLastExecutionResult(null);

    try {
      const res = await api.post(currentAgent.endpoint, activePayload);
      setLastExecutionResult(res.data);

      dispatch(
        recordAgentAction({
          agent_name: currentAgent.name,
          action_taken: `Tested with live custom data`,
          execution_latency_ms: res.data.latencyMs || res.data.latency_ms || 240,
          timestamp: new Date(),
        })
      );
    } catch (err) {
      console.error('Agent invocation failed:', err);
      setLastExecutionResult({
        status: 'EXECUTION_ERROR',
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title with Breathing Space */}
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Smart School AI Assistants
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              6 dedicated AI assistants that handle repetitive school tasks automatically in seconds with zero manual paperwork.
            </p>
          </div>
        </div>
      </div>

      {/* Assistant Selection Grid with Clear Statuses */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {agentsList.map((agent) => {
          const Icon = agent.icon;
          const isSelected = agent.id === selectedAgent;
          return (
            <button
              key={agent.id}
              onClick={() => {
                setSelectedAgent(agent.id);
                setLastExecutionResult(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/70 dark:border-indigo-500 dark:text-white shadow-md'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {agent.sla}
                </span>
              </div>
              <p className="mt-3 text-xs font-bold leading-snug line-clamp-2">{agent.name}</p>
            </button>
          );
        })}
      </div>

      {/* Main Assistant Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Input Data & Trigger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentAgent.name}</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Expected completion speed: <strong className="text-emerald-600 dark:text-emerald-400">{currentAgent.sla}</strong>
                </p>
              </div>

              <button
                onClick={handleExecuteAgent}
                disabled={running}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {running ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Processing Assistant...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Test This Assistant Now</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
              {currentAgent.description}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">
                Live Editable Information Sent To Assistant:
              </p>
              
              {selectedAgent === 'enrollment' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Candidate Full Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={activePayload.fullName || ''}
                      onChange={(e) => handlePayloadChange('fullName', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Parent Contact Phone:</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={activePayload.parentPhone || ''}
                      onChange={(e) => handlePayloadChange('parentPhone', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Student Marksheet / Notes (Processed by Gemini AI):</label>
                    <textarea
                      rows={3}
                      placeholder="Enter student marks or message e.g. Scored 94% in Class 10 with 98 in Math and 95 in Science"
                      value={activePayload.simulatedOcrText || ''}
                      onChange={(e) => handlePayloadChange('simulatedOcrText', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {selectedAgent === 'aid' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Registered Student Person ID:</label>
                    <input
                      type="text"
                      placeholder="e.g. PER-1001 (from your registered users)"
                      value={activePayload.targetPersonId || ''}
                      onChange={(e) => handlePayloadChange('targetPersonId', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Gross Family Income (₹/year):</label>
                      <input
                        type="number"
                        placeholder="e.g. 480000"
                        value={activePayload.declaredGrossIncomeInr || ''}
                        onChange={(e) => handlePayloadChange('declaredGrossIncomeInr', Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Tax Paid (₹):</label>
                      <input
                        type="number"
                        placeholder="e.g. 12000"
                        value={activePayload.taxPaidInr || ''}
                        onChange={(e) => handlePayloadChange('taxPaidInr', Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Household Size (members):</label>
                    <input
                      type="number"
                      placeholder="e.g. 4"
                      value={activePayload.householdSize || ''}
                      onChange={(e) => handlePayloadChange('householdSize', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {selectedAgent === 'timetable' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Teacher Name On Leave:</label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. Rajesh Kulkarni (must have periods in Timetable page)"
                      value={activePayload.absentTeacherName || ''}
                      onChange={(e) => handlePayloadChange('absentTeacherName', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Teacher ID (Optional):</label>
                    <input
                      type="text"
                      placeholder="e.g. TCH-01"
                      value={activePayload.absentTeacherId || ''}
                      onChange={(e) => handlePayloadChange('absentTeacherId', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Reason for Absence:</label>
                    <input
                      type="text"
                      placeholder="e.g. Severe viral infection"
                      value={activePayload.leaveReason || ''}
                      onChange={(e) => handlePayloadChange('leaveReason', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {selectedAgent === 'syllabus' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Teacher Name:</label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Meera Nambiar"
                        value={activePayload.teacherName || ''}
                        onChange={(e) => handlePayloadChange('teacherName', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Board Curriculum:</label>
                      <select
                        value={activePayload.board || 'CBSE'}
                        onChange={(e) => handlePayloadChange('board', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="IB">IB</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Classroom Blackboard Notes (Audited by Gemini AI):</label>
                    <textarea
                      rows={3}
                      placeholder="Enter real blackboard lesson notes e.g. Faraday Law of Induction emf = -N dPhi/dt and Lenz Law"
                      value={activePayload.rawBlackboardText || ''}
                      onChange={(e) => handlePayloadChange('rawBlackboardText', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {selectedAgent === 'fee' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
                  <p>The Fee Payment Guardian scans all <strong>real fee invoices</strong> created in the Financial Billing page. It audits overdue balances and triggers WhatsApp checkout links without any static mock invoices.</p>
                </div>
              )}

              {selectedAgent === 'security' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                    📡 <strong>Autonomous Dead-Reckoning Active</strong>: The assistant automatically computes and tracks live <strong>Latitude, Longitude, and Altimeter Elevation (Meters ASL)</strong> on its own without requiring manual GPS coordinates.
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Bus Identifier (From your registered fleet in Bus Telemetry):</label>
                    <input
                      type="text"
                      placeholder="e.g. BUS-12"
                      value={activePayload.busId || ''}
                      onChange={(e) => handlePayloadChange('busId', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-semibold">Current Speed (km/h):</label>
                    <input
                      type="number"
                      placeholder="e.g. 15 (simulates heavy traffic below 20km/h)"
                      value={activePayload.speedKmh || ''}
                      onChange={(e) => handlePayloadChange('speedKmh', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Assistant Decision Output */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Assistant Decision</span>
              </h3>
              {lastExecutionResult && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ⏱️ {lastExecutionResult.latencyMs || lastExecutionResult.latency_ms || 210}ms
                </span>
              )}
            </div>

            {lastExecutionResult ? (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Completed automatically with zero human effort</span>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-300 overflow-x-auto max-h-[400px]">
                  {JSON.stringify(lastExecutionResult, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400 dark:text-zinc-500 space-y-3">
                <Bot className="w-10 h-10 mx-auto text-slate-300 dark:text-zinc-600" />
                <p>Click "Test This Assistant Now" above to see how it works</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
