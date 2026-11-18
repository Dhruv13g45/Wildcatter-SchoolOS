import { Router } from 'express';
import { getSchedule, createSlot, resetSchedule } from '../controllers/timetable.controller.js';

const router = Router();

router.get('/slots', getSchedule);
router.post('/slots', createSlot);
router.post('/reset', resetSchedule);

export default router;
