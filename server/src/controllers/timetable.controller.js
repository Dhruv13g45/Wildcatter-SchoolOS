import { inMemoryStore } from '../config/database.js';
import { TimetableOptimizerAgent } from '../services/agents/timetableOptimizer.js';

/**
 * Function-based Timetable Controller (PRD Section 4 & 6)
 */

export const getSchedule = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'SUCCESS',
      count: inMemoryStore.dynamicScheduleSlots.length,
      slots: inMemoryStore.dynamicScheduleSlots,
      available_substitutes: TimetableOptimizerAgent.availableSubstitutePool,
    });
  } catch (err) {
    next(err);
  }
};

export const createSlot = async (req, res, next) => {
  try {
    const { period_index, day_of_week = 'Monday', time_slot, subject, assigned_teacher_id, assigned_teacher_name, classroom_number } = req.body;

    const slot_id = `SLOT-P${period_index || inMemoryStore.dynamicScheduleSlots.length + 1}-${Date.now().toString().slice(-4)}`;

    const newSlot = {
      slot_id,
      period_index: Number(period_index) || inMemoryStore.dynamicScheduleSlots.length + 1,
      day_of_week,
      time_slot: time_slot || '09:00 AM - 10:00 AM',
      subject: subject || 'Science',
      assigned_teacher_id: assigned_teacher_id || 'TCH-001',
      assigned_teacher_name: assigned_teacher_name || 'Prof. Faculty Member',
      classroom_number: classroom_number || 'Room 101',
      is_substituted: false,
      original_teacher_id: null,
      original_teacher_name: null,
      substitution_reason: null,
    };

    inMemoryStore.dynamicScheduleSlots.push(newSlot);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Schedule slot added.',
      slot: newSlot,
    });
  } catch (err) {
    next(err);
  }
};

export const resetSchedule = async (req, res, next) => {
  try {
    const resetSlots = TimetableOptimizerAgent.resetSchedule();
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Timetable substitutions reverted to baseline master schedule.',
      slots: resetSlots,
    });
  } catch (err) {
    next(err);
  }
};
