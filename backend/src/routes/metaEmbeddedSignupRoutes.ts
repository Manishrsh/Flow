import { Router } from 'express';
import { protect } from '../middleware/auth';
import * as metaEmbeddedSignupController from '../controllers/metaEmbeddedSignupController';

const router = Router();

router.use(protect);

// Get embedded signup configuration
router.get('/config', metaEmbeddedSignupController.getEmbeddedSignupConfig);

// Exchange authorization code for access token
router.post('/exchange-token', metaEmbeddedSignupController.exchangeCodeForToken);

// Complete embedded signup flow
router.post('/complete', metaEmbeddedSignupController.completeEmbeddedSignup);

// Get available phone numbers
router.post('/phone-numbers', metaEmbeddedSignupController.getAvailablePhoneNumbers);

// Subscribe webhook
router.post('/webhook/:accountId', metaEmbeddedSignupController.subscribeWebhook);

export default router;
