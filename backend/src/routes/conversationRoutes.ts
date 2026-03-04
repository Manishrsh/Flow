import { Router } from 'express';
import {
    getConversations,
    getConversation,
    createConversation,
    updateConversation,
    assignConversation,
    closeConversation,
    getConversationStats
} from '../controllers/conversationController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
    .get(getConversations)
    .post(createConversation);

router.get('/stats', getConversationStats);

router.route('/:id')
    .get(getConversation)
    .put(updateConversation);

router.post('/:id/assign', assignConversation);
router.post('/:id/close', closeConversation);

export default router;
