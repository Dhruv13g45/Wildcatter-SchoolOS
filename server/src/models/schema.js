import { pgTable, text, serial, integer, doublePrecision, boolean, timestamp, json } from 'drizzle-orm/pg-core';

/**
 * Structural Operational Ontology Schema (PRD Section 3 & 6)
 * "One Record" Design Philosophy - Every person maps to a single entity base node (:Person)
 * Polymorphic labels/roles: Prospect -> Applicant -> Student -> Alumnus -> Donor
 */
export const persons = pgTable('persons', {
  person_id: text('person_id').primaryKey(),
  global_uuid: text('global_uuid').notNull(),
  full_name: text('full_name').notNull(),
  primary_whatsapp: text('primary_whatsapp').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash'),
  associated_tenant_school_id: text('associated_tenant_school_id').default('SCH-ENTERPRISE-01'),
  active_roles: json('active_roles').$type().notNull(), // ['Prospect', 'Applicant', 'Student', 'Alumnus', 'Donor']
  calculated_affinity_weight: doublePrecision('calculated_affinity_weight').default(0.50),
  created_at: timestamp('created_at').defaultNow(),
});

export const campuses = pgTable('campuses', {
  campus_id: text('campus_id').primaryKey(),
  branch_name: text('branch_name').notNull(),
  geographic_zone: text('geographic_zone').notNull(),
  board_compliance: text('board_compliance').notNull(), // CBSE / ICSE / IB
  razorpay_route_sub_merchant_id: text('razorpay_route_sub_merchant_id').notNull(),
});

export const feeInvoices = pgTable('fee_invoices', {
  invoice_id: text('invoice_id').primaryKey(),
  student_id: text('student_id').notNull(),
  student_name: text('student_name').notNull(),
  gross_due_inr: doublePrecision('gross_due_inr').notNull(),
  due_date: text('due_date').notNull(),
  payment_status: text('payment_status').default('Unpaid'), // Unpaid / Settled
  razorpay_link_token: text('razorpay_link_token'),
  razorpay_order_id: text('razorpay_order_id'),
  splits_metadata: json('splits_metadata'),
  created_at: timestamp('created_at').defaultNow(),
});

export const examPapers = pgTable('exam_papers', {
  exam_id: text('exam_id').primaryKey(),
  subject_code: text('subject_code').notNull(),
  title: text('title').notNull(),
  cryptographic_seal_key: text('cryptographic_seal_key').notNull(),
  difficulty_distribution_ratio: text('difficulty_distribution_ratio').notNull(), // e.g. "30:50:20"
  is_published: boolean('is_published').default(false),
});

export const dynamicScheduleSlots = pgTable('dynamic_schedule_slots', {
  slot_id: text('slot_id').primaryKey(),
  period_index: integer('period_index').notNull(),
  day_of_week: text('day_of_week').notNull(),
  time_slot: text('time_slot').notNull(),
  subject: text('subject').notNull(),
  assigned_teacher_id: text('assigned_teacher_id').notNull(),
  assigned_teacher_name: text('assigned_teacher_name').notNull(),
  classroom_number: text('classroom_number').notNull(),
  is_substituted: boolean('is_substituted').default(false),
  original_teacher_id: text('original_teacher_id'),
  original_teacher_name: text('original_teacher_name'),
  substitution_reason: text('substitution_reason'),
});

export const algorithmicFinancialAidAssessments = pgTable('algorithmic_financial_aid_assessments', {
  assessment_id: text('assessment_id').primaryKey(),
  target_person_id: text('target_person_id').notNull(),
  target_person_name: text('target_person_name').notNull(),
  declared_gross_income_inr: doublePrecision('declared_gross_income_inr').notNull(),
  system_extracted_tax_paid_inr: doublePrecision('system_extracted_tax_paid_inr').notNull(),
  calculated_family_need_index: doublePrecision('calculated_family_need_index').notNull(), // 0.0 - 1.0
  suggested_waiver_percentage: doublePrecision('suggested_waiver_percentage').notNull(), // 0.0 - 100.0
  is_verified_by_agent: boolean('is_verified_by_agent').default(false),
  rationale: text('rationale'),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const busTelemetry = pgTable('bus_telemetry', {
  bus_id: text('bus_id').primaryKey(),
  route_name: text('route_name').notNull(),
  driver_name: text('driver_name').notNull(),
  driver_phone: text('driver_phone').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  altitude_meters: doublePrecision('altitude_meters').default(216.0),
  speed_kmh: doublePrecision('speed_kmh').notNull(),
  traffic_delay_minutes: integer('traffic_delay_minutes').default(0),
  proximity_alert_sent: boolean('proximity_alert_sent').default(false),
  current_stop: text('current_stop').notNull(),
  next_stop: text('next_stop').notNull(),
  eta_minutes: integer('eta_minutes').default(10),
  last_updated: timestamp('last_updated').defaultNow(),
});

export const syllabusCoverageRecords = pgTable('syllabus_coverage_records', {
  record_id: text('record_id').primaryKey(),
  teacher_id: text('teacher_id').notNull(),
  teacher_name: text('teacher_name').notNull(),
  subject_code: text('subject_code').notNull(),
  board: text('board').notNull(), // CBSE / ICSE / IB
  blackboard_image_url: text('blackboard_image_url'),
  ocr_extracted_text: text('ocr_extracted_text').notNull(),
  matched_curriculum_chapters: json('matched_curriculum_chapters'),
  pacing_drift_percentage: doublePrecision('pacing_drift_percentage').default(0.0), // -20% (lagging) to +10% (ahead)
  coverage_status: text('coverage_status').default('ON_TRACK'), // ON_TRACK / LAGGING / ACCELERATED
  timestamp: timestamp('timestamp').defaultNow(),
});

export const agentAuditLogs = pgTable('agent_audit_logs', {
  log_id: text('log_id').primaryKey(),
  agent_name: text('agent_name').notNull(),
  trigger_source: text('trigger_source').notNull(),
  action_taken: text('action_taken').notNull(),
  status: text('status').notNull(), // SUCCESS / RUNNING / FLAGGED
  execution_latency_ms: integer('execution_latency_ms').notNull(),
  payload_summary: json('payload_summary'),
  timestamp: timestamp('timestamp').defaultNow(),
});

