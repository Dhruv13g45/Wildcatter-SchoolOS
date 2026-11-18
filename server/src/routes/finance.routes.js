import { Router } from 'express';
import { processFeeSplit, getInvoices, createInvoice, settleInvoice } from '../controllers/finance.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { multiSplitFeeRequestSchema } from '../validations/schemas.js';

const router = Router();

// Razorpay Route Multi-Split Liquidation (PRD Section 5 & 7)
router.post('/process-fee-split', validate(multiSplitFeeRequestSchema), processFeeSplit);

// Ledger Invoices & Accounts
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);
router.post('/invoices/:invoice_id/settle', settleInvoice);

export default router;
