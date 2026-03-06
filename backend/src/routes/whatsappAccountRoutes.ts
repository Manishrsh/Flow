import { Router } from 'express';
import { protect } from '../middleware/auth';
import * as whatsappAccountController from '../controllers/whatsappAccountController';

const router = Router();

router.use(protect);

// WhatsApp account management
router.get('/', whatsappAccountController.getWhatsAppAccounts);
router.get('/:id', whatsappAccountController.getWhatsAppAccount);
router.post('/', whatsappAccountController.addWhatsAppAccount);
router.put('/:id', whatsappAccountController.updateWhatsAppAccount);
router.delete('/:id', whatsappAccountController.deleteWhatsAppAccount);

// Account operations
router.post('/:id/sync', whatsappAccountController.syncWhatsAppAccount);
router.post('/:id/test', whatsappAccountController.testWhatsAppAccount);
router.get('/:id/stats', whatsappAccountController.getWhatsAppAccountStats);
router.get('/:id/webhook', whatsappAccountController.getWebhookConfig);

export default router;
