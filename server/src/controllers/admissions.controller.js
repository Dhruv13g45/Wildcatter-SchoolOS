import { EnrollmentHarvesterAgent } from '../services/agents/enrollmentHarvester.js';
import { inMemoryStore } from '../config/database.js';

/**
 * Function-based Admissions Controller (PRD Section 2)
 * Handles Meta WhatsApp Cloud Webhook, Multer Document Intake, and Real Applicant Processing
 */

export const handleWhatsAppWebhook = async (req, res, next) => {
  try {
    const payload = req.body;

    let msgData = null;
    if (payload.entry && payload.entry[0]?.changes && payload.entry[0]?.changes[0]?.value?.messages) {
      msgData = payload.entry[0].changes[0].value.messages[0];
    } else if (payload.message_id && payload.parent_phone) {
      msgData = {
        id: payload.message_id,
        from: payload.parent_phone,
        type: payload.message_type || 'text',
        text: { body: payload.text_body },
        document: payload.attachment_url ? { link: payload.attachment_url } : null,
      };
    }

    if (!msgData) {
      return res.status(200).json({ status: 'NO_MESSAGE' });
    }

    const structuredEvent = {
      message_id: msgData.id || `wamid_${Date.now()}`,
      parent_phone: msgData.from || '+919876543210',
      message_type: msgData.type || 'text',
      text_body: msgData.type === 'text' ? msgData.text?.body : null,
      attachment_url: msgData.type === 'document' ? msgData.document?.link : null,
    };

    // Asynchronously trigger Enrollment Harvester Agent
    const agentResult = await EnrollmentHarvesterAgent.processApplicantDocument({
      parentPhone: structuredEvent.parent_phone,
      fullName: structuredEvent.text_body
        ? structuredEvent.text_body.replace(/^(hi|hello|want to enroll|apply for)\s*/i, '').slice(0, 32).trim() || 'WhatsApp Applicant'
        : 'WhatsApp Applicant',
      documentType: structuredEvent.attachment_url ? 'PDF_APPLICATION_CERTIFICATE' : 'WHATSAPP_CONVERSATIONAL_INTAKE',
      documentUrl: structuredEvent.attachment_url,
      simulatedOcrText: structuredEvent.text_body,
    });

    return res.status(200).json({
      status: 'ENQUEUED',
      message_id: structuredEvent.message_id,
      agent_execution: {
        status: agentResult.status,
        person_id: agentResult.person.person_id,
        candidate_name: agentResult.person.full_name,
        target_class: agentResult.eligibilityScore.targetClass,
        eligibility: agentResult.eligibilityScore.verdict,
        stream: agentResult.eligibilityScore.streamAssigned,
        missing_details: agentResult.eligibilityScore.missingDetails,
        evaluation_summary: agentResult.eligibilityScore.evaluationSummary,
        latency_ms: agentResult.latencyMs,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const uploadRegistrationDocument = async (req, res, next) => {
  try {
    const file = req.file;
    const { fullName, parentPhone, streamPreference } = req.body;

    if (!file) {
      return res.status(400).json({ status: 'ERROR', message: 'Document file required via Multer upload.' });
    }

    const agentResult = await EnrollmentHarvesterAgent.processApplicantDocument({
      parentPhone: parentPhone || '+919988776655',
      fullName: fullName || file.originalname.split('.')[0],
      documentType: file.mimetype.includes('pdf') ? 'PDF_MARKSHEET' : 'IMAGE_CERTIFICATE',
      documentUrl: `/uploads/${file.filename}`,
      streamPreference: streamPreference || 'SCIENCE_STEM',
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Applicant document ingested and processed by Enrollment Harvester Agent.',
      file_path: `/uploads/${file.filename}`,
      agentResult,
    });
  } catch (err) {
    next(err);
  }
};

export const getApplicants = async (req, res, next) => {
  try {
    const applicants = inMemoryStore.persons.filter(
      (p) => p.active_roles.includes('Applicant') || p.active_roles.includes('Prospect')
    );

    res.status(200).json({
      status: 'SUCCESS',
      count: applicants.length,
      applicants,
    });
  } catch (err) {
    next(err);
  }
};

export const submitDirectApplication = async (req, res, next) => {
  try {
    const { fullName, parentPhone, streamPreference, marksheetPercentage = 85 } = req.body;

    const agentResult = await EnrollmentHarvesterAgent.processApplicantDocument({
      parentPhone,
      fullName,
      documentType: 'DIRECT_WEB_PORTAL_ADMISSION',
      simulatedOcrText: `Candidate ${fullName}, Aggregate: ${marksheetPercentage}%`,
      streamPreference,
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Direct application processed by Enrollment Harvester Agent.',
      agentResult,
    });
  } catch (err) {
    next(err);
  }
};
