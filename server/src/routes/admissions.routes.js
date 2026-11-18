import { Router } from 'express';
import { handleWhatsAppWebhook, uploadRegistrationDocument, getApplicants, submitDirectApplication } from '../controllers/admissions.controller.js';
import { verifyWhatsAppSignature } from '../middlewares/signature.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Meta WhatsApp Webhook Gateway (PRD Section 2)
router.post('/whatsapp-webhook', verifyWhatsAppSignature, handleWhatsAppWebhook);

// Direct document ingestion with Multer (Birth Certificate / Marksheet)
router.post('/upload-document', upload.single('document'), uploadRegistrationDocument);

// Direct application submission
router.post('/apply', submitDirectApplication);

// Query admissions list
router.get('/applicants', getApplicants);

export default router;
