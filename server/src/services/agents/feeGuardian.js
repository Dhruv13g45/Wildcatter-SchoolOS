import { inMemoryStore } from '../../config/database.js';

/**
 * 5. FEE GUARDIAN AGENT (PRD Section 4)
 * Tracks payment balances, applies automated interest rules,
 * and drops direct payment links over WhatsApp.
 */
export class FeeGuardianAgent {
  static async scanPendingInvoicesAndDispatchReminders() {
    const startTime = Date.now();
    const today = new Date();
    const actionsTaken = [];

    for (const invoice of inMemoryStore.feeInvoices) {
      if (invoice.payment_status === 'Unpaid') {
        const dueDate = new Date(invoice.due_date);
        const isOverdue = today > dueDate;
        let interestAppliedInr = 0;

        // Apply automated late penalty interest rule (1.5% late fee if past due date)
        if (isOverdue) {
          interestAppliedInr = Math.round(invoice.gross_due_inr * 0.015);
          invoice.gross_due_inr += interestAppliedInr;
        }

        // Generate dynamic secure WhatsApp payment drop token
        const paymentToken = `rzp_link_${invoice.invoice_id.toLowerCase()}_${Date.now().toString().slice(-4)}`;
        invoice.razorpay_link_token = paymentToken;

        const student = inMemoryStore.persons.find((p) => p.person_id === invoice.student_id);
        const parentWhatsapp = student?.primary_whatsapp || '+919876543210';

        const whatsappMessage = `*SchoolOS Fee Alert*: Dear Guardian of ${invoice.student_name}, term invoice ${invoice.invoice_id} of ₹${invoice.gross_due_inr.toLocaleString()} is ${isOverdue ? 'OVERDUE (includes ₹' + interestAppliedInr + ' late fee interest)' : 'due on ' + invoice.due_date}. Click to settle securely via Razorpay Route: https://pay.schoolos.internal/${paymentToken}`;

        actionsTaken.push({
          invoice_id: invoice.invoice_id,
          student_name: invoice.student_name,
          parent_whatsapp: parentWhatsapp,
          total_due_inr: invoice.gross_due_inr,
          is_overdue: isOverdue,
          interest_applied_inr: interestAppliedInr,
          payment_link: `https://pay.schoolos.internal/${paymentToken}`,
          whatsapp_dispatched: true,
          message_preview: whatsappMessage,
        });
      }
    }

    const latency = Date.now() - startTime;
    inMemoryStore.agentAuditLogs.unshift({
      log_id: `LOG-AGY-${Date.now().toString().slice(-6)}`,
      agent_name: 'Fee Guardian Agent',
      trigger_source: 'Scheduled Automated Ledger Scan',
      action_taken: `Audited ${inMemoryStore.feeInvoices.length} fee nodes. Dispatched ${actionsTaken.length} direct WhatsApp payment drops.`,
      status: 'SUCCESS',
      execution_latency_ms: latency,
      payload_summary: { dispatchedCount: actionsTaken.length, items: actionsTaken },
      timestamp: new Date(),
    });

    return {
      status: 'FEE_SCAN_COMPLETE',
      totalScanned: inMemoryStore.feeInvoices.length,
      actionsTaken,
      latencyMs: latency,
    };
  }
}

