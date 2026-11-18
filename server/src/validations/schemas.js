import { z } from 'zod';

/**
 * Production Data Controller Schemas matching PRD Section 6 (Page 8)
 * and webhook/billing structures (Page 3 & 7)
 */

export const globalPersonStateSchema = z.object({
  person_id: z.string().min(1, 'Person ID is required'),
  global_uuid: z.string().uuid().optional(),
  full_name: z.string().min(2, 'Full name must have at least 2 characters'),
  whatsapp_number: z.string().min(10, 'Valid WhatsApp phone number required'),
  associated_tenant_school_id: z.string().default('SCH-ENTERPRISE-01'),
  active_roles: z.array(z.enum(['Prospect', 'Applicant', 'Student', 'Alumnus', 'Donor', 'Faculty', 'Admin'])),
  calculated_affinity_weight: z.number().min(0.0).max(1.0).default(0.50),
});

export const dynamicScheduleSlotSchema = z.object({
  slot_id: z.string().min(1),
  period_index: z.number().int().min(1).max(8),
  assigned_teacher_id: z.string().min(1),
  classroom_number: z.string().min(1),
  is_substituted: z.boolean().default(false),
  original_teacher_id: z.string().nullable().optional(),
  day_of_week: z.string().optional(),
  subject: z.string().optional(),
});

export const algorithmicFinancialAidAssessmentSchema = z.object({
  assessment_id: z.string().min(1),
  target_person_id: z.string().min(1),
  target_person_name: z.string().optional(),
  declared_gross_income_inr: z.number().nonnegative(),
  system_extracted_tax_paid_inr: z.number().nonnegative(),
  calculated_family_need_index: z.number().min(0.0).max(1.0),
  suggested_waiver_percentage: z.number().min(0.0).max(100.0).default(0.0),
  is_verified_by_agent: z.boolean().default(false),
});

export const whatsAppInboundPayloadSchema = z.object({
  message_id: z.string().min(1),
  parent_phone: z.string().min(6),
  message_type: z.enum(['text', 'document', 'image', 'audio', 'interactive']),
  text_body: z.string().nullable().optional(),
  attachment_url: z.string().nullable().optional(),
});

export const ledgerSplitItemSchema = z.object({
  merchant_account_id: z.string().min(1, 'Merchant account ID required'),
  amount_inr: z.number().positive('Amount must be positive'),
});

export const multiSplitFeeRequestSchema = z.object({
  student_id: z.string().min(1, 'Student ID required'),
  invoice_id: z.string().min(1, 'Invoice ID required'),
  total_amount_inr: z.number().positive('Total amount must be positive'),
  splits: z.array(ledgerSplitItemSchema).min(1, 'At least one split required'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  whatsapp_number: z.string().min(10),
  role: z.enum(['Prospect', 'Applicant', 'Student', 'Alumnus', 'Donor', 'Faculty', 'Admin']).default('Applicant'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const googleAuthSchema = z.object({
  credential: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  role: z.enum(['Admin', 'Faculty', 'Student', 'Applicant', 'Alumnus']).optional(),
});

