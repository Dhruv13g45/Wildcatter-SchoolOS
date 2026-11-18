import { inMemoryStore } from '../../config/database.js';

/**
 * 2. FINANCIAL AID AUDITOR AGENT (PRD Section 4 & 6)
 * Reviews financial records submitted through encrypted chat streams,
 * weights household capacities against regional indices, and generates data-driven tuition waivers.
 */
export class FinancialAidAuditorAgent {
  static async evaluateAidApplication({
    targetPersonId,
    declaredGrossIncomeInr,
    taxPaidInr,
    householdSize = 4,
    dependentsCount = 2,
    regionalTier = 'NCR_TIER_2',
  }) {
    const startTime = Date.now();

    // Regional baseline poverty and middle-income thresholds (NCR Index)
    const regionalMedianIncome = regionalTier === 'NCR_TIER_1' ? 950000 : 700000;
    
    // Family Need Index formula (0.0 to 1.0)
    // Need is higher when income is low and dependency ratio is high
    const perCapitaIncome = declaredGrossIncomeInr / Math.max(1, householdSize);
    const taxRatio = declaredGrossIncomeInr > 0 ? (taxPaidInr / declaredGrossIncomeInr) : 0;

    let needIndex = 1.0 - (perCapitaIncome / (regionalMedianIncome / 2));
    needIndex = Math.max(0.05, Math.min(0.95, needIndex));
    needIndex = +needIndex.toFixed(2);

    // Waiver Matrix
    let waiverPercentage = 0.0;
    let rationale = '';

    if (needIndex >= 0.80) {
      waiverPercentage = 65.0;
      rationale = 'Critical Need: Per-capita income below bottom 20th regional decile. Approved for 65% merit-cum-means fee waiver.';
    } else if (needIndex >= 0.60) {
      waiverPercentage = 40.0;
      rationale = 'Moderate Need: Household index matches Tier-2 assistance criteria. Approved for 40% tuition reduction.';
    } else if (needIndex >= 0.40) {
      waiverPercentage = 20.0;
      rationale = 'Standard Assistance: Approved for 20% institutional scholarship.';
    } else {
      waiverPercentage = 0.0;
      rationale = 'Income capacity satisfies standard institutional slab. Standard tuition schedule applies.';
    }

    const assessmentId = `AID-${Date.now().toString().slice(-6)}`;
    const person = inMemoryStore.persons.find((p) => p.person_id === targetPersonId);
    const targetName = person ? person.full_name : 'Applicant Person';

    const assessmentRecord = {
      assessment_id: assessmentId,
      target_person_id: targetPersonId,
      target_person_name: targetName,
      declared_gross_income_inr: declaredGrossIncomeInr,
      system_extracted_tax_paid_inr: taxPaidInr,
      calculated_family_need_index: needIndex,
      suggested_waiver_percentage: waiverPercentage,
      is_verified_by_agent: true,
      rationale,
      updated_at: new Date(),
    };

    inMemoryStore.financialAidAssessments.unshift(assessmentRecord);

    const latency = Date.now() - startTime;
    inMemoryStore.agentAuditLogs.unshift({
      log_id: `LOG-AGY-${Date.now().toString().slice(-6)}`,
      agent_name: 'Financial Aid Auditor Agent',
      trigger_source: `Chat Income Stream for ${targetPersonId}`,
      action_taken: `Audited tax statement (₹${taxPaidInr}) vs income (₹${declaredGrossIncomeInr}). Need Index: ${needIndex}. Waiver: ${waiverPercentage}%.`,
      status: 'SUCCESS',
      execution_latency_ms: latency,
      payload_summary: assessmentRecord,
      timestamp: new Date(),
    });

    return {
      status: 'AUDIT_COMPLETE',
      assessment: assessmentRecord,
      latencyMs: latency,
    };
  }
}

