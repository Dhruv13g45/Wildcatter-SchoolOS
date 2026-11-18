import React, { useState, useEffect } from 'react';
import api from '../api/client.js';
import {
  Bus,
  MapPin,
  Bell,
  Phone,
  Navigation,
  PlusCircle,
  Clock,
} from 'lucide-react';

export const BusTelemetry = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAlert, setLastAlert] = useState(null);

  // New bus form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBusId, setNewBusId] = useState('BUS-21');
  const [newRouteName, setNewRouteName] = useState('Route 21: Green Park -> School Campus');
  const [newDriverName, setNewDriverName] = useState('Suresh Kumar');
  const [newDriverPhone, setNewDriverPhone] = useState('+91 98112 34567');
  const [newNextStop, setNewNextStop] = useState('South City Mall Junction');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await api.get('/telemetry/buses');
      const list = res.data.buses || [];
      setBuses(list);
      if (list.length > 0 && !selectedBusId) {
        setSelectedBusId(list[0].bus_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterBus = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/telemetry/buses', {
        bus_id: newBusId.trim(),
        route_name: newRouteName.trim(),
        driver_name: newDriverName.trim(),
        driver_phone: newDriverPhone.trim(),
        next_stop: newNextStop.trim(),
      });

      setShowAddForm(false);
      fetchBuses();
      setSelectedBusId(res.data.bus.bus_id);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePushTelemetry = async () => {
    setLoading(true);
    setLastAlert(null);

    try {
      const targetId = selectedBusId || 'BUS-01';
      const res = await api.post('/telemetry/buses/update', {
        busId: targetId,
        speedKmh: Math.floor(25 + Math.random() * 25),
      });

      if (res.data.alertMessage) {
        setLastAlert(res.data.alertMessage);
      }
      fetchBuses();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectedBus = buses.find((b) => b.bus_id === selectedBusId) || buses[0];

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Live School Bus Tracker
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Track school buses on the road, monitor traffic delays, and send automated arrival alerts to parents.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddForm ? 'Close' : 'Register New Bus Route'}</span>
          </button>

          <button
            onClick={handlePushTelemetry}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition disabled:opacity-50"
          >
            <Navigation className="w-4 h-4" />
            <span>{loading ? 'Updating GPS...' : 'Simulate GPS Movement'}</span>
          </button>
        </div>
      </div>

      {/* Arrival Alert Banner */}
      {lastAlert && (
        <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center space-x-3.5 shadow-sm">
          <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-bounce" />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Live Parent Notification Sent:</p>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5">{lastAlert}</p>
          </div>
        </div>
      )}

      {/* Register Bus Form */}
      {showAddForm && (
        <form
          onSubmit={handleRegisterBus}
          className="p-6 sm:p-8 rounded-3xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 backdrop-blur-md space-y-5"
        >
          <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">
            Register a New School Bus Route:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Bus Number / ID:</label>
              <input
                type="text"
                value={newBusId}
                onChange={(e) => setNewBusId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Route Description:</label>
              <input
                type="text"
                value={newRouteName}
                onChange={(e) => setNewRouteName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Driver Name:</label>
              <input
                type="text"
                value={newDriverName}
                onChange={(e) => setNewDriverName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Driver Phone:</label>
              <input
                type="text"
                value={newDriverPhone}
                onChange={(e) => setNewDriverPhone(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">Next Stop on Route:</label>
              <input
                type="text"
                value={newNextStop}
                onChange={(e) => setNewNextStop(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow transition"
            >
              Save Bus Route
            </button>
          </div>
        </form>
      )}

      {/* Bus Fleet Grid with Breathing Room */}
      {buses.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
          <Bus className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No School Buses Active Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Click "Register New Bus Route" to add a bus with its driver, or click "Simulate GPS Movement" to start the fleet tracker.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow transition"
          >
            Register First Bus
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Bus Fleet List */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              School Buses on Road ({buses.length}):
            </p>
            {buses.map((bus) => (
              <div
                key={bus.bus_id}
                onClick={() => setSelectedBusId(bus.bus_id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                  bus.bus_id === selectedBusId
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-md'
                    : 'bg-white dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">{bus.bus_id}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {bus.speed_kmh} km/h
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 font-medium">{bus.route_name}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Driver: <strong>{bus.driver_name}</strong></span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">Arriving in ~{bus.eta_minutes} mins</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right 2 Cols: Live Telemetry Gauges */}
          <div className="lg:col-span-2 space-y-6">
            {selectedBus && (
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>Live Status: {selectedBus.bus_id}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{selectedBus.route_name}</p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">{selectedBus.driver_phone}</span>
                  </div>
                </div>

                {/* Gauges Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-center">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">GPS Latitude</span>
                    <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">{selectedBus.latitude}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-center">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">GPS Longitude</span>
                    <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">{selectedBus.longitude}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-center">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Altitude (Elevation)</span>
                    <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{selectedBus.altitude_meters || 216.5} m</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-center">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Traffic Delay</span>
                    <p className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
                      +{selectedBus.traffic_delay_minutes} mins
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-center">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Parent Alerts</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {selectedBus.proximity_alert_sent ? 'Sent to Parents' : 'Monitoring'}
                    </p>
                  </div>
                </div>

                {/* Next Stop Proximity Feed */}
                <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-zinc-950 border border-blue-200/80 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-500">Next Stop Approaching:</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedBus.next_stop}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500">Estimated Arrival:</span>
                    <p className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      ~{selectedBus.eta_minutes} mins
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
