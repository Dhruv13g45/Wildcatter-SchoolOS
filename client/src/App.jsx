import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { AgentMatrix } from './pages/AgentMatrix.jsx';
import { WhatsAppSimulator } from './pages/WhatsAppSimulator.jsx';
import { FinancialBilling } from './pages/FinancialBilling.jsx';
import { TimetableOptimizer } from './pages/TimetableOptimizer.jsx';
import { SyllabusVision } from './pages/SyllabusVision.jsx';
import { BusTelemetry } from './pages/BusTelemetry.jsx';
import { OntologyGraph } from './pages/OntologyGraph.jsx';

// Protected Desktop App Layout Wrapper
const AppLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-mono-white dark:bg-mono-black text-mono-black dark:text-mono-white transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="agents" element={<AgentMatrix />} />
            <Route path="whatsapp" element={<WhatsAppSimulator />} />
            <Route path="billing" element={<FinancialBilling />} />
            <Route path="timetable" element={<TimetableOptimizer />} />
            <Route path="syllabus" element={<SyllabusVision />} />
            <Route path="telemetry" element={<BusTelemetry />} />
            <Route path="ontology" element={<OntologyGraph />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      {/* Public Initial Landing Page & User Flow Guide */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Desktop Operating Workspace */}
      <Route path="/app/*" element={<AppLayout />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
