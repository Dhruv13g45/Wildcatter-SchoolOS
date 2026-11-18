import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Meta WhatsApp Business API Cloud Webhook Signature Verification
 * Validates HMAC SHA-256 header (x-hub-signature-256) matching PRD Page 3
 */
export const verifyWhatsAppSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const webhookSecret = config.metaWebhookSecret;

  // For testing simulator convenience, allow explicit test bypass header
  if (req.headers['x-bypass-signature-for-demo'] === 'true') {
    return next();
  }

  if (!signature) {
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      detail: 'Invalid API Signature: Missing x-hub-signature-256 header',
    });
  }

  if (!signature.startsWith('sha256=')) {
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      detail: 'Invalid API Signature format: Expected sha256= prefix',
    });
  }

  const payload = req.rawBody || JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  const incomingHash = signature.replace('sha256=', '');

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(incomingHash, 'utf-8'),
      Buffer.from(expectedSignature, 'utf-8')
    );

    if (!isMatch) {
      return res.status(401).json({
        status: 'UNAUTHORIZED',
        detail: 'Invalid API Signature: Cryptographic hash mismatch',
      });
    }
  } catch (err) {
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      detail: 'Signature comparison failed',
    });
  }

  next();
};

