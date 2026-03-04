import { Router } from 'express';
import { protect } from '../middleware/auth';
import Template from '../models/Template';
import { getWhatsAppTemplates } from '../services/whatsappService';

const router = Router();

router.use(protect);

// Get all templates
router.get('/', async (req, res, next) => {
    try {
        const templates = await Template.find({ userId: req.user?._id });
        res.json({ success: true, data: templates });
    } catch (error) {
        next(error);
    }
});

// Sync with WhatsApp
router.post('/sync', async (req, res, next) => {
    try {
        const whatsappTemplates = await getWhatsAppTemplates();

        for (const template of whatsappTemplates) {
            await Template.findOneAndUpdate(
                { whatsappTemplateId: template.id },
                {
                    name: template.name,
                    category: template.category,
                    language: template.language,
                    status: template.status,
                    userId: req.user?._id,
                    whatsappTemplateId: template.id
                },
                { upsert: true, new: true }
            );
        }

        res.json({ success: true, message: 'Templates synced successfully' });
    } catch (error) {
        next(error);
    }
});

// Create template
router.post('/', async (req, res, next) => {
    try {
        const template = await Template.create({
            ...req.body,
            userId: req.user?._id
        });
        res.status(201).json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
});

// Get single template
router.get('/:id', async (req, res, next) => {
    try {
        const template = await Template.findOne({
            _id: req.params.id,
            userId: req.user?._id
        });
        res.json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
});

// Update template
router.put('/:id', async (req, res, next) => {
    try {
        const template = await Template.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            req.body,
            { new: true }
        );
        res.json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
});

// Delete template
router.delete('/:id', async (req, res, next) => {
    try {
        await Template.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?._id
        });
        res.json({ success: true, message: 'Template deleted' });
    } catch (error) {
        next(error);
    }
});

export default router;
