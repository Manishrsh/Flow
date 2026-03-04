import { Router } from 'express';
import authRoutes from './authRoutes';
import contactRoutes from './contactRoutes';
import campaignRoutes from './campaignRoutes';
import messageRoutes from './messageRoutes';
import conversationRoutes from './conversationRoutes';
import botRoutes from './botRoutes';
import templateRoutes from './templateRoutes';
import dashboardRoutes from './dashboardRoutes';
import webhookRoutes from './webhookRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/messages', messageRoutes);
router.use('/conversations', conversationRoutes);
router.use('/bots', botRoutes);
router.use('/templates', templateRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
