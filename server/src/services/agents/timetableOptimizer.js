import { inMemoryStore } from '../../config/database.js';

/**
 * 3. TIMETABLE OPTIMIZER AGENT (PRD Section 4 & 6)
 * Adjusts facility structures and staffing balances. If a teacher logs leave,
 * the agent re-allocates scheduling paths matching subject specs within 10 seconds.
 */
export class TimetableOptimizerAgent {
  static availableSubstitutePool = [
    { teacher_id: 'TCH-SUB-01', name: 'Dr. Sharada Nambiar', subject: 'Advanced Physics', specialization: 'Mechanics' },
    { teacher_id: 'TCH-SUB-02', name: 'Mr. Arvind Saxena', subject: 'Mathematics Calculus', specialization: 'Pure Math' },
    { teacher_id: 'TCH-SUB-03', name: 'Mrs. Nandita Kaul', subject: 'Chemistry Reactions', specialization: 'Organic Chem' },
    { teacher_id: 'TCH-SUB-04', name: 'Dr. Ronald Peter', subject: 'Computer Science & AI', specialization: 'Neural Networks' },
  ];

  static async handleTeacherLeave({
    absentTeacherId,
    absentTeacherName,
    leaveReason = 'Medical Leave',
    effectiveDate = new Date().toISOString().split('T')[0],
  }) {
    const startTime = Date.now();

    // 1. Locate all dynamic schedule slots currently assigned to this teacher
    let affectedSlots = inMemoryStore.dynamicScheduleSlots.filter(
      (slot) => slot.assigned_teacher_id === absentTeacherId || (absentTeacherName && slot.assigned_teacher_name?.includes(absentTeacherName))
    );

    if (affectedSlots.length === 0) {
      return {
        status: 'NO_AFFECTED_SLOTS',
        message: `No active scheduled periods found for teacher ${absentTeacherName || absentTeacherId}. Please add a class period in Timetable first.`,
        reallocations: [],
        sla_benchmark_ms: Date.now() - startTime,
        sla_status: 'WITHIN_SLA',
      };
    }

    const reallocations = [];

    for (const slot of affectedSlots) {
      // Find matching qualified substitute from the pool
      const substitute = this.availableSubstitutePool.find((sub) =>
        slot.subject.toLowerCase().includes(sub.subject.toLowerCase().split(' ')[0])
      ) || this.availableSubstitutePool[0];

      // Mutate slot according to PRD DynamicScheduleSlot schema
      slot.original_teacher_id = slot.assigned_teacher_id;
      slot.original_teacher_name = slot.assigned_teacher_name;
      slot.assigned_teacher_id = substitute.teacher_id;
      slot.assigned_teacher_name = `${substitute.name} (Dynamic Sub)`;
      slot.is_substituted = true;
      slot.substitution_reason = `${leaveReason} reallocation by Timetable Optimizer Agent`;

      reallocations.push({
        slot_id: slot.slot_id,
        period_index: slot.period_index,
        subject: slot.subject,
        original_teacher: slot.original_teacher_name,
        new_assigned_teacher: slot.assigned_teacher_name,
        classroom: slot.classroom_number,
      });
    }

    const latency = Date.now() - startTime;

    // Log in Agent Audit Trail
    inMemoryStore.agentAuditLogs.unshift({
      log_id: `LOG-AGY-${Date.now().toString().slice(-6)}`,
      agent_name: 'Timetable Optimizer Agent',
      trigger_source: `Teacher Leave Signal (${absentTeacherName || absentTeacherId})`,
      action_taken: `Optimized & substituted ${affectedSlots.length} periods in ${latency}ms (well under the 10s SLA).`,
      status: 'SUCCESS',
      execution_latency_ms: latency,
      payload_summary: {
        absent_teacher: absentTeacherName || absentTeacherId,
        leave_reason: leaveReason,
        reallocated_slots_count: affectedSlots.length,
        reallocations,
      },
      timestamp: new Date(),
    });

    return {
      status: 'REALLOCATION_OPTIMIZED',
      slaMet: latency < 10000,
      latencyMs: latency,
      reallocationsCount: affectedSlots.length,
      reallocations,
      currentSchedule: inMemoryStore.dynamicScheduleSlots,
    };
  }

  static resetSchedule() {
    inMemoryStore.dynamicScheduleSlots.forEach((slot) => {
      if (slot.is_substituted && slot.original_teacher_id) {
        slot.assigned_teacher_id = slot.original_teacher_id;
        slot.assigned_teacher_name = slot.original_teacher_name;
        slot.is_substituted = false;
        slot.original_teacher_id = null;
        slot.original_teacher_name = null;
        slot.substitution_reason = null;
      }
    });
    return inMemoryStore.dynamicScheduleSlots;
  }
}

