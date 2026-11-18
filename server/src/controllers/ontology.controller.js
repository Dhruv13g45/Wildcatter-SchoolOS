import crypto from 'crypto';
import { inMemoryStore } from '../config/database.js';

/**
 * Function-based Ontology Controller (PRD Section 1 & 3)
 * Unified Academic & Operational Knowledge Graph
 */

export const getKnowledgeGraph = async (req, res, next) => {
  try {
    const nodes = [
      ...inMemoryStore.persons.map((p) => ({
        id: p.person_id,
        label: ':Person',
        title: p.full_name,
        subLabel: (p.active_roles || []).join(' -> '),
        properties: {
          roles: p.active_roles,
          affinity_score: p.calculated_affinity_weight,
          email: p.email,
          whatsapp: p.primary_whatsapp,
        },
      })),
      ...inMemoryStore.campuses.map((c) => ({
        id: c.campus_id,
        label: ':Campus',
        title: c.branch_name,
        subLabel: `${c.board_compliance} | ${c.geographic_zone}`,
        properties: {
          board: c.board_compliance,
          merchant_id: c.razorpay_route_sub_merchant_id,
        },
      })),
      ...inMemoryStore.feeInvoices.map((f) => ({
        id: f.invoice_id,
        label: ':FeeInvoice',
        title: `₹${f.gross_due_inr.toLocaleString()} (${f.payment_status})`,
        subLabel: `Due: ${f.due_date}`,
        properties: {
          amount: f.gross_due_inr,
          status: f.payment_status,
        },
      })),
      ...inMemoryStore.examPapers.map((e) => ({
        id: e.exam_id,
        label: ':ExamPaper',
        title: `${e.subject_code}: ${e.title}`,
        subLabel: `Ratio: ${e.difficulty_distribution_ratio}`,
        properties: {
          seal: e.cryptographic_seal_key.slice(0, 16) + '...',
          published: e.is_published,
        },
      })),
    ];

    // Build relationship edges from real nodes
    const edges = [];
    const campusNode = inMemoryStore.campuses[0];

    inMemoryStore.persons.forEach((p) => {
      if (campusNode) {
        edges.push({
          source: p.person_id,
          target: campusNode.campus_id,
          relationship: p.active_roles.includes('Faculty') ? 'HEAD_FACULTY_AT' : 'ENROLLED_AT',
        });
      }
    });

    inMemoryStore.feeInvoices.forEach((inv) => {
      edges.push({
        source: inv.student_id,
        target: inv.invoice_id,
        relationship: 'OWES_LEDGER',
      });
    });

    res.status(200).json({
      status: 'SUCCESS',
      architecture_core: 'Unified Academic & Operational Knowledge Graph (PostgreSQL Drizzle Core)',
      nodes_count: nodes.length,
      edges_count: edges.length,
      nodes,
      edges,
    });
  } catch (err) {
    next(err);
  }
};

export const mutatePersonRole = async (req, res, next) => {
  try {
    const { person_id } = req.params;
    const { new_role, affinity_weight_delta = 0.05 } = req.body;

    const person = inMemoryStore.persons.find((p) => p.person_id === person_id);
    if (!person) {
      return res.status(404).json({ status: 'NOT_FOUND', message: 'Person node not found in Knowledge Graph.' });
    }

    if (!person.active_roles.includes(new_role)) {
      person.active_roles.push(new_role);
    }
    person.calculated_affinity_weight = Math.min(
      1.0,
      +(person.calculated_affinity_weight + affinity_weight_delta).toFixed(2)
    );

    inMemoryStore.agentAuditLogs.unshift({
      log_id: `LOG-MUT-${Date.now().toString().slice(-6)}`,
      agent_name: 'Polymorphic Ontology Mutator',
      trigger_source: `Lifecycle Transition (${person_id})`,
      action_taken: `Mutated :Person node ${person.full_name} (${person_id}) to add role :${new_role}`,
      status: 'SUCCESS',
      execution_latency_ms: 45,
      timestamp: new Date(),
    });

    res.status(200).json({
      status: 'MUTATION_COMMITTED',
      message: `Polymorphic state updated: Added role :${new_role}`,
      person,
    });
  } catch (err) {
    next(err);
  }
};

export const createCampus = async (req, res, next) => {
  try {
    const { branch_name, geographic_zone, board_compliance = 'CBSE', razorpay_route_sub_merchant_id } = req.body;

    const campus_id = `CAMPUS-${Date.now().toString().slice(-4)}`;
    const newCampus = {
      campus_id,
      branch_name: branch_name || 'Main Regional Campus',
      geographic_zone: geographic_zone || 'Central Zone',
      board_compliance,
      razorpay_route_sub_merchant_id: razorpay_route_sub_merchant_id || `acc_${crypto.randomBytes(6).toString('hex')}`,
    };

    inMemoryStore.campuses.push(newCampus);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Campus node added to Knowledge Graph.',
      campus: newCampus,
    });
  } catch (err) {
    next(err);
  }
};

export const createExamPaper = async (req, res, next) => {
  try {
    const { subject_code, title, difficulty_distribution_ratio = '30:50:20' } = req.body;

    const exam_id = `EXAM-${subject_code}-${Date.now().toString().slice(-4)}`;
    const cryptographic_seal_key = `SHA256:${crypto.createHash('sha256').update(exam_id + title + Date.now()).digest('hex')}`;

    const newExam = {
      exam_id,
      subject_code,
      title,
      cryptographic_seal_key,
      difficulty_distribution_ratio,
      is_published: false,
    };

    inMemoryStore.examPapers.push(newExam);

    res.status(201).json({
      status: 'EXAM_PAPER_SEALED',
      exam: newExam,
    });
  } catch (err) {
    next(err);
  }
};
