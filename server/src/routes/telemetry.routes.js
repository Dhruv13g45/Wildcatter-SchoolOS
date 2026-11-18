import { Router } from 'express';
import { getFleetTelemetry, registerBus, pushTelemetryUpdate } from '../controllers/telemetry.controller.js';

const router = Router();

router.get('/buses', getFleetTelemetry);
router.post('/buses', registerBus);
router.post('/buses/update', pushTelemetryUpdate);

export default router;
