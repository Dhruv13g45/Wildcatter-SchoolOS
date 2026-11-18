import { RazorpayRouteService } from '../services/razorpay.service.js';
import { inMemoryStore } from '../config/database.js';

/**
 * Function-based Finance & Razorpay Route Controller (PRD Section 5 & 7)
 */

export const processFeeSplit = async (req, res, next) => {
  try {
    const { student_id, invoice_id, total_amount_inr, splits } = req.body;

    const settlementResult = await RazorpayRouteService.processFeeSplit({
      student_id,
      invoice_id,
      total_amount_inr,
      splits,
    });

    res.status(200).json(settlementResult);
  } catch (err) {
    next(err);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'SUCCESS',
      count: inMemoryStore.feeInvoices.length,
      invoices: inMemoryStore.feeInvoices,
      sub_merchant_accounts: inMemoryStore.campuses.map((c) => ({
        campus_id: c.campus_id,
        branch_name: c.branch_name,
        razorpay_route_sub_merchant_id: c.razorpay_route_sub_merchant_id,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { student_id, student_name, gross_due_inr, due_date } = req.body;

    const invoice_id = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const razorpay_link_token = `rzp_link_${invoice_id.toLowerCase()}_${Date.now().toString().slice(-4)}`;

    const newInvoice = {
      invoice_id,
      student_id: student_id || 'PER-STUDENT',
      student_name: student_name || 'Enrolled Student',
      gross_due_inr: Number(gross_due_inr) || 45000,
      due_date: due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      payment_status: 'Unpaid',
      razorpay_link_token,
      razorpay_order_id: null,
      splits_metadata: null,
      created_at: new Date(),
    };

    inMemoryStore.feeInvoices.unshift(newInvoice);

    inMemoryStore.agentAuditLogs.unshift({
      log_id: `LOG-INV-${Date.now().toString().slice(-6)}`,
      agent_name: 'Finance & Fee Engine',
      trigger_source: `Invoice Creation (${newInvoice.invoice_id})`,
      action_taken: `Created institutional fee invoice for ${newInvoice.student_name} (₹${newInvoice.gross_due_inr.toLocaleString()})`,
      status: 'SUCCESS',
      execution_latency_ms: 65,
      timestamp: new Date(),
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Invoice created in fee ledger.',
      invoice: newInvoice,
    });
  } catch (err) {
    next(err);
  }
};

export const settleInvoice = async (req, res, next) => {
  try {
    const { invoice_id } = req.params;
    const settled = await RazorpayRouteService.markInvoiceSettled(invoice_id);

    inMemoryStore.agentAuditLogs.unshift({
      log_id: `LOG-STL-${Date.now().toString().slice(-6)}`,
      agent_name: 'Razorpay Route Liquidator',
      trigger_source: `Checkout Settle (${invoice_id})`,
      action_taken: `Settled invoice ${invoice_id} with multi-split funds distribution`,
      status: 'SUCCESS',
      execution_latency_ms: 110,
      timestamp: new Date(),
    });

    res.status(200).json({
      status: 'SUCCESS',
      message: `Invoice ${invoice_id} settled via Razorpay Route.`,
      invoice: settled,
    });
  } catch (err) {
    next(err);
  }
};
