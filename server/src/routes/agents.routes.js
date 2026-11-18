import { Router } from 'express';
import {
  getAgentMatrix,
  getAuditLogs,
  triggerEnrollmentHarvester,
  triggerFinancialAidAuditor,
  triggerTimetableOptimizer,
  triggerSyllabusCoverage,
  triggerFeeGuardian,
  triggerSecurityRouteDispatcher,
} from '../controllers/agents.controller.js';

const router = Router();

router.get('/matrix', getAgentMatrix);
router.get('/audit-logs', getAuditLogs);

router.post('/enrollment-harvester', triggerEnrollmentHarvester);
router.post('/financial-aid-auditor', triggerFinancialAidAuditor);
router.post('/timetable-optimizer', triggerTimetableOptimizer);
router.post('/syllabus-coverage', triggerSyllabusCoverage);
router.post('/fee-guardian', triggerFeeGuardian);
router.post('/security-route-dispatcher', triggerSecurityRouteDispatcher);

export default router;
