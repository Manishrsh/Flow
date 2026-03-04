import { Router } from 'express';
import { protect } from '../middleware/auth';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import Campaign from '../models/Campaign';
import Contact from '../models/Contact';

const router = Router();

router.use(protect);

// Get dashboard stats
router.get('/stats', async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { period = '7d' } = req.query;

        // Calculate date range
        const now = new Date();
        const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
        const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        // Messages stats
        const messageStats = await Message.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    sent: { $sum: { $cond: [{ $eq: ['$direction', 'outbound'] }, 1, 0] } },
                    received: { $sum: { $cond: [{ $eq: ['$direction', 'inbound'] }, 1, 0] } }
                }
            }
        ]);

        // Active conversations
        const activeConversations = await Conversation.countDocuments({
            userId,
            status: 'open'
        });

        // Total contacts
        const totalContacts = await Contact.countDocuments({ userId });

        // Campaign stats
        const campaignStats = await Campaign.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    running: { $sum: { $cond: [{ $eq: ['$status', 'running'] }, 1, 0] } },
                    totalSent: { $sum: '$stats.sent' },
                    totalDelivered: { $sum: '$stats.delivered' }
                }
            }
        ]);

        // Messages over time
        const messagesOverTime = await Message.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                messages: messageStats[0] || { total: 0, sent: 0, received: 0 },
                conversations: { active: activeConversations },
                contacts: { total: totalContacts },
                campaigns: campaignStats[0] || { total: 0, running: 0, totalSent: 0, totalDelivered: 0 },
                messagesOverTime
            }
        });
    } catch (error) {
        next(error);
    }
});

// Get recent activity
router.get('/activity', async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { limit = 10 } = req.query;

        const recentMessages = await Message.find({ userId })
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .populate('contactId', 'name phone')
            .select('content direction createdAt');

        res.json({
            success: true,
            data: recentMessages
        });
    } catch (error) {
        next(error);
    }
});

export default router;
