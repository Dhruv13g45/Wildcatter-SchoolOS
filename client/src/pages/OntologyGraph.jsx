import React, { useState, useEffect } from 'react';
import api from '../api/client.js';
import {
  Network,
  User,
  Building,
  CreditCard,
  FileKey,
  ArrowRight,
  Sparkles,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';

export const OntologyGraph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  // New Campus form state
  const [showAddCampus, setShowAddCampus] = useState(false);
  const [branchName, setBranchName] = useState('Central Heritage Campus');
  const [geoZone, setGeoZone] = useState('North Region');
  const [boardCompliance, setBoardCompliance] = useState('CBSE');

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const res = await api.get('/ontology/graph');
      setGraphData(res.data);
      if (res.data.nodes?.length > 0 && !selectedNode) {
        setSelectedNode(res.data.nodes[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCampus = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ontology/campuses', {
        branch_name: branchName,
        geographic_zone: geoZone,
        board_compliance: boardCompliance,
      });

      setShowAddCampus(false);
      fetchGraph();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMutateRole = async (personId, newRole) => {
    setLoading(true);
    try {
      await api.post(`/ontology/persons/${personId}/mutate-role`, {
        new_role: newRole,
        affinity_weight_delta: 0.08,
      });
      fetchGraph();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getNodeIcon = (label) => {
    switch (label) {
      case ':Person':
        return User;
      case ':Campus':
        return Building;
      case ':FeeInvoice':
        return CreditCard;
      case ':ExamPaper':
        return FileKey;
      default:
        return Network;
    }
  };

  const getNodeColor = (label) => {
    switch (label) {
      case ':Person':
        return 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200';
      case ':Campus':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200';
      case ':FeeInvoice':
        return 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
      case ':ExamPaper':
        return 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200';
      default:
        return 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              School Directory & Records
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              One unified record for every person. Students, teachers, and alumni retain their history forever without duplicate database rows.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddCampus(!showAddCampus)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddCampus ? 'Close' : 'Add School Campus'}</span>
          </button>

          <button
            onClick={fetchGraph}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold border border-slate-200 dark:border-zinc-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Add Campus Form */}
      {showAddCampus && (
        <form
          onSubmit={handleAddCampus}
          className="p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 backdrop-blur-md space-y-5"
        >
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
            Register a School Branch or Campus:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Campus Name:</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Geographic Zone:</label>
              <input
                type="text"
                value={geoZone}
                onChange={(e) => setGeoZone(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Board Affiliation:</label>
              <select
                value={boardCompliance}
                onChange={(e) => setBoardCompliance(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="CBSE">CBSE (Central Board)</option>
                <option value="ICSE">ICSE (Council for ISC)</option>
                <option value="IB">IB (International Baccalaureate)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition"
            >
              Save Campus Node
            </button>
          </div>
        </form>
      )}

      {/* Main Graph Grid with Breathing Room */}
      {graphData.nodes?.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
          <Network className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">School Directory Initializing</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            As you register users, add campuses, or process admissions on WhatsApp, students and staff will appear here in real time.
          </p>
          <button
            onClick={() => setShowAddCampus(true)}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow"
          >
            Add First Campus
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Directory Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  School Members ({graphData.nodes?.length || 0} Profiles, {graphData.edges?.length || 0} Connected Relationships)
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Active Database Sync
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto">
                {graphData.nodes?.map((node) => {
                  const Icon = getNodeIcon(node.label);
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 shadow-md ring-2 ring-indigo-500/20'
                          : `${getNodeColor(node.label)} hover:border-slate-300 dark:hover:border-zinc-700`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 shadow-xs border border-slate-200 dark:border-zinc-700">
                          {node.label.replace(':', '')}
                        </span>
                        <Icon className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{node.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">{node.subLabel}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Selected Profile & Role Mutation */}
          <div className="space-y-6">
            {selectedNode ? (
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {selectedNode.label.replace(':', '')} Profile
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedNode.id}</span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedNode.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{selectedNode.subLabel}</p>
                </div>

                {/* Node properties */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 space-y-2 text-xs">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Profile Details:</p>
                  <pre className="text-xs font-mono text-slate-800 dark:text-zinc-300 overflow-x-auto">
                    {JSON.stringify(selectedNode.properties, null, 2)}
                  </pre>
                </div>

                {/* Role Transition if Person */}
                {selectedNode.label === ':Person' && (
                  <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                    <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Role Transition (Zero Duplicate Data)</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Add a new role to this member without creating a duplicate record:
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {['Faculty', 'Student', 'Alumnus', 'Donor'].map((role) => (
                        <button
                          key={role}
                          onClick={() => handleMutateRole(selectedNode.id, role)}
                          disabled={loading || selectedNode.properties?.roles?.includes(role)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>Make {role}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center py-24 text-xs text-slate-400">
                Click any profile from the left to view details and transition roles.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
