import { Router } from 'express';
import {
    getBots,
    getBot,
    createBot,
    updateBot,
    deleteBot,
    toggleBotStatus,
    importN8nWorkflow
} from '../controllers/botController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
    .get(getBots)
    .post(createBot);

router.post('/import-n8n', importN8nWorkflow);

router.route('/:id')
    .get(getBot)
    .put(updateBot)
    .delete(deleteBot);

router.post('/:id/toggle', toggleBotStatus);

export default router;
