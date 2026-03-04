import { Router } from 'express';
import {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    startCampaign,
    pauseCampaign,
    getCampaignStats
} from '../controllers/campaignController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
    .get(getCampaigns)
    .post(createCampaign);

router.get('/stats', getCampaignStats);

router.route('/:id')
    .get(getCampaign)
    .put(updateCampaign)
    .delete(deleteCampaign);

router.post('/:id/start', startCampaign);
router.post('/:id/pause', pauseCampaign);

export default router;
