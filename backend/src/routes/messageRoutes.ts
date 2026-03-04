import { Router } from 'express';
import {
    getMessages,
    sendMessage,
    markAsRead
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/:conversationId', getMessages);
router.post('/', sendMessage);
router.post('/:conversationId/read', markAsRead);

export default router;
