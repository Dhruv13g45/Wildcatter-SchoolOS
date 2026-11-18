import { Router } from 'express';
import authRoutes from './auth.routes.js';
import admissionsRoutes from './admissions.routes.js';
import agentsRoutes from './agents.routes.js';
import financeRoutes from './finance.routes.js';
import ontologyRoutes from './ontology.routes.js';
import timetableRoutes from './timetable.routes.js';
import telemetryRoutes from './telemetry.routes.js';

const router = Router();

// Base System Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    system: 'SchoolOS Enterprise OS Core',
    version: '2.0.0-PROD',
    architecture: 'AI-Native Autonomous Agent Matrix over PostgreSQL Drizzle Core',
    timestamp: new Date().toISOString(),
  });
});

// Mounted API v1 Modules
router.use('/auth', authRoutes);
router.use('/admissions', admissionsRoutes);
router.use('/agents', agentsRoutes);
router.use('/finance', financeRoutes);
router.use('/ontology', ontologyRoutes);
router.use('/timetable', timetableRoutes);
router.use('/telemetry', telemetryRoutes);

export default router;

