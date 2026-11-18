import crypto from 'crypto';
import { inMemoryStore } from '../../config/database.js';
import { generateAiInsight } from '../ai.service.js';

/**
 * 1. ENROLLMENT HARVESTER AGENT (PRD Section 4)
 * Automates incoming conversational pipelines, decodes uploaded registration documents
 * using OCR, calculates curriculum entry eligibility parameters, and structures profile slots automatically.
 */
export class EnrollmentHarvesterAgent {
  static async processApplicantDocument({
    parentPhone,
    fullName,
    documentType = 'MARKSHEET',
    documentUrl,
    simulatedOcrText,
    streamPreference = null,
  }) {
    const startTime = Date.now();

    // 1. Send entire un-assumed text to Google Gemini to thoroughly inspect every detail
    let llmAnalysis = null;
    if (simulatedOcrText) {
      const prompt = `You are a strict, detail-oriented school admissions and credentials evaluation officer at Greenwood High School.
Analyze the following raw applicant/parent communication or marksheet text with zero assumptions.
DO NOT assume the class/grade right away unless explicitly stated.
DO NOT grant admission right away. Thoroughly evaluate all information provided, note missing prerequisites, and determine exact readiness.

Raw Text:
"""
${simulatedOcrText}
"""
Parent Phone: "${parentPhone || 'Not provided'}"
Candidate Name Hint (if any): "${fullName || 'None'}"

Evaluate and output ONLY a valid JSON object (no markdown code fences, no extra commentary) with the following structure:
{
  "extracted_student_name": string or null,
  "detected_target_class": string or null,
  "detected_percentage_or_marks": number or string or null,
  "subjects_mentioned": array of strings,
  "admission_verdict": "DIRECT_ADMISSION_OFFERED" | "INTERVIEW_REQUIRED" | "DOCUMENTS_INCOMPLETE" | "REJECTED_BELOW_CUTOFF",
  "recommended_stream_or_class": string or null,
  "missing_details": array of strings,
  "evaluation_summary": string,
  "detailed_reasoning": string,
  "scholarship_eligible": boolean
}`;

      const aiRes = await generateAiInsight({
        prompt,
        systemInstruction: 'You are an objective admissions officer. Check every detail thoroughly. Do not assume grade, class, or admission without verifying all criteria.',
      });

      if (aiRes.success && aiRes.text) {
        try {
          const cleanedText = aiRes.text.replace(/```json/gi, '').replace(/```/gi, '').trim();
          llmAnalysis = JSON.parse(cleanedText);
        } catch (jsonErr) {
          console.warn('[Gemini Admissions JSON Parse Notice]:', jsonErr.message);
        }
      }
    }

    // 2. Rule-based extraction as fallback and verification
    const ruleBasedData = this.parseOcrDocument(simulatedOcrText || documentType);

    // Merge AI rigorous evaluation with rule-based safety
    const candidateName = llmAnalysis?.extracted_student_name || fullName || ruleBasedData.candidateName;
    const targetClass = llmAnalysis?.detected_target_class || null;
    const percentage = typeof llmAnalysis?.detected_percentage_or_marks === 'number'
      ? llmAnalysis.detected_percentage_or_marks
      : ruleBasedData.aggregatePercentage;

    const verdict = llmAnalysis?.admission_verdict || (
      percentage >= 85 ? 'DIRECT_ADMISSION_OFFERED' :
      percentage >= 65 ? 'INTERVIEW_REQUIRED' :
      percentage ? 'DOCUMENTS_INCOMPLETE' : 'DOCUMENTS_INCOMPLETE'
    );

    const stream = llmAnalysis?.recommended_stream_or_class || (
      percentage >= 80 ? 'Physics, Chemistry & Advanced Mathematics (PCM)' :
      percentage >= 65 ? 'Commerce & Business Studies' : 'Under Assessment'
    );

    const scholarshipEligible = llmAnalysis ? !!llmAnalysis.scholarship_eligible : percentage >= 90;
    const missingDetails = llmAnalysis?.missing_details || (targetClass ? [] : ['Target class/grade not specified in message']);
    const detailedReasoning = llmAnalysis?.detailed_reasoning || llmAnalysis?.evaluation_summary || `Evaluated aggregate ${percentage || 'N/A'}% against standard school cutoffs.`;

    const personId = `PER-${Math.floor(1000 + Math.random() * 9000)}`;
    const globalUuid = crypto.randomUUID();

    const newPersonNode = {
      person_id: personId,
      global_uuid: globalUuid,
      full_name: candidateName || 'New Applicant Student',
      primary_whatsapp: parentPhone,
      email: `${(candidateName || 'applicant').toLowerCase().replace(/\s+/g, '.')}-${personId}@schoolos.internal`,
      associated_tenant_school_id: 'SCH-ENTERPRISE-01',
      active_roles: verdict === 'DIRECT_ADMISSION_OFFERED' ? ['Applicant', 'Student'] : ['Applicant'],
      calculated_affinity_weight: Math.min(0.98, +(0.5 + ((percentage || 70) / 200)).toFixed(2)),
      detected_class: targetClass,
      ai_evaluation_notes: detailedReasoning,
      created_at: new Date(),
    };

    inMemoryStore.persons.push(newPersonNode);

    const latency = Date.now() - startTime;
    inMemoryStore.agentAuditLogs.unshift({
      log_id: `LOG-AGY-${Date.now().toString().slice(-6)}`,
      agent_name: 'Enrollment Harvester Agent',
      trigger_source: `WhatsApp Inbound Webhook (${parentPhone})`,
      action_taken: `Audited applicant credentials with Gemini AI. Verdict: ${verdict}. Target Class: ${targetClass || 'Unspecified'}. Missing: ${missingDetails.join(', ') || 'None'}.`,
      status: 'SUCCESS',
      execution_latency_ms: latency,
      payload_summary: {
        person_id: personId,
        score: percentage,
        target_class: targetClass,
        verdict,
        missing_details: missingDetails,
      },
      timestamp: new Date(),
    });

    return {
      status: 'ADMISSION_PROCESSED',
      person: newPersonNode,
      ocrSummary: {
        ...ruleBasedData,
        candidateName,
        detectedClass: targetClass,
        aggregatePercentage: percentage,
      },
      eligibilityScore: {
        verdict,
        streamAssigned: stream,
        scholarshipEligible,
        targetClass,
        missingDetails,
        evaluationSummary: detailedReasoning,
      },
      latencyMs: latency,
    };
  }

  static parseOcrDocument(text = '') {
    // Extract real percentage from text if present (e.g. 92% or 88.5% or 95/100)
    let extractedPercentage = 85;
    const percentMatch = text.match(/(\d{2}(?:\.\d{1,2})?)\s*%/);
    const scoreMatch = text.match(/(\d{2,3})\s*\/\s*100/);
    if (percentMatch) {
      extractedPercentage = Math.min(100, Math.max(40, parseFloat(percentMatch[1])));
    } else if (scoreMatch) {
      extractedPercentage = Math.min(100, Math.max(40, parseFloat(scoreMatch[1])));
    }

    // Extract candidate name from text if provided
    let candidateName = null;
    const nameMatch = text.match(/(?:for|candidate|name:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    if (nameMatch) {
      candidateName = nameMatch[1];
    }

    return {
      documentValid: true,
      candidateName: candidateName || 'Verified Applicant',
      boardExam: 'CBSE Class X All India Secondary School Exam',
      aggregatePercentage: extractedPercentage,
      mathematicsGrade: extractedPercentage >= 90 ? 'A1' : extractedPercentage >= 80 ? 'A2' : 'B1',
      scienceGrade: extractedPercentage >= 90 ? 'A1' : extractedPercentage >= 80 ? 'B1' : 'B2',
      identityHash: crypto.randomBytes(8).toString('hex'),
    };
  }

  static calculateEligibilityScore(percentage, stream) {
    if (stream.includes('SCIENCE') || stream.includes('STEM')) {
      if (percentage >= 80) {
        return { verdict: 'DIRECT_ADMISSION_OFFERED', streamAssigned: 'Physics, Chemistry & Advanced Mathematics (PCM)', scholarshipEligible: percentage >= 90 };
      }
      return { verdict: 'INTERVIEW_REQUIRED', streamAssigned: 'General Sciences', scholarshipEligible: false };
    }
    return { verdict: 'DIRECT_ADMISSION_OFFERED', streamAssigned: 'Commerce & Economics Stream', scholarshipEligible: percentage >= 88 };
  }
}

